using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.Middlewares;

public class UserInfoInjectorMiddleware
{
    private readonly RequestDelegate _next;

    public UserInfoInjectorMiddleware(RequestDelegate next)
    {
        _next = next;
    }


    public async Task InvokeAsync(HttpContext httpContext, TicketDbContext dbContext)
    {
        var userId = GetUserId(httpContext);
        if (userId is null)
        {
            httpContext.Items.Add("User", null);
            await _next(httpContext);
            return;
        }

        var user = await dbContext.Users
                                        .AsNoTracking()
                                        .Where(x => x.Id == userId)
                                        .FirstOrDefaultAsync();
        httpContext.Items.Add("User", user);
        await _next(httpContext);
    }


    private static Ulid? GetUserId(HttpContext httpContext)
    {
        var id = httpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(id) || !Ulid.TryParse(id, out var userId))
            return null;
        return userId;
    }
}
