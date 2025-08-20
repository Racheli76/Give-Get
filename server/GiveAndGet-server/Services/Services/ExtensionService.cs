using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using Repositories.Entity;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Dtos;
using Services.Interfaces;
using System;

namespace Services.Services
{
    public static class ExtensionService
    {
        public static IServiceCollection AddServiceExtension(this IServiceCollection services)
        {
            services.AddRepository();
            services.AddScoped<IService<CommentDto>, CommentService>();
            services.AddScoped<IService<ExchangeDto>, ExchangeService>();
            services.AddScoped<IServiceAsync<MessageDto>, MessageService>();
            services.AddScoped<IExchangeForChat, ExchangeService>();
            services.AddScoped<IService<TalentDto>, TalentService>();
            services.AddScoped<IService<TalentRequestDto>, TalentRequestService>();
            services.AddScoped<IService<UserDto>, UserService>();
            services.AddScoped<IService<TalentUserDto>, TalentUserService>();

            services.AddScoped<ITalentExtensionService, TalentService>();
            services.AddScoped<ITalentUserExtensionService, TalentUserService>();
            services.AddScoped<IExchangeExtensionService, ExchangeService>();
            services.AddScoped<IMessageExtensionService, MessageService>();
            services.AddScoped<IChatService, ChatService>();
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<ILoginService, LoginService>();
            services.AddScoped<ITalentRequestService, TalentRequestService>();
            

            services.AddAutoMapper(typeof(MyMapper));

            services.AddScoped<IUserService, UserService>();

            // שימוש ב-Lazy<T> להזרקת השירותים
            services.AddScoped(provider => new Lazy<IService<TalentRequestDto>>(() => provider.GetRequiredService<IService<TalentRequestDto>>()));
            services.AddScoped(provider => new Lazy<IUserService>(() => provider.GetRequiredService<IUserService>()));

            return services;
        }
    }
    
        
}