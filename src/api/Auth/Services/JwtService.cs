using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Login;
using TicketSystem.Api.Auth.Models;
using TicketSystem.Api.Auth.Shared;

namespace TicketSystem.Api.Auth.Services;

public class JwtService
{
    private readonly SymmetricSecurityKey _secretKey;
    private readonly JwtConfig _config;

    public JwtService(IOptions<JwtConfig> config)
    {
        _config = config.Value;
        _secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.Key));
    }

    public void GenerateTokens(LoginResponse response)
    {
        GenerateAccessToken(response);
        GenerateRefreshToken(response);
    }

    public LoginResponse GenerateTokens(UserResponse response)
    {
        var loginResponse = new LoginResponse
        {
            FirstName = response.FirstName,
            LastName = response.LastName,
            Username = response.Username,
            Id = response.Id,
            Role = response.Role,
        };
        GenerateAccessToken(loginResponse);
        GenerateRefreshToken(loginResponse);
        return loginResponse;
    }

    public Ulid? GetUserId(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            return null;
        }
        var tokenHandler = new JwtSecurityTokenHandler();
        tokenHandler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = _secretKey,
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
        }, out var validatedToken);
        if (validatedToken is not JwtSecurityToken jwtToken)
        {
            return null;
        }
        var id = jwtToken.Claims.First(x => x.Type == ClaimTypes.NameIdentifier).Value;
        return Ulid.Parse(id);
    }

    private void GenerateAccessToken(LoginResponse response)
    {
        var signinCredentials = new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256);
        var claims = new Claim[]
        {
            new(ClaimTypes.NameIdentifier, response.Id.ToString()),
            new(ClaimTypes.Name, response.Username),
            new(ClaimTypes.GivenName, response.FirstName ?? response.Username),
            new(ClaimTypes.Surname, response.LastName?? ""),
            new(ClaimTypes.Role, GetRole(response.Role)),
            new("type", "Access")
        };
        var tokeOptions = new JwtSecurityToken(
            issuer: _config.Issuer,
            audience: _config.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_config.AccessTokenLifetimeInMinutes),
            signingCredentials: signinCredentials
        );
        response.AccessToken = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
    }

    private void GenerateRefreshToken(LoginResponse response)
    {
        var signinCredentials = new SigningCredentials(_secretKey, SecurityAlgorithms.HmacSha256);
        var claims = new Claim[]
        {
            new(ClaimTypes.NameIdentifier, response.Id.ToString()),
            new("type", "Refresh")
        };
        var tokeOptions = new JwtSecurityToken(
            issuer: _config.Issuer,
            audience: _config.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_config.RefreshTokenLifetimeInDays),
            signingCredentials: signinCredentials
        );
        response.RefreshToken = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
    }

    private static string GetRole(Role role)
        => role switch
        {
            Role.Admin => "Admin",
            Role.User => "User",
            _ => throw new ArgumentOutOfRangeException(nameof(role), role, null)
        };
}
