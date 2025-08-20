using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Entity
{
    public class TalentUser
    {

        [Key, Column(Order = 0)]
        public int UserId { get; set; }
        [Key, Column(Order = 1)]
        public int TalentId { get; set; }
        public bool IsOffered { get; set; }
      
        [ForeignKey("UserId")]
        public virtual User User { get; set; }
        
        [ForeignKey("TalentId")]
        public Talent Talent  { get; set; }
    }
}
