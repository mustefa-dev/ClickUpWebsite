using FastEndpoints;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Data;
using TicketSystem.Api.MediaFiles.Data;
using TicketSystem.Api.MediaFiles.UploadMedia;

namespace TicketSystem.Api.Files.UploadFile;

public sealed class UploadFileEndpoint : Endpoint<UploadMediaRequest, Ulid[]>
{
    private readonly TicketDbContext _context;
    private readonly IFileSaver _fileSaver;

    public UploadFileEndpoint(TicketDbContext context, IFileSaver fileSaver)
    {
        _context = context;
        _fileSaver = fileSaver;
    }

    public override void Configure()
    {
        Post("/media");
        AllowFileUploads();
    }

    public override async Task HandleAsync(UploadMediaRequest req, CancellationToken ct)
    {
        var form = await HttpContext.Request.ReadFormAsync(ct);
        if (form.Files.Count <= 0)
        {
            await SendResultAsync(Results.BadRequest("No files uploaded"));
            return;
        }

        var now = DateTimeOffset.UtcNow;
        var mediaFiles = new List<Media>();
        foreach (var file in form.Files)
        {
            var id = Ulid.NewUlid(now);
            var extension = Path.GetExtension(file.FileName) ?? ".none";
            var Media = new Media
            {
                Name = file.FileName,
                Extension = extension,
                Id = id,
                Size = file.Length,
                Path = await _fileSaver.SaveAsync($"{id}{extension}", file.OpenReadStream(), ct),
                UploaderId = ((User?)HttpContext.Items["User"])?.Id,
            };
            mediaFiles.Add(Media);
        }

        await _context.Medias.AddRangeAsync(mediaFiles, ct);
        await _context.SaveChangesAsync(ct);

        var result = mediaFiles.Select(x => x.Id).ToArray();
        await SendAsync(result, StatusCodes.Status201Created, ct);
    }
}
