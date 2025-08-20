using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly ILoginService _loginService;

        public ChatController(IChatService chatService, ILoginService loginService)
        {
            _chatService = chatService;
            _loginService = loginService;
        }

        [Authorize]
        [HttpGet("history/{exchangeId}")]
        public async Task<IActionResult> GetChatHistory(int exchangeId)
        {
            int userId = _loginService.GetUserIdFromToken(User);
            var history = await _chatService.GetChatHistoryAsync(exchangeId, userId);
            return Ok(history);
        }
    }

}
