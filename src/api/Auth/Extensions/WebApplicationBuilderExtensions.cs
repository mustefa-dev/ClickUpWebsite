using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TicketSystem.Api.Auth.Models;
using TicketSystem.Api.Auth.Services;

namespace TicketSystem.Api.Auth.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder AddAuth(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<JwtConfig>(builder.Configuration.GetSection("Jwt"));
        builder.Services
            .AddSingleton<IHasher, Argon2Hasher>()
            .AddSingleton<JwtService>()
            .AddScoped<AddAdminsService>();
        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new Exception("Jwt:Key is not set."))),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        builder.Services.AddAuthorization();
        return builder;
    }
}
