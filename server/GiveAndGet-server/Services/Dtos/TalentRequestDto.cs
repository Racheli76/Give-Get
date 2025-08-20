using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class TalentRequestDto
    {
        public int Id { get; set; }
        public int UserId { get; set; } = 0;
        public string TalentName { get; set; }
        public int ParentCategory { get; set; }
        public DateTime? RequestDate { get; set; } = DateTime.Now;
    }
}
