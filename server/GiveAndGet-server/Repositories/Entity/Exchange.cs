using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Entity
{
    public enum StatusExchange{ 
        NEW,
        WAITING,
        PROCCESSING,
        DONE
    }
    public class Exchange
    {
        public int Id { get; set; }

        public int User1Id { get; set; }
        [ForeignKey("User1Id")]
        public virtual User? User1 { get; set; }
        public int User2Id { get; set; }
        [ForeignKey("User2Id")]
        public virtual User? User2 { get; set; }


        public StatusExchange? Status { get; set; }=StatusExchange.NEW;
        public int Talent1Offered { get; set; }
        [ForeignKey("Talent1Offered")]
        public virtual Talent? Talent1 { get; set; }
        public int Talent2Offered { get; set; }
        [ForeignKey("Talent2Offered")]
        public virtual Talent? Talent2 { get; set; }

        public DateTime DateCreated { get; set; }
        public DateTime? DateCompleted { get; set; }

        public bool User1Confirmed { get; set; } = false;  
        public bool User2Confirmed { get; set; } = false;  
    }
}
