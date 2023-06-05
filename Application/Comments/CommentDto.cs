using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }

        public string Body { get; set; }

        public DateTime CreateAt { get; set; }

        public string UserDisplayname { get; set; }

        public string Username { get; set; }

        public string UserImage { get; set; }
    }
}
