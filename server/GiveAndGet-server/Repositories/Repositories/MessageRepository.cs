using Microsoft.EntityFrameworkCore;
using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repositories.Repositories
{
    public class MessageRepository : IMessageExtensionRepository
    {
        private readonly IContext context;

        public MessageRepository(IContext context)
        {
            this.context = context;
        }

        public async Task<Message> AddItemAsync(Message item)
        {
            await context.Messages.AddAsync(item);
            await context.SaveAsync();
            return await GetAsync(item.Id);
        }

        public async Task DeleteAsync(int id)
        {
            var message = await GetAsync(id);
            if (message != null)
            {
                context.Messages.Remove(message);
                await context.SaveAsync();
            }
        }

        public async Task<Message> GetAsync(int id)
        {
            return await context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public Task<List<Message>> GetAllAsync()
        {
            throw new System.NotImplementedException();
        }

        public async Task<List<Message>> GetByExchangeIdAsync(int exchangeId)
        {
            return await context.Messages
                .Where(m => m.ExchangeId == exchangeId)
                .OrderBy(m => m.Time)
                .ToListAsync();
        }

        public Task<Message> UpdateAsync(int id, Message entity)
        {
            throw new System.NotImplementedException();
        }
    }
}
