using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Entity
{
    public enum Gender
    {
        Male,
        Female
    }
    public class User
    {
        public int Id { get; set; }
        public string HashPwd { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public  string UserName { get; set; }
        public int Score { get; set; } = 50;
        //public ICollection<TalentUser>? Talents { get; set; }
        public int Age { get; set; }
        public Gender Gender { get; set; }
        public string Desc { get; set; }
        public bool IsActive { get; set; } = false;
        public string ProfileImage { get; set; }
        public bool? IsAdmin { get; set; } = false;

    }
}
