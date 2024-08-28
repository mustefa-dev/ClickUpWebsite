namespace TicketSystem.Api.Auth.Services; 
public record DefaultAdminRequest(string Username, string Password, string FirstName, string LastName);