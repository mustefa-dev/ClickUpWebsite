using TicketSystem.Api.MediaFiles.Data;

namespace TicketSystem.Api.MediaFiles.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder AddMedia(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<LocalFileSaverOptions>(builder.Configuration.GetSection("LocalFileSaver"));
        builder.Services.AddSingleton<IFileSaver, LocalFileService>();
        return builder;
    }
}
