using Microsoft.Extensions.DependencyInjection;
using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using Connection = Repositories.Entity.Connection;

namespace Repositories.Repositories
{
    public static class ExtensionMethod
    {
        public static IServiceCollection AddRepository(this IServiceCollection services)
        {
            services.AddScoped<IRepository<Comment>, CommentRepository>();
            services.AddScoped<IRepository<Exchange>, ExchangeRepository>();
            services.AddScoped<IRepositoryAsync<Message>, MessageRepository>();
            services.AddScoped<IRepository<Talent>, TalentRepository>();
            services.AddScoped<IRepository<TalentRequest>, TalentRequestRepository>();
            services.AddScoped<IRepository<User>, UserRepository>();
            services.AddScoped<IRepository<TalentUser>, TalentUserRepository>();
            services.AddScoped<ITalentExtensionRepository, TalentRepository>();
            services.AddScoped<ITalentUserExtensionRepository, TalentUserRepository>();
            services.AddScoped<IExchangeExtensionRepository, ExchangeRepository>();
            services.AddScoped<IMessageExtensionRepository, MessageRepository>();

            return services;
        }
    }
}
