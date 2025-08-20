using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IRepositoryAsync<T>
    {
        Task<List<T>> GetAllAsync();
        Task<T> GetAsync(int id);
        Task<T> AddItemAsync(T item);
        Task<T> UpdateAsync(int id, T entity);
        Task DeleteAsync(int id);
    }

    public interface IMessageExtensionRepository : IRepositoryAsync<Message>
    {
        Task<List<Message>> GetByExchangeIdAsync(int exchangeId);

    }
}
