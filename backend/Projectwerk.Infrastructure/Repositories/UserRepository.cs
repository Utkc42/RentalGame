using Projectwerk.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;
using Projectwerk.Infrastructure.Data;

namespace Projectwerk.Infrastructure.Repositories;

public class UserRepository
{
    public UserRepository(RetroDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    private readonly RetroDbContext _dbContext;

    public async Task<IEnumerable<User>> GetAll()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task<User> GetById(int id)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.UserId == id);
    }

    public async Task<User> Create(User entity)
    {
        _dbContext.Users.Add(entity);
        await _dbContext.SaveChangesAsync();
        return entity;
    }

    public async Task Update(User entity)
    {
        _dbContext.Entry(entity).State = EntityState.Modified;
        await _dbContext.SaveChangesAsync();
    }

    public async Task Delete(int id)
    {
        var user = await _dbContext.Users.FindAsync(id);
        if (user != null)
        {
            user.IsDeleted = true;
            await _dbContext.SaveChangesAsync();
        }
    }

    public async Task<User> Login(string email, string password)
    {
        // Find the user by email
        var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            // User with provided email doesn't exist
            return null;
        }

        // Verify the password using BCrypt
        if (BCrypt.Net.BCrypt.Verify(password, user.Password))
        {
            // Password matches, return the user
            return user;
        }
        else
        {
            // Password doesn't match
            return null;
        }
    }
}