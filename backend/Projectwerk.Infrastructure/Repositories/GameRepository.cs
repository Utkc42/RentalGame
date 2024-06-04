using Microsoft.EntityFrameworkCore;
using Projectwerk.Infrastructure.Data;
using Projectwerk.Infrastructure.Models;

namespace Projectwerk.Infrastructure.Repositories;

public class GameRepository
{
    public GameRepository(RetroDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    private readonly RetroDbContext _dbContext;

    public async Task<IEnumerable<Game>> GetAll()
    {
        return await _dbContext.Games.ToListAsync();
    }

    public async Task<Game> GetById(int id)
    {
        return await _dbContext.Games.FirstOrDefaultAsync(g => g.GameId == id);
    }

    public async Task<Game> Create(Game entity)
    {
        _dbContext.Games.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task Update(Game entity)
    {
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var game = await _dbContext.Games.FindAsync(id);
        if (game != null)
        {
            game.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
        }
    }
}