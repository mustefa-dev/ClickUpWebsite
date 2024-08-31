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
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketSystem.Api.Hubs;
using TicketSystem.Api.Notifications;

var builder = WebApplication.CreateBuilder(args);
if (builder.Environment.IsDevelopment())
    builder.Configuration.AddJsonFile("appsettings.Local.json", optional: true, reloadOnChange: true);

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(opts => opts.AddDefaultPolicy(policy =>
{
    policy.WithOrigins("http://localhost:63342")
        .WithOrigins("http://192.168.159.137:3002")
        .AllowAnyHeader()
          .AllowAnyMethod()
          .AllowCredentials();
}));

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
builder.Services.AddSignalR();

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

app.UseRouting();

app.UseAuthorization(); // Add this line

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<NotificationsHub>("/notifications");
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