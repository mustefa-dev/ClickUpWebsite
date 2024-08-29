using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TicketSystem.Api.Data;
using TicketSystem.Api.MediaFiles.Data;
using TicketSystem.Api.MediaFiles.Shared;

namespace TicketSystem.Api.MediaFiles.MediaDetails;

public class MediaDetailsEndpoint : EndpointWithoutRequest<MediaDetailsResponse>
{
    private readonly TicketDbContext _context;
    private readonly IOptions<LocalFileSaverOptions> _options;

    public MediaDetailsEndpoint(TicketDbContext context, IOptions<LocalFileSaverOptions> options)
    {
        _context = context;
        _options = options;
    }

    public override void Configure()
    {
        Get("/media/{id}/details");
        AllowAnonymous(Http.GET);
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        if (!Ulid.TryParse(Route<string>("id"), out var id))
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var file = await _context.Medias
            .Where(x => x.Id == id)
            .Select(x => new { x.Path, x.Name, x.Size, x.Extension })
            .FirstOrDefaultAsync(ct);
        if (file is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }
        var virtualPath = _options.Value.RootPathToReturn;
        var extension = file.Extension.StartsWith('.') ? file.Extension : $".{file.Extension}";
        var filename = $"{id}{extension}";
        var url = "";

        if (virtualPath == null) {
            url = $"http://{HttpContext.Request.Host.Host}/media/{id}";
        }
        else
        {
            url = $"https://{HttpContext.Request.Host.Host}{virtualPath}/{filename}";
        }

        var response = new MediaDetailsResponse{
            FileId = id,
            Filename = filename,
            Url = url,
            FileType = FileTypeHelper.GetFileType(extension),
            FileExtension = extension,
            FileSize = file.Size
        };
        await SendOkAsync(response, ct);
        return;
    }
}
