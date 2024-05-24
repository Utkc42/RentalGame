using System.Text;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Projectwerk.API.LoggerService;
using Projectwerk.Infrastructure.Data;
using Projectwerk.REST.Security;

namespace Projectwerk.API.Extensions;

public static class ServiceExtensions
{
    // Set up the database connection
    public static void ConfigureSqlServer(this IServiceCollection services, IConfiguration config)
    {
        var connectionString = config.GetConnectionString("connectionString");

        services.AddDbContext<RetroDbContext>(options => { options.UseSqlServer(connectionString); },
            ServiceLifetime.Scoped, ServiceLifetime.Singleton);
    }

    // JWT
    public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(o =>
        {
            o.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey
                    (Encoding.UTF8.GetBytes(configuration["Jwt:Key"])),

                ClockSkew = TimeSpan.Zero
            };
        });
    }


    // Ratelimiter
    public static void ConfigureRateLimiter(this IServiceCollection services)
    {
        services.AddRateLimiter(options =>
        {
            options.GlobalLimiter = PartitionedRateLimiter.CreateChained(
                PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), partition =>
                            new FixedWindowRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                PermitLimit = 600,
                                Window = TimeSpan.FromMinutes(1)
                            })),
                PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
                    RateLimitPartition.GetFixedWindowLimiter(
                        httpContext.User.Identity?.Name ?? httpContext.Request.Headers.Host.ToString(), partition =>
                            new FixedWindowRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                PermitLimit = 6000,
                                Window = TimeSpan.FromHours(1)
                            })));

            options.OnRejected = async (context, token) =>
            {
                context.HttpContext.Response.StatusCode = 429;
                if (context.Lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter))
                    await context.HttpContext.Response.WriteAsync(
                        $"Too many requests. Please try again after {retryAfter.TotalMinutes} minute(s).", token);
                else
                    await context.HttpContext.Response.WriteAsync(
                        "Too many requests. Please try again later.", token);
            };
        });
    }

    // CORS
    public static void ConfigureCors(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy",
                builder => builder
                    // .WithOrigins("http://localhost:5000",
                    //     "https://localhost:5001") //.SetIsOriginAllowed(origin => true)
                    .AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                /*.AllowCredentials() */); // AllowCredentials() niet samen met AllowAnyOrigin()
        });
    }

    // Health Checks
    public static void ConfigureAddHealthChecks(this IServiceCollection services)
    {
        services.AddHealthChecks()
            .AddCheck<DbContextHealthCheck<RetroDbContext>>("WebApiDbContextHealthCheck");

        services.AddHealthChecksUI(setup =>
        {
            setup.DisableDatabaseMigrations();
            //setup.SetEvaluationTimeInSeconds(5); // Configures the UI to poll for health checks updates every 5 seconds
            //setup.SetApiMaxActiveRequests(1); //Only one active request will be executed at a time. All the excedent requests will result in 429 (Too many requests)
            setup.MaximumHistoryEntriesPerEndpoint(
                50); // Set the maximum history entries by endpoint that will be served by the UI api middleware
            //setup.SetNotifyUnHealthyOneTimeUntilChange(); // You will only receive one failure notification until the status changes

            setup.AddHealthCheckEndpoint("EFCore connection", "/working");
        }).AddInMemoryStorage();
    }

    // HTTPS Port
    public static void ConfigureHttpsRedirection(this IServiceCollection services)
    {
        services.AddHttpsRedirection(options =>
        {
            options.HttpsPort = 8082; // Set the desired HTTPS port here
        });
    }

    public static void ConfigureLoggerService(this IServiceCollection services)
    {
        services.AddSingleton<ILoggerManager, LoggerManager>();
    }

    public static void ConfigureIISIntegration(this IServiceCollection services)
    {
        services.Configure<IISOptions>(options => { });
    }
}