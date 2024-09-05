using FluentValidation;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketRequestValidation : AbstractValidator<AddTicketRequest>
{
    public AddTicketRequestValidation()
    {
        RuleFor(x => x.TicketTitle)
            .NotEmpty().WithMessage("Ticket title is required.")
            .MaximumLength(100).WithMessage("Ticket title must not exceed 100 characters.");

        RuleFor(x => x.AssignedUserIds)
            .NotEmpty().WithMessage("Assigned user IDs are required.");
    }
}