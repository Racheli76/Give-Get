using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class CommentDto
    {
        public int Id { get; set; }
        public string UserId { get; set; } 
        public string Content { get; set; }

        public CommentDto() { }

        public CommentDto(string userId, string content)
        {
            UserId = userId;
            Content = content;
        }
    }
}
