namespace TicketSystem.Api.Common;

public static class CommonErrors
{
    public static Error AppIdNotSet = new Error("AppIdNotSet", "appId is not set", (int)StatusCode.Unauthorized);
    public static Error SubscriptionExpired = new Error("SubscriptionExpired", "Subscription has expired. Please call the company.", (int)StatusCodes.Status402PaymentRequired);

}
