using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Connection = Repositories.Entity.Connection;

namespace Repositories.Interfaces
{
    public interface IContext
    {
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Exchange> Exchanges { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Talent> Talents { get; set; }
        public DbSet<TalentRequest> TalentRequests { get; set; }
        public DbSet<TalentUser> TalentUser { get; set; }





        void Save();

        Task SaveAsync();
    }
}
