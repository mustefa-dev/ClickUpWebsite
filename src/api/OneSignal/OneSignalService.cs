using RestSharp;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace TicketSystem.Api.OneSignal
{
    public class OneSignalNotificationService
    {
        private readonly ILogger<OneSignalNotificationService> _logger;
        private const string OneSignalApiUrl = "https://onesignal.com/api/v1/notifications";
        private const string OneSignalAppId = "dd637b2c-eb92-45bf-b722-c3070f910806"; 
        private const string OneSignalApiKey = "NzI2NTBkMjctMmE0ZC00NWEwLTg1ZjEtNzZmMzg4ZjE0YzU0"; 

        public OneSignalNotificationService(ILogger<OneSignalNotificationService> logger)
        {
            _logger = logger;
        }

        public async Task SendNotificationToUsersByUlidAsync(string ticketTitle, string ticketNumber, List<Ulid> userUlids)
        {
            _logger.LogInformation("Sending notification for ticket: {TicketTitle} (#{TicketNumber}) to specific users", ticketTitle, ticketNumber);

            var client = new RestClient(OneSignalApiUrl);
            var request = new RestRequest("", Method.Post);

            request.AddHeader("Authorization", $"Basic {OneSignalApiKey}");
            request.AddHeader("Content-Type", "application/json");

            var userExternalIds = userUlids.Select(id => id.ToString()).ToList();

            var body = new
            {
                app_id = OneSignalAppId,
                headings = new { en = "New Ticket Assigned" },
                contents = new { en = $"Ticket: {ticketTitle} (#{ticketNumber})" },
                include_external_user_ids = userExternalIds 
            };

            request.AddJsonBody(body);

            try
            {
                var response = await client.ExecuteAsync(request);

                if (!response.IsSuccessful)
                {
                    _logger.LogError("Error sending notification: {ErrorMessage}, StatusCode: {StatusCode}, ResponseContent: {ResponseContent}",
                        response.ErrorMessage, response.StatusCode, response.Content);
                    throw new Exception($"Error sending notification: {response.Content}");
                }

                _logger.LogInformation("Notification sent successfully: {ResponseContent}", response.Content);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception occurred while sending notification.");
                throw new Exception("Error sending notification", ex);
            }
        }


    }
}
