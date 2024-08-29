using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Auth.Data;
using TicketSystem.Api.Data;

namespace TicketSystem.Api.Auth.Services;

public class AddAdminsService 
{
    private readonly IHasher _hasher;
    private readonly TicketDbContext _context;
    public AddAdminsService(TicketDbContext context, IHasher hasher, JwtService jwtService, IMapper mapper) 
    {
        _context = context;
        _hasher = hasher;
    }
    public async Task AddAsync(IEnumerable<DefaultAdminRequest> defaultAdminRequests)
    {
        var existingUsernames = await _context.Users
            .Where(x => x.Role == Role.Admin)
            .Select(x => x.Username)
            .ToListAsync();
        var admins = defaultAdminRequests
            .Where(x => !existingUsernames.Contains(x.Username))
            .Select(x => new User
            {
                Id = Ulid.NewUlid(),
                FirstName = x.FirstName,
                Username = x.Username,
                Password = _hasher.Hash(x.Password),
                Role = Role.Admin,
            })
            .ToArray();
        if (admins.Length < 1)
            return;
        await _context.AddRangeAsync(admins);
         await _context.SaveChangesAsync();
    }
}
