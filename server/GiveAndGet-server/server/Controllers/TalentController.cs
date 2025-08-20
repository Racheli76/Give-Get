using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Dtos;
using Services.Interfaces;
using System.Collections.Generic;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentController : ControllerBase
    {
        private readonly ITalentExtensionService _talentService;

        public TalentController(ITalentExtensionService talentService)
        {
            _talentService = talentService;
        }

        // GET: api/<TalentController>
        [HttpGet]
        public List<TalentDto> Get()
        {
            return _talentService.GetAll();
        }

        // GET api/<TalentController>/5
        [HttpGet("{id}")]
        public TalentDto Get(int id)
        {
            return _talentService.Get(id);
        }

        // GET api/Talent/byParent/{parentId}
        [HttpGet("byParent/{parentId}")]
        public IActionResult GetByParentCategory(int parentId)
        {
            var talents = _talentService.GetByParentCategory(parentId);
            if (talents == null || !talents.Any())
            {
                return Ok(new List<TalentDto>()); // החזר מערך ריק אם לא נמצאו תתי-כישרונות
            }
            return Ok(talents);
        }

        // POST api/<TalentController>
        [Authorize(Roles = "admin")]
        [HttpPost]
        public IActionResult Post([FromForm] int id)
        {
            try
            {
                _talentService.ProcessTalentRequest(id);
                return Ok($"Talent request {id} processed successfully.");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // PUT api/<TalentController>/5
        [Authorize(Roles = "admin")]
        [HttpPut("{id}")]
        public TalentDto Put(int id, [FromBody] TalentDto update)
        {
            return _talentService.Update(id, update);
        }

        // DELETE api/<TalentController>/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult Delete(int id)
        {
            try
            {
                _talentService.Delete(id);
                return NoContent(); //return no messege, we secceded
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // when talent is not defined
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}"); // any othor errors
            }
        }
    }
}