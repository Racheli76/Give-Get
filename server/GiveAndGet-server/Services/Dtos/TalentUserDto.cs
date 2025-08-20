using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class TalentUserDto
    {
       
       // [Key]
        public int UserId { get; set; }
        //[Key]  
        public int TalentId { get; set; }
        public bool IsOffered { get; set; }
      
        //[ForeignKey("UserId")]
       // public virtual User User { get; set; }
        
        //[ForeignKey("TalentId")]
        //public Talent Talent  { get; set; }
    }
}
