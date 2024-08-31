using System.Net.WebSockets;

namespace TicketSystem.Api;

public class WebSocketServerConnectionManager
{
    private readonly List<WebSocket> _sockets = new();

    public async Task HandleWebSocketAsync(WebSocket webSocket, CancellationToken cancellationToken)
    {
        _sockets.Add(webSocket);

        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cancellationToken);
            if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by the WebSocket server", cancellationToken);
                _sockets.Remove(webSocket);
            }
        }
    }

    public async Task BroadcastAsync(string message, CancellationToken cancellationToken)
    {
        var tasks = _sockets.Select(socket => socket.SendAsync(
            new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes(message)),
            WebSocketMessageType.Text,
            true,
            cancellationToken));

        await Task.WhenAll(tasks);
    }
}