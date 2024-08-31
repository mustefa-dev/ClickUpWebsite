using FastEndpoints;
using Microsoft.Extensions.Logging;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using TicketSystem.Api.Hubs;

namespace TicketSystem.Api.Notifications;

public class PushNotificationEndpoint : Endpoint<PushNotificationRequest>
{
    private readonly ILogger<PushNotificationEndpoint> _logger;
    private readonly IHubContext<NotificationsHub> _hubContext;

    public PushNotificationEndpoint(ILogger<PushNotificationEndpoint> logger, IHubContext<NotificationsHub> hubContext)
    {
        _logger = logger;
        _hubContext = hubContext;
    }

    public override void Configure()
    {
        Post("/notifications/push");
        AllowAnonymous();
    }

    public override async Task HandleAsync(PushNotificationRequest req, CancellationToken ct)
    {
        _logger.LogInformation("Pushing notification to all users: {Title} - {Message}", req.Title, req.Message);

        var notification = new { title = req.Title, message = req.Message };
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification, ct);

        await SendOkAsync(ct);
    }
}