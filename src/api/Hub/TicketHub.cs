using Microsoft.AspNetCore.SignalR;

public class TicketHub : Hub
{
    public async Task JoinGroup(string userId)
    {
        try
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userId);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error joining group: {ex.Message}");
        }
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("id")?.Value;
        if (userId != null)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
        }
        await base.OnDisconnectedAsync(exception);
    }
}