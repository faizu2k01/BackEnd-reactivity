using Application.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ActivityFilter : PagedParams
    {
        public bool IsHost { get; set; }

        public bool IsGoing { get; set; }

        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}
