namespace TicketSystem.Api.Auth.ResetUserPassword;

public class ResetUserPasswordRequest
{
    public string OldPassword { get; set; } = string.Empty;
    public string NewPassword { get; set; } = string.Empty;
    public string NewPasswordConfirmation { get; set; } = string.Empty;
}