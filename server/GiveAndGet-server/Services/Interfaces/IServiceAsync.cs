using Services.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IServiceAsync<T>
    {
        Task<T> AddItemAsync(T item);
        Task<T> GetAsync(int id);
        Task<List<T>> GetAllAsync();
        Task<T> UpdateAsync(int id, T entity);
        Task DeleteAsync(int id);
    }

    public interface IMessageExtensionService : IServiceAsync<MessageDto>
    {
        Task<List<MessageDto>> GetByExchangeIdAsync(int exchangeId);
    }
}
