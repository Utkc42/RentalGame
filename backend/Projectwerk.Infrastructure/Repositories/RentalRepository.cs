using Microsoft.EntityFrameworkCore;
using Projectwerk.Infrastructure.Data;
using Projectwerk.Infrastructure.Models;

namespace Projectwerk.Infrastructure.Repositories;

public class RentalRepository
{
    public RentalRepository(RetroDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private readonly RetroDbContext _dbContext;

    public async Task<IEnumerable<Rental>> GetAll()
    {
        return await _dbContext.Rentals
            .Include(r => r.Game)
            .Include(r => r.User)
            .ToListAsync();
    }

    public async Task<IEnumerable<Rental>> GetRentalsForUser(int userId)
    {
        return await _dbContext.Rentals
            .Include(r => r.Game)
            .Include(r => r.User)
            .Where(r => r.User.UserId == userId)
            .ToListAsync();
    }

    public async Task<Rental> GetById(int id)
    {
        return await _dbContext.Rentals.Include(r => r.User).FirstOrDefaultAsync(r => r.RentalId == id);
    }

    public async Task<Rental> Create(Rental entity)
    {
        _dbContext.Rentals.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task Update(Rental entity)
    {
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var rental = await _dbContext.Rentals.FindAsync(id);
        if (rental != null)
        {
            rental.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<(Rental?, string, string)> GetRentalWithGameAndUserByGameId(int gameId)
    {
        var rentalWithGameAndUser = await _dbContext.Rentals
            .Where(r => r.GameId == gameId)
            .Select(r => new
            {
                Rental = r,
                GameName = r.Game.Name, // Include only the Name property of the Game entity
                UserFirstName = r.User.FirstName, // Include only the FirstName property of the User entity
                UserLastName = r.User.LastName // Include only the LastName property of the User entity
            })
            .FirstOrDefaultAsync();

        // If no rental is found, return null for all entities
        if (rentalWithGameAndUser == null)
            return (null, null, null);

        return (rentalWithGameAndUser.Rental, rentalWithGameAndUser.GameName,
            $"{rentalWithGameAndUser.UserFirstName} {rentalWithGameAndUser.UserLastName}");
    }
}