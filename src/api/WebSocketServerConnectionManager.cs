using System.Net.WebSockets;
using System.Collections.Concurrent;

namespace TicketSystem.Api;

public class WebSocketServerConnectionManager
{
    private readonly ConcurrentDictionary<string, WebSocket> _userSockets = new();

    public async Task HandleWebSocketAsync(WebSocket webSocket, string userId, CancellationToken cancellationToken)
    {
        _userSockets[userId] = webSocket;

        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the WebSocket server", cancellationToken);
                _userSockets.TryRemove(userId, out _);
            }
        }
    }

    public async Task BroadcastAsync(string message, CancellationToken cancellationToken)
    {
        var tasks = _userSockets.Values.Select(socket => socket.SendAsync(
            new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(message)),
            WebSocketMessageType.Text,
            true,
            cancellationToken));

        await Task.WhenAll(tasks);
    }

    public async Task SendToUserAsync(string userId, string message, CancellationToken cancellationToken)
    {
        if (_userSockets.TryGetValue(userId, out var socket))
        {
            await socket.SendAsync(
                new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(message)),
                WebSocketMessageType.Text,
                true,
                cancellationToken);
        }
    }
}