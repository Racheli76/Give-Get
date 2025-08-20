using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repositories.Repositories
{
    public class TalentRepository : ITalentExtensionRepository
    {
        private readonly IContext context;

        public TalentRepository(IContext context)
        {
            this.context = context;
        }

        public Talent AddItem(Talent item)
        {
            context.Talents.Add(item);
            context.Save();
            return Get(item.Id);
        }

        public Talent Get(int id)
        {
            return context.Talents.FirstOrDefault(t => t.Id == id);
        }

        public List<Talent> GetByParentId(int parentId)
        {
            return context.Talents.Where(t => t.ParentCategory == parentId).ToList();
        }

        public List<Talent> GetAll()
        {
            return context.Talents.ToList();
        }

        public Talent Update(int id, Talent entity)
        {
            Talent talent = Get(id);
            if (talent == null)
                throw new KeyNotFoundException($"Talent with ID {id} not found.");

            talent.TalentName = entity.TalentName;
            talent.ParentCategory = entity.ParentCategory;

            context.Save();
            return Get(id);
        }

        public void Delete(int id)
        {
            Talent talent = Get(id);
            if (talent == null)
                throw new KeyNotFoundException($"Talent with ID {id} not found.");

            context.Talents.Remove(talent);
            context.Save();
        }
    }
}
