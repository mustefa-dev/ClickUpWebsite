using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TicketSystem.Api.Data;
using TicketSystem.Api.MediaFiles.Data;

namespace TicketSystem.Api.Files.UploadFile;

public sealed class FindMediaEndpoint : EndpointWithoutRequest<Media>
{
    private readonly TicketDbContext _context;
    private readonly IOptions<LocalFileSaverOptions> _options;

    public FindMediaEndpoint(TicketDbContext context, IOptions<LocalFileSaverOptions> options)
    {
        _context = context;
        _options = options;
    }

    public override void Configure()
    {
        Get("/media/{id}");
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

        if (string.IsNullOrWhiteSpace(_options.Value.RootPathToReturn))
        {
            var stream = File.OpenRead(file.Path);
            await SendStreamAsync(stream, file.Name, file.Size, $"image/{file.Extension.Replace(".", "")}", id.Time, true, ct);
        }
        else
        {
            var virtualPath = _options.Value.RootPathToReturn;
            var extension = file.Extension.StartsWith('.') ? file.Extension : $".{file.Extension}";
            var path = $"{virtualPath}/{id}{extension}"; // Constructs path as '/images/{id}.{extension}'

            await SendRedirectAsync(path);
        }
    }
}
