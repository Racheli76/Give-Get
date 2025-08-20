using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;

namespace WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly IService<CommentDto> _commentService;

        public CommentController(IService<CommentDto> commentService)
        {
            _commentService = commentService;
        }

        // GET: api/<CommentController>
        [HttpGet]
        public List<CommentDto> Get()
        {
            return _commentService.GetAll();
        }

        // GET api/<CommentController>/5
        [HttpGet("{id}")]
        public CommentDto Get(int id)
        {
            return _commentService.Get(id);
        }

        // POST api/<CommentController>
        [Authorize]
        [HttpPost]
        public IActionResult Post([FromForm] string content)//CommentDto comment)
        {
            try
            {
                var userIdFromToken = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                CommentDto comment = new CommentDto(userIdFromToken, content);
                var createdComment = _commentService.AddItem(comment);
                return Ok(createdComment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        //// PUT api/<CommentController>/5
        //[HttpPut("{id}")]
        //public CommentDto Put(int id, [FromBody] CommentDto update)
        //{
            
        //}

        //// DELETE api/<CommentController>/5
        //[HttpDelete("{id}")]
        //public IActionResult Delete(int id)
        //{
        //    try
        //    {
        //        _commentService.Delete(id);
        //        return NoContent();
        //    }
        //    catch (KeyNotFoundException ex)
        //    {
        //        return NotFound(ex.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"An error occurred: {ex.Message}");
        //    }
        //}
    }
}
