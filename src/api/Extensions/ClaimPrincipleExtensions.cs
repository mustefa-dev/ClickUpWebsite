using System.Security.Claims;
using TicketSystem.Api.Auth.Data;

namespace TicketSystem.Api.Extensions;

public static class ClaimPrincipleExtensions
{
    public static bool IsNotInRole(this ClaimsPrincipal user, string role)
    {
        return !user.IsInRole(role);
    }

    public static bool IsAdmin(this ClaimsPrincipal user)
    {
        return user.IsInRole(nameof(Role.Admin));
    }

    public static bool IsUser(this ClaimsPrincipal user)
    {
        return user.IsInRole(nameof(Role.User));
    }
}
