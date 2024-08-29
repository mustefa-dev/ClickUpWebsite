using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Section.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Section.FindeSection;

public class FindSectionEndpoint : EndpointWithoutRequest
{
    private readonly TicketDbContext _dbContext;
    private readonly IMapper _mapper;

    public FindSectionEndpoint(IMapper mapper, TicketDbContext dbContext)
    {
        _mapper = mapper;
        _dbContext = dbContext;
    }

    public override void Configure()
    {
        Get("sections/{id}");
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
            .FirstOrDefaultAsync(x => x.Id == sectionId, ct);

        if (section is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        var response = _mapper.Map<SectionResponse>(section);
        await SendAsync(response);
    }
}