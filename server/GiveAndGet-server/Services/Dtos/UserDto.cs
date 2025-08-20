using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Repositories.Entity;

namespace Services.Dtos
{  
    public enum Gender
    {
        Male,
        Female
    }
    public class UserDto
    {
        public int Id { get; set; }
        public string HashPwd { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public int Score { get; set; } = 50;
        //public ICollection<TalentUserDto>? Talents { get; set; }
        //public ICollection<Talent>? TalensOffered { get; set; }
        //public ICollection<Talent>? TalentsWanted { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Desc { get; set; }
        public bool IsActive { get; set; } = false;
        public string? Profile { get; set; }
        public string? ProfileImageUrl { get; set; } // נתיב התמונה
        public IFormFile? File { get; set; }

        public bool? IsAdmin { get; set; } = false;




    }
}


