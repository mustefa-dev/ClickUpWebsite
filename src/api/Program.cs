using System.Text.Json.Serialization;
using Cysharp.Serialization.Json;
using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using TicketSystem.Api.Auth.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.MediaFiles.Data;
using TicketSystem.Api.MediaFiles.Extensions;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using TicketSystem.Api;

var builder = WebApplication.CreateBuilder(args);
if (builder.Environment.IsDevelopment())
    builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(opts => opts.AddDefaultPolicy(x => x.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin()));

builder.Services.AddDbContext<TicketDbContext>(opts =>
{
    opts.UseNpgsql(
        builder.Configuration.GetConnectionString("PostgreConnection")
    );
    if (builder.Environment.IsDevelopment())
    {
        opts.EnableSensitiveDataLogging();
    }
});

builder.Services.ConfigureHttpJsonOptions(o =>
{
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    o.SerializerOptions.Converters.Add(new UlidJsonConverter());
});
builder.Services.Configure<JsonOptions>(o =>
{
    o.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
    o.SerializerOptions.Converters.Add(new UlidJsonConverter());
});

builder.Services.AddFastEndpoints();
builder.Services.SwaggerDocument();
builder.Services.AddSingleton<WebSocketServerConnectionManager>();

builder
    .AddAuth()
    .AddMedia();

var app = builder.Build();

app.UseAuth()
   .UseFastEndpoints();

var localFileSaverOptions = builder.Configuration.GetSection("LocalFileSaver").Get<LocalFileSaverOptions>();
var testpath = localFileSaverOptions?.RootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "media");
if (Directory.Exists(testpath) == false)
    Directory.CreateDirectory(testpath);

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(testpath),
    RequestPath = localFileSaverOptions?.RootPathToReturn ?? "/files"
});

if (app.Environment.IsDevelopment())
    app.UseDeveloperExceptionPage();
else
    app.UseHsts();

app.UseSwaggerGen();

app.UseHttpsRedirection();
app.UseCors();

app.UseWebSockets();

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var manager = context.RequestServices.GetRequiredService<WebSocketServerConnectionManager>();
            await manager.HandleWebSocketAsync(webSocket, context.Request.Query["userId"], context.RequestAborted);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/swagger");
        return;
    }
    await next();
});

using var scope = app.Services.CreateAsyncScope();
using var context = scope.ServiceProvider.GetRequiredService<TicketDbContext>();
context.Database.Migrate();
await app.InitAuthAsync(builder.Configuration);

app.Run();