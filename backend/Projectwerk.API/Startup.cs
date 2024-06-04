using System.Net;
using System.Text.Json.Serialization;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.OpenApi.Models;
using NLog;
using Projectwerk.API.Extensions;
using Projectwerk.Infrastructure.Authorization;
using Projectwerk.Infrastructure.Repositories;
using Projectwerk.REST.JWT;
using Projectwerk.REST.Mapping;
using Projectwerk.REST.Security;

namespace Projectwerk.API;

public class Startup
{
    public Startup(IConfiguration configuration)
    {
        LogManager.Setup().LoadConfigurationFromFile(Path.Combine(Directory.GetCurrentDirectory(), "nlog.config"));
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        var cs = Configuration.GetConnectionString("connectionString");
        var dockerActive = Environment.GetEnvironmentVariable("INSIDE_DOCKER_CONTAINER");
        if (!string.IsNullOrEmpty(dockerActive) && dockerActive.Equals("true"))
            cs = cs?.Replace("localhost", "host.docker.internal");

        services.AddAutoMapper(typeof(MappingConfig));

        // Database
        services.ConfigureSqlServer(Configuration);
        // CORS
        services.ConfigureCors();
        // RateLimiter
        services.ConfigureRateLimiter();
        // HealthChecks
        services.ConfigureAddHealthChecks();
        // JWT
        services.ConfigureAuthentication(Configuration);
        services.AddAuthorization(options =>
        {
            options.AddPolicy("AdminOnly", policy => { policy.Requirements.Add(new AdminRequirement()); });
        });
        // HTTPS
        // services.ConfigureHttpsRedirection();

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        services.AddAntiforgery(options => { options.SuppressXFrameOptionsHeader = true; });

        services.AddControllers().AddJsonOptions(options =>
        {
            options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        });

        services.ConfigureIISIntegration();
        // services.ConfigureHeaders();

        services.ConfigureLoggerService();

        // Repos
        services.AddScoped<GameRepository>();
        services.AddScoped<RentalRepository>();
        services.AddScoped<UserRepository>();
        services.AddScoped<TokenManager>();
        services.AddSingleton<IAuthorizationHandler, AdminAuthorizationHandler>();

        services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "JWTToken_Auth_API",
                Version = "v1"
            });
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description =
                    "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });
            c.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        },
                        Scheme = "oauth2",
                        Name = "Bearer",
                        In = ParameterLocation.Header
                    },
                    new List<string>()
                }
            });
        });
    }


    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // Define the custom headers
        var headers = new Dictionary<string, string>
        {
            { "X-Frame-Options", "DENY" },
            { "X-Xss-Protection", "1; mode=block" },
            { "X-Content-Type-Options", "nosniff" },
            { "Referrer-Policy", "no-referrer" },
            { "X-Permitted-Cross-Domain-Policies", "none" },
            {
                "Permissions-Policy",
                "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"
            }
        };

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            app.UseHsts();
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseHsts();
        }

        // app.UseHttpsRedirection();

        // Use CORS middleware
        app.UseCors(builder =>
        {
            builder.AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        });

        app.UseRateLimiter();
        app.UseHealthChecks("/working", new HealthCheckOptions
        {
            Predicate = _ => true,
            ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
        });

        app.Use(async (context, next) =>
        {
            foreach (var keyvalue in headers)
                if (!context.Response.Headers.ContainsKey(keyvalue.Key))
                    context.Response.Headers.Append(keyvalue.Key, keyvalue.Value);
            await next.Invoke();
        });

        app.UseForwardedHeaders(new ForwardedHeadersOptions
        {
            ForwardedHeaders = ForwardedHeaders.All
        });

        app.UseStaticFiles();

        app.UseRouting();
        app.UseAuthentication();
        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapHealthChecksUI();
        });

        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    Console.WriteLine($"Something went wrong: {contextFeature.Error}");

                    await context.Response.WriteAsJsonAsync(new
                    {
                        context.Response.StatusCode,
                        Message = "Internal Server Error."
                    });
                }
            });
        });
    }
}