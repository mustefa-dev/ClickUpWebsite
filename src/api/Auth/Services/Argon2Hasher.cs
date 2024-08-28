using Isopoh.Cryptography.Argon2;

namespace TicketSystem.Api.Auth.Services;

public class Argon2Hasher : IHasher
{
    public string Hash(string raw)
        => Argon2.Hash(raw, timeCost: 4, memoryCost: 2048);

    public bool Matches(string hash, string raw)
        => Argon2.Verify(hash, raw);
}
