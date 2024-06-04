namespace Projectwerk.Domain.Interface;

public interface IBaseRepository<T> where T : class
{
    T GetById(int id);

    // PagedList<T> GetAll(QueryStringParameters parameters);
    T? Add(T entity);
    bool Update(T entity);
    bool Delete(T entity);

    /*
    Task<T> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
    */
}