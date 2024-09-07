using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace TicketSystem.Api.OneSignal;

public class OneSignalService
{
    private readonly HttpClient _httpClient;
    private readonly string _oneSignalAppId;
    private readonly string _oneSignalApiKey;
    private readonly ILogger<OneSignalService> _logger;

    public OneSignalService(HttpClient httpClient, IConfiguration configuration, ILogger<OneSignalService> logger)
    {
        _httpClient = httpClient;
        _oneSignalAppId = configuration["OneSignal:AppId"];
        _oneSignalApiKey = configuration["OneSignal:ApiKey"];
        _logger = logger;
    }

    public async Task SendNotificationAsync(string title, string message, List<string> playerIds)
    {
        // Generate UUIDs from the player IDs
        var uuidPlayerIds = GenerateUuidsFromPlayerIds(playerIds);

        if (!uuidPlayerIds.Any())
        {
            _logger.LogError("No valid player IDs provided.");
            throw new ArgumentException("No valid player IDs provided.");
        }

        // Create payload according to OneSignal's API structure
        var payload = new
        {
            app_id = _oneSignalAppId,
            headings = new { en = title },
            contents = new { en = message },
            include_player_ids = uuidPlayerIds
        };

        var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(HttpMethod.Post, "https://onesignal.com/api/v1/notifications")
        {
            Headers =
            {
                { "Authorization", $"Basic {_oneSignalApiKey}" }
            },
            Content = content
        };

        _logger.LogInformation("Sending notification with payload: {Payload}", JsonConvert.SerializeObject(payload));

        try
        {
            var response = await _httpClient.SendAsync(request);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("Response status: {StatusCode}, Content: {ResponseContent}", response.StatusCode, responseContent);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to send notification. Status Code: {StatusCode}, Response: {ResponseContent}", response.StatusCode, responseContent);
                throw new HttpRequestException($"Error sending notification. StatusCode: {response.StatusCode}, Response: {responseContent}");
            }

            response.EnsureSuccessStatusCode();
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError("HttpRequestException: {Message}", ex.Message);
            throw;
        }
        catch (Exception ex)
        {
            _logger.LogError("Unexpected error while sending notification: {Message}", ex.Message);
            throw;
        }
    }

    private List<string> GenerateUuidsFromPlayerIds(List<string> playerIds)
    {
        // Generate UUIDs based on the number of player IDs provided
        return playerIds.Select(_ => Guid.NewGuid().ToString()).ToList();
    }
}
