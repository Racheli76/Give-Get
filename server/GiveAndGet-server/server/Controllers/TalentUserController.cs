using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Dtos;
using Services.Interfaces;

namespace YourNamespace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalentUserController : ControllerBase
    {
        private readonly ITalentUserExtensionService _talentUserService;
        private readonly ILoginService _loginService;


        public TalentUserController(ITalentUserExtensionService talentUserService, ILoginService loginService)
        {
            _talentUserService = talentUserService;
            _loginService = loginService;
        }

        //[Authorize]
        //[HttpPost("addTalents")]
        //public ActionResult<List<TalentUserDto>> AddTalentsForUser([FromBody] List<TalentUserDto> talents)
        //{
        //    if (talents == null || !talents.Any())
        //        return BadRequest("The talent list cannot be empty.");

        //    if (!_loginService.ValidateUserId(User, talents.First().UserId))
        //    {
        //        return Unauthorized("User ID does not match the token.");
        //    }

        //    var updatedTalents = _talentUserService.AddTalentsForUser(talents);
        //    return Ok(updatedTalents);
        //}

        [Authorize]
        [HttpGet("getTalents/{userId}")]
        public ActionResult<List<TalentUserDto>> GetTalentsByUserId(int userId)
        {
            if (!_loginService.ValidateUserId(User, userId))
            {
                return Unauthorized("User ID does not match the token.");
            }
            var talents = _talentUserService.GetTalentsByUserId(userId);
            if (talents == null || !talents.Any())
                return NotFound("No talents found for the given user.");

            return Ok(talents);
        }

        //[Authorize]
        //[HttpPost("addTalent")]
        //public ActionResult<TalentUserDto> AddTalent([FromBody] TalentUserDto talent)
        //{
        //    if (talent == null)
        //        return BadRequest("Talent data is required.");

        //    if (!_loginService.ValidateUserId(User, talent.UserId))
        //    {
        //        return Unauthorized("User ID does not match the token.");
        //    }


        //    var addedTalent = _talentUserService.AddItem(talent);
        //    return Ok(addedTalent);
        //}

        //[Authorize]
        //[HttpDelete("delete/{id}")]
        //public IActionResult DeleteTalent(int id)
        //{
        //    _talentUserService.Delete(id);
        //    return NoContent();
        //}

        //[Authorize]
        //[HttpPut("update/{id}")]
        //public ActionResult<TalentUserDto> UpdateTalent(int id, [FromBody] TalentUserDto talent)
        //{
        //    if (talent == null)
        //        return BadRequest("Talent data is required.");

        //    if (!_loginService.ValidateUserId(User, talent.UserId))
        //    {
        //        return Unauthorized("User ID does not match the token.");
        //    }

        //    var updatedTalent = _talentUserService.Update(id, talent);
        //    return Ok(updatedTalent);
        //}
    }
}
