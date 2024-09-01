using FastEndpoints;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Comments.Data;
using TicketSystem.Api.Comments.Shared;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using Microsoft.Extensions.Logging;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Comments.Data.Shared;

namespace TicketSystem.Api.Comments;

public class AddCommentEndpoint : Endpoint<AddCommentRequest, CommentResponse>
{
    private readonly TicketDbContext _context;
    private readonly AutoMapper.IMapper _mapper;
    private readonly ILogger<AddCommentEndpoint> _logger;

    public AddCommentEndpoint(AutoMapper.IMapper mapper, TicketDbContext context, ILogger<AddCommentEndpoint> logger)
    {
        _mapper = mapper;
        _context = context;
        _logger = logger;
    }

    public override void Configure()
    {
        Post("comments");
        Roles(nameof(Role.Admin));
    }

    public override async Task HandleAsync(AddCommentRequest request, CancellationToken ct)
    {
        var user = (User)HttpContext.Items["User"]!;
        var entity = _mapper.Map<Comment>(request);
        entity.Id = Ulid.NewUlid();
        entity.CreatorId = user.Id;

        await _context.Comments.AddAsync(entity, ct);
        await _context.SaveChangesAsync(ct);
        var response = _mapper.Map<CommentResponse>(entity);

        await SendAsync(response, StatusCodes.Status201Created, ct);
    }
}