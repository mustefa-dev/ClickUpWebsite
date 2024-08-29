using AutoMapper;
using TicketSystem.Api.Section.AddSection;
using TicketSystem.Api.Section.Data;
using TicketSystem.Api.Section.Shared;
using TicketSystem.Api.Section.UpdateSection;


namespace Buildify.Api.Blogs.Data;

public class BlogProfile : Profile
{
    public BlogProfile()
    {
        CreateMap<Sections, SectionResponse>();
        CreateMap<AddSectionRequest, Sections>();
        CreateMap<UpdateSectionRequest, Sections>();
    }
}