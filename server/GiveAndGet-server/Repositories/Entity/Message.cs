using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Entity
{
    public class Message
    {
        public int Id { get; set; }
        public int FromId { get; set; }
        [ForeignKey("FromId")]
        public virtual User? From { get; set; }

        //for which exchange it belongs
        public int ExchangeId { get; set; }
        [ForeignKey("ExchangeId")]
        public virtual Exchange Exchange { get; set; }

        public string Text { get; set; }
        public bool Readed { get; set; }
        public DateTime? Time { get; set; } = DateTime.Now;

    }
}
