using AutoMapper.QueryableExtensions;
using TicketSystem.Api.Common.Extensions;
using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.GetUsers;

public class GetUsersEndpoint : Endpoint<GetUsersQuery, List<UserResponse>>
{
    private readonly BuildifyDbContext _context;
    private readonly AutoMapper.IMapper _mapper;

    public GetUsersEndpoint(BuildifyDbContext context, AutoMapper.IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public override void Configure()
    {
        Get("users");
        Roles(nameof(Role.Admin));
    }


    public override async Task HandleAsync(GetUsersQuery query, CancellationToken ct)
    {
        var queryable = _context.Users.AsQueryable();
        if (!string.IsNullOrEmpty(query.Query))
        {
            var q = query.Query.ToLower();
            queryable = queryable
                        .Where(x => x.Username.ToLower().Contains(q));
        }

        if ((query.IncludeDeleted.HasValue && query.IncludeDeleted.Value == false) || !query.IncludeDeleted.HasValue) {
            queryable = queryable.Where(x => x.IsDeleted == false);
        }
        var response = await queryable
                                        .ApplySorting(query)
                                        .ApplyPagination(query)
                                        .ProjectTo<UserResponse>(_mapper.ConfigurationProvider)
                                        .ToListAsync(ct);
        await SendOkAsync(response);
    }
}
