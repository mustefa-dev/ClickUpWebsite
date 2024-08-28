namespace TicketSystem.Api.Auth.Models;

public class JwtConfig
{
    public required string Key { get; init; } 
    public required int AccessTokenLifetimeInMinutes { get; init; } = 1;
    public required int RefreshTokenLifetimeInDays { get; init; } = 30;
    public  required string Issuer { get; init; } = "Buildify";
    public required string Audience { get; init; } = "Buildify";
}
