using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using Projectwerk.Domain.Interface;

namespace Projectwerk.Infrastructure.Repositories;

public abstract class BaseRepository<C, T, RT> : IBaseRepository<T> where C : DbContext where T : class where RT : class
{
    protected readonly C _dbContext;

    public BaseRepository(C dbContext)
    {
        _dbContext = dbContext;
    }

    public IQueryable<RT> FindAll()
    {
        return _dbContext.Set<RT>();
    }

    public IQueryable<RT> FindByCondition(Expression<Func<RT, bool>> expression)
    {
        return _dbContext.Set<RT>()
            .Where(expression);
    }

    public abstract T GetById(int id);
    // public abstract PagedList<T> GetAll(QueryStringParameters parameters);

    public abstract T? Add(T entity);

    public abstract bool Update(T entity);

    public abstract bool Delete(T entity);
}