using TicketSystem.Api.Common;

namespace TicketSystem.Api.MediaFiles.Data;

public interface IFileSaver
{
    Task<string> SaveAsync(string filename, Stream stream, CancellationToken cancellationToken = default);
    FileStream? GetStream(string filename);
}
