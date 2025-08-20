using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public enum StatusExchange
    {
        NEW=0,
        WAITING=1,
        PROCCESSING=2,
        DONE=3
    }
    public class ExchangeDto
    {
        public int Id { get; set; }

        public int User1Id { get; set; }
        public int User2Id { get; set; }
        public StatusExchange? Status { get; set; }=StatusExchange.NEW;
        public int Talent1Offered { get; set; }
        public int Talent2Offered { get; set; }
        public DateTime DateCreated { get; set; } 
        public DateTime? DateCompleted { get; set; }
        public bool User1Confirmed { get; set; } = false;
        public bool User2Confirmed { get; set; } = false;
    }
}
