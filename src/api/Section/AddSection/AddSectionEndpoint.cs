using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Section.Data;
using TicketSystem.Api.Section.Shared;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Section.AddSection;

public class AddSectionEndpoint : Endpoint<AddSectionRequest, SectionResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public AddSectionEndpoint(AutoMapper.IMapper mapper, TicketDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public override void Configure()
    {
        Post("sections");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(AddSectionRequest request, CancellationToken ct)
    {
        var user = (User)HttpContext.Items["User"]!;
        var entity = _mapper.Map<Sections>(request);
        entity.Id = Ulid.NewUlid();
        entity.IsDeleted = false;
        entity.CreatedBy = user.Id;

        var sectionExists = await _context.Sections.AnyAsync(x => x.Name == entity.Name, ct);

        if (sectionExists)
        {
            await SendResultAsync(Results.Extensions.FriendlyProblem(new Error("SectionNameAlreadyTaken", "Section name already taken", StatusCodes.Status409Conflict)));
            return;
        }

        await _context.Sections.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
        var response = _mapper.Map<SectionResponse>(entity);
        await SendAsync(response, StatusCodes.Status201Created, ct);
    }
}