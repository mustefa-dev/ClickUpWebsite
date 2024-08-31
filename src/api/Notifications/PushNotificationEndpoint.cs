using FastEndpoints;
using Microsoft.Extensions.Logging;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace TicketSystem.Api.Notifications;

public class PushNotificationEndpoint : Endpoint<PushNotificationRequest>
{
    private readonly ILogger<PushNotificationEndpoint> _logger;
    private readonly WebSocketServerConnectionManager _webSocketManager;

    public PushNotificationEndpoint(ILogger<PushNotificationEndpoint> logger, WebSocketServerConnectionManager webSocketManager)
    {
        _logger = logger;
        _webSocketManager = webSocketManager;
    }

    public override void Configure()
    {
        Post("/notifications/push");
        AllowAnonymous();
    }

    public override async Task HandleAsync(PushNotificationRequest req, CancellationToken ct)
    {
        _logger.LogInformation("Pushing notification to all users: {Title} - {Message}", req.Title, req.Message);

        var notification = JsonSerializer.Serialize(new { title = req.Title, message = req.Message });
        await _webSocketManager.BroadcastAsync(notification, ct);

        await SendOkAsync(ct);
    }
}