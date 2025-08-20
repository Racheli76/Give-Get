using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class TopUserDto
    {
        private string? profile;

        public TopUserDto()
        {

        }
        public TopUserDto(string userName, int score, string desc, string? profile)
        {
            UserName = userName;
            Score = score;
            Desc = desc;
            ProfileImageUrl = profile;
        }

        public string UserName { get; set; }
        public int Score { get; set; }
        public string Desc { get; set; }
        public string? ProfileImageUrl { get; set; }
    }

}
