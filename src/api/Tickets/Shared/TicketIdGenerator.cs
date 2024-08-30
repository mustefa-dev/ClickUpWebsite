using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Tickets.Shared
{
    public static class TicketIdGenerator
    {
        public static async Task<long> GenerateTicketId(TicketDbContext context)
        {
            var lastTicket = await context.Tickets
                .OrderByDescending(t => t.TicketNumber)
                .FirstOrDefaultAsync();

            return (lastTicket?.TicketNumber ?? 0) + 1;
        }
    }
}