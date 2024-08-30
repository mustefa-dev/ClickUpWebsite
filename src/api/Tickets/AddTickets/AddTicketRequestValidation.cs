using FluentValidation;

namespace TicketSystem.Api.Tickets.AddTickets;

public class AddTicketRequestValidation : AbstractValidator<AddTicketRequest>
{
    public AddTicketRequestValidation()
    {
        RuleFor(x => x.TicketTitle)
            .NotEmpty().WithMessage("Ticket title is required.")
            .MaximumLength(100).WithMessage("Ticket title must not exceed 100 characters.");

        // RuleFor(x => x.CurrentStatus)
        //     .IsInEnum().WithMessage("Invalid status value.");

        // RuleFor(x => x.CreatorId)
        //     .NotEmpty().WithMessage("Creator ID is required.");

        RuleFor(x => x.AssignedUserId)
            .NotEmpty().WithMessage("Assigned user ID is required.");

        // RuleFor(x => x.LastUpdated)
        //     .NotEmpty().WithMessage("Last updated date is required.");

        // RuleFor(x => x.TicketNumber)
        //     .NotEmpty().WithMessage("Ticket ID is required.");
    }
}