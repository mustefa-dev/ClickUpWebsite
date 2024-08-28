using AutoMapper;
using TicketSystem.Api.Auth.AddUser;
using TicketSystem.Api.Auth.Login;
using TicketSystem.Api.Auth.Shared;
using TicketSystem.Api.Auth.UpdateUser;

namespace TicketSystem.Api.Auth.Data;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserResponse>();
        CreateMap<User, LoginResponse>();
        CreateMap<AddUserRequest, User>();
        CreateMap<UpdateUserRequest, User>()
            .ForAllMembers(opts => opts.Condition((_, _, srcMember, _) => srcMember != null));
        // CreateMap<ResetUserPasswordRequest, User>()
        //     .ForAllMembers(opts => opts.Condition((_, _, srcMember, _) => srcMember != null));
    }
}
