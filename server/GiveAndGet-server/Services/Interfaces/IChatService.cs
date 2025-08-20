using Services.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface IChatService
    {
        Task SaveMessageAsync(int exchangeId, int fromUserId, string text);
        Task<List<MessageDto>> GetChatHistoryAsync(int exchangeId, int userId);
    }
}
