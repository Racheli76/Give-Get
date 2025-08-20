//using Microsoft.AspNetCore.Mvc;
//using Services.Dtos;
//using Services.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Linq;

//namespace WebAPI.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class MessageController : ControllerBase
//    {
//        private readonly IService<MessageDto> _messageService;

//        public MessageController(IService<MessageDto> messageService)
//        {
//            _messageService = messageService;
//        }

//        // GET: api/<MessageController>
//        [HttpGet]
//        public List<MessageDto> Get()
//        {
//            return _messageService.GetAll();
//        }

//        // GET api/<MessageController>/5
//        [HttpGet("{id}")]
//        public MessageDto Get(int id)
//        {
//            return _messageService.Get(id);
//        }

//        // POST api/<MessageController>
//        [HttpPost]
//        public IActionResult Post([FromBody] MessageDto message)
//        {
//            try
//            {
//                var createdMessage = _messageService.AddItem(message);
//                return Ok(createdMessage);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"An error occurred: {ex.Message}");
//            }
//        }

//        // PUT api/<MessageController>/5
//        [HttpPut("{id}")]
//        public MessageDto Put(int id, [FromBody] MessageDto update)
//        {
//            return _messageService.Update(id, update);
//        }

//        // DELETE api/<MessageController>/5
//        [HttpDelete("{id}")]
//        public IActionResult Delete(int id)
//        {
//            try
//            {
//                _messageService.Delete(id);
//                return NoContent();
//            }
//            catch (KeyNotFoundException ex)
//            {
//                return NotFound(ex.Message);
//            }
//            catch (Exception ex)
//            {
//                return StatusCode(500, $"An error occurred: {ex.Message}");
//            }
//        }
//    }
//}
