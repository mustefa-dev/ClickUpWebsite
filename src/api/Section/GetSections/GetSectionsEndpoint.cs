using AutoMapper.QueryableExtensions;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Extensions;
using TicketSystem.Api.Data;
using TicketSystem.Api.Section.Shared;
using IMapper = AutoMapper.IMapper;

namespace TicketSystem.Api.Section.GetSections;

public class GetSectionsEndpoint : Endpoint<GetSectionsQuery, List<SectionResponse>>
{
    private readonly TicketDbContext _context;
    private readonly IMapper _mapper;

    public GetSectionsEndpoint(TicketDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;   
    }
    
    public override void Configure()
    {
        Get("sections");
    }
    
    public override async Task HandleAsync(GetSectionsQuery query, CancellationToken ct)
    {
        var response = await _context.Sections
            .ApplySorting(query)
            .ApplyPagination(query)
            .ProjectTo<SectionResponse>(_mapper.ConfigurationProvider)
            .ToListAsync(ct);

        await SendOkAsync(response, ct);
    }
}