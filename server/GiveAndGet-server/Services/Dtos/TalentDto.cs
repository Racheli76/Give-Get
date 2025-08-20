using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class TalentDto
    {
        public TalentDto(string talentName, int parentCategory)
        {
            TalentName = talentName;
            ParentCategory = parentCategory;
        }

        public int Id { get; set; }
        public string TalentName { get; set; }
        public int ParentCategory { get; set; } = 0;
    }
}
