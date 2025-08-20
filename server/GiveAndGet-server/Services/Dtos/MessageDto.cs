using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Dtos
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        public int ExchangeId { get; set; }
        public string Text { get; set; }
        public bool Readed { get; set; }
        public DateTime Time { get; set; }
    }
}
