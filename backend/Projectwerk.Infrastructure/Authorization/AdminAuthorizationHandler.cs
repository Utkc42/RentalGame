using Microsoft.AspNetCore.Authorization;

namespace Projectwerk.Infrastructure.Authorization;

public class AdminAuthorizationHandler : AuthorizationHandler<AdminRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AdminRequirement requirement)
    {
        if (context.User.IsInRole("Admin") || context.User.IsInRole("admin"))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
