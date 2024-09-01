using AutoMapper;
using TicketSystem.Api.Comments.Data;
using TicketSystem.Api.Comments.Data.Shared;
using TicketSystem.Api.Comments.Shared;

namespace TicketSystem.Api.Comments;

public class CommentProfile : Profile
{
    public CommentProfile()
    {
        CreateMap<Comment, CommentResponse>();
        CreateMap<AddCommentRequest, Comment>();
    }
}