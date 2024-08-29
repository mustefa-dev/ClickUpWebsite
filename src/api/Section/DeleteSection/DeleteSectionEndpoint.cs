using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Section;

public class DeleteSectionEndpoint : EndpointWithoutRequest
{
    private readonly TicketDbContext _dbContext;
    private readonly AutoMapper.IMapper _mapper;

    public DeleteSectionEndpoint( TicketDbContext dbContext, AutoMapper.IMapper mapper1)
    {
        _dbContext = dbContext;
        _mapper = mapper1;
    }

    public override void Configure()
    {
        Delete("sections/{id}");
        Roles(nameof(Role.Admin));
    }
    
    public override async Task HandleAsync(CancellationToken ct)
    {
        var id = Route<string>("id");
        if (!Ulid.TryParse(id, out var sectionId))
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("IdNotValid", "Section id is not valid")));
            return;
        }

        var section = await _dbContext.Sections
            .AsNoTracking()
            .Where(x => x.Id == sectionId)
            .FirstOrDefaultAsync(ct);

        if (section is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        _dbContext.Sections.Remove(section);
        await _dbContext.SaveChangesAsync(ct);
        await SendNoContentAsync(ct);
    }
}