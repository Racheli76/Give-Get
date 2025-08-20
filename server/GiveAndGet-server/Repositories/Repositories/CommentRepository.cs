using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Repositories
{
    public class CommentRepository : IRepository<Comment>
    {
        private readonly IContext context;
        public CommentRepository(IContext context)
        {
            this.context = context;
        }

        public Comment AddItem(Comment item)
        {
            context.Comments.Add(item);
            context.Save();
            return Get(item.Id);
        }
        
        public void Delete(int id)
        {
            context.Comments.Remove(Get(id));
            context.Save();
        }

        public Comment Get(int id)//helping func
        {
            return context.Comments.FirstOrDefault(c=>c.Id==id);
        }
        public List<Comment> GetNext30(int startingId)
        {
            return context.Comments
                .Where(c => c.Id < startingId) // שלוף תגובות עם ID גדול מה-ID הנתון
                .OrderByDescending(c => c.Id) // מיין לפי ID בסדר יורד
                .Take(30) // קח את 30 התגובות הראשונות
                .ToList();
        }

        public List<Comment> GetAll()
        {
            return GetNext30(int.MaxValue).ToList();
        }

        public Comment Update(int id, Comment entity)
        {
            throw new NotImplementedException();
        }
    }
}
