using FastEndpoints;
using FluentValidation;
using TicketSystem.Api.Auth.AddUser;

namespace TicketSystem.Api.Section.AddSection;

public class AddSectionRequestValidation : Validator<AddSectionRequest>
{
    public AddSectionRequestValidation()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}