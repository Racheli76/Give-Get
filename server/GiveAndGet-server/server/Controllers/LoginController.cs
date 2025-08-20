using Microsoft.AspNetCore.Mvc;
using Services.Dtos;
using Services.Interfaces;
using System.Collections.Generic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;

        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        // POST api/<LoginController>
        [HttpPost]
        public IActionResult Post([FromQuery] string userName, [FromQuery] string pwd)
        {
            UserDto user = _loginService.Verify(userName, pwd);
            if (user == null)
                return BadRequest("user not found");
            string token = _loginService.GenerateToken(user);
            return Ok(token);
        }
    }
}