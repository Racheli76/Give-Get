using Microsoft.EntityFrameworkCore;
using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class ExchangeRepository : IExchangeExtensionRepository
    {
        private readonly IContext context;
        public ExchangeRepository(IContext context)
        {
            this.context = context;
        }

        public Exchange AddItem(Exchange item)
        {
            context.Exchanges.Add(item);
            context.Save();
            return Get(item.Id);
        }

        public void Delete(int id)
        {
            context.Exchanges.Remove(Get(id));
            context.Save();
        }

        public Exchange Get(int id)
        {
            return context.Exchanges.FirstOrDefault(e => e.Id == id);
        }
        public List<Exchange> GetByUserId(int userId)
        {
            return context.Exchanges.Where(e=> e.User1Id==userId || e.User2Id==userId).ToList();
        }

        public List<Exchange> GetAll()
        {
            return context.Exchanges.ToList();
        }

        public Exchange Update(int id, Exchange entity)
        {
            var existing = Get(id);
            if (existing != null)
            {
                existing.User1Id = entity.User1Id;
                existing.User2Id = entity.User2Id;
                existing.Status = entity.Status;
                existing.Talent1Offered = entity.Talent1Offered;
                existing.Talent2Offered = entity.Talent2Offered;
                existing.DateCompleted = entity.DateCompleted;
                existing.User1Confirmed = entity.User1Confirmed;
                existing.User2Confirmed = entity.User2Confirmed;
                context.Save();
            }
            return existing;
        }

        public Exchange UpdateStatus(int id, StatusExchange status)
        {
            var exchange = context.Exchanges.Find(id);
            if (exchange == null) return null;

            exchange.Status = status;
            context.Save();
            return exchange;
        }
    }
}
