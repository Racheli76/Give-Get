using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Entity
{
    public class Talent
    {
        public int Id { get; set; }
        public string TalentName { get; set; }
        public int ParentCategory { get; set; } = 0;
    }
}
