using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Section.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Section.UpdateSection;

public class UpdateSectionEndpoint(TicketDbContext context, IMapper mapper)
    : Endpoint<UpdateSectionRequest, SectionResponse>
{
    private readonly TicketDbContext _context = context;
    private readonly IMapper _mapper = mapper;


    public override void Configure()
    {
        Patch("sections/{id}");
    }

    public override async Task HandleAsync(UpdateSectionRequest request, CancellationToken ct)
    {
        var id = Route<string>("id");
        if (!Ulid.TryParse(id, out var sectionId))
        {
            await SendResultAsync(
                Results.Extensions.FriendlyProblem(new Error("IdNotValid", "Section id is not valid")));
            return;
        }
        var sectionExists = await _context.Sections
            .AnyAsync(x => x.Name == request.Name && x.Id != sectionId, ct);

        if (sectionExists)
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("SectionNameAlreadyTaken", "Section name already taken", StatusCodes.Status409Conflict)));
            return;
        }
        var section = await _context.Sections
            .Where(x => x.Id == sectionId)
            .FirstOrDefaultAsync(ct);


        if (section is null)
        {
            await SendNotFoundAsync(ct);
            return;
        }

        _mapper.Map(request, section);
        await _context.SaveChangesAsync(ct);

        var response = _mapper.Map<SectionResponse>(section);
        await SendOkAsync(response, ct);
    }
}