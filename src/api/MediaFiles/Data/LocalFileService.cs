using Microsoft.Extensions.Options;

namespace TicketSystem.Api.MediaFiles.Data;

public class LocalFileService : IFileSaver
{
    private readonly string _rootPath;

    public LocalFileService(IOptions<LocalFileSaverOptions> options)
    {
        _rootPath = options.Value.RootPath;
    }

    public async Task<string> SaveAsync(string filename, Stream stream, CancellationToken cancellationToken = default)
    {
        var path = Path.Combine(_rootPath, filename);
        await using var fileStream = File.Create(path);
        await stream.CopyToAsync(fileStream, cancellationToken);
        return filename;
    }

    public FileStream? GetStream(string filename)
    {
        var path = Path.Combine(_rootPath, filename);
        if (!File.Exists(path))
        {
            return null;
        }
        var stream = File.OpenRead(path);
        return stream;
    }
}

public class LocalFileSaverOptions
{
    public required string RootPath { get; init; }
    public required string RootPathToReturn { get; init; }
}
