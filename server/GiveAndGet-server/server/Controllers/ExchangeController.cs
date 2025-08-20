using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.Entity;
using Services.Dtos;
using Services.Interfaces;
using Services.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using StatusExchange = Services.Dtos.StatusExchange;
using StatusExchangeRep = Repositories.Entity.StatusExchange;


namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExchangeController : ControllerBase
    {
        private readonly IExchangeExtensionService _exchangeService;
        private readonly ILoginService _loginService;


        public ExchangeController(IExchangeExtensionService exchangeService)
        {
            _exchangeService = exchangeService;
        }

        // GET: api/<ExchangeController>
        //[HttpGet]
        //public List<ExchangeDto> Get()
        //{
        //    return _exchangeService.GetAll();
        //}

        // GET api/<ExchangeController>/5
        [Authorize]
        [HttpGet("{id}")]
        public ActionResult<ExchangeDto> Get(int id)
        {
            var exchange = _exchangeService.Get(id);
            if (exchange == null)
            {
                return NotFound("Exchange not found.");
            }

            if (!_loginService.ValidateUserId(User, id))
            {
                return Unauthorized("User ID does not match the token.");
            }

            return Ok(exchange);
        }


        [Authorize]
        [HttpGet("searchByUser")]
        public List<ExchangeDto> SearchDealsByUser(/*[FromQuery] DealSearchDto searchDto*/ [FromQuery] int userId)
        {
            return _exchangeService.GetByUserId(userId);
        }

        [Authorize]
        [HttpPut("update-status")]
        public IActionResult UpdateExchangeStatus(int exchangeId, int status, int userId)
        {
            var exchange = _exchangeService.Get(exchangeId);
            if (exchange == null)
            {
                return NotFound("Exchange not found.");
            }

            var updatedExchange = _exchangeService.UpdateStatus(exchangeId, (StatusExchangeRep)status,userId);
            return Ok(updatedExchange);
        }
    }
}
