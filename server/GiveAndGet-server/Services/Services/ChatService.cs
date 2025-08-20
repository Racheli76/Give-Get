using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class ChatService : IChatService
    {
        private readonly IMessageExtensionService _messageService;
        private readonly IExchangeForChat _exchangeService;

        public ChatService(IMessageExtensionService messageService, IExchangeForChat exchangeService)
        {
            _messageService = messageService;
            _exchangeService = exchangeService;
        }

        public async Task SaveMessageAsync(int exchangeId, int fromUserId, string text)
        {
            var msgDto = new MessageDto
            {
                ExchangeId = exchangeId,
                FromId = fromUserId,
                Text = text,
                Time = DateTime.Now
            };
            await _messageService.AddItemAsync(msgDto); // שמירה אסינכרונית
        }

        public async Task<List<MessageDto>> GetChatHistoryAsync(int exchangeId, int userId)
        {
            Console.WriteLine(_exchangeService.IsUserInExchangeAsync(userId, exchangeId).Result.ToString());
            if (_exchangeService.IsUserInExchangeAsync(userId, exchangeId).Result.ToString()== "True")
            {
                return await _messageService.GetByExchangeIdAsync(exchangeId); // שליפת היסטוריה של הצ'אט
            }
            return null;
        }
            
    }


}
