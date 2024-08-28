namespace TicketSystem.Api.Auth.Services;

public interface IHasher
{
    string Hash(string raw);
    bool Matches(string hash, string raw);
}
