using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using Services.Dtos;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Repositories.Entity;
using System.Linq;
using System;
using Services.Services;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentRequestController : ControllerBase
    {
        private readonly ITalentRequestService _talentRequestService;

        public TalentRequestController(ITalentRequestService talentRequestService)
        {
            _talentRequestService = talentRequestService;
        }

        [Authorize(Roles = "admin")]
        [HttpGet]
        public List<TalentRequestDto> Get()
        {
            return _talentRequestService.GetAll();
        }

        [Authorize(Roles = "admin")]
        [HttpGet("{id}")]
        public TalentRequestDto Get(int id)
        {
            return _talentRequestService.Get(id);
        }

        [HttpPost]
        public IActionResult Post([FromBody] TalentRequestDto req)
        {
            try
            {
                TalentRequestDto newRequest = _talentRequestService.CreateTalentRequest(req);
                return Ok(newRequest);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request.", error = ex.Message });
            }
        }

        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] TalentRequestDto toUpdate)
        {
            try
            {
                _talentRequestService.ProcessTalentRequest(id, toUpdate);
                return Ok($"Talent request {id} processed successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [Authorize(Roles = "admin")]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                _talentRequestService.DeleteTalentRequest(id);
                return Ok($"Talent request {id} deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }

}
