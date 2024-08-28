using TicketSystem.Api.Auth.Middlewares;
using TicketSystem.Api.Auth.Services;

namespace TicketSystem.Api.Auth.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseAuth(this WebApplication app)
    {
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseMiddleware<UserInfoInjectorMiddleware>();
        return app;
    }

    public static async Task<WebApplication> InitAuthAsync(this WebApplication app, IConfiguration configuration)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var admins = configuration.GetSection("DefaultAdmins").Get<DefaultAdminRequest[]>() ?? Array.Empty<DefaultAdminRequest>();
        var userService = scope.ServiceProvider.GetRequiredService<AddAdminsService>();
        await userService.AddAsync(admins);
        return app;
    }
}
