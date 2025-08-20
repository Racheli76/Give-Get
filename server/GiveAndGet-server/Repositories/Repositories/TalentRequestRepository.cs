using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repositories.Repositories
{
    public class TalentRequestRepository:IRepository<TalentRequest>
    {
        private readonly IContext context;

        public TalentRequestRepository(IContext context)
        {
            this.context = context;
        }


        public TalentRequest AddItem(TalentRequest request)
        {
            context.TalentRequests.Add(request);
            context.Save();
            return Get(request.Id);
        }

        public TalentRequest Get(int id)
        {
            return context.TalentRequests.FirstOrDefault(tr => tr.Id == id);
        }

        public List<TalentRequest> GetByUserId(int userId)
        {
            return context.TalentRequests.Where(tr => tr.UserId == userId).ToList();
        }

        public List<TalentRequest> GetAll()
        {
            return context.TalentRequests.ToList();
        }

        public List<TalentRequest> GetByParentCategory(int parentCategory)
        {
            return context.TalentRequests.Where(tr => tr.ParentCategory == parentCategory).ToList();
        }

        public void Delete(int id)
        {
            TalentRequest request = Get(id);
            if (request != null)
            {
                context.TalentRequests.Remove(request);
                context.Save();
            }
        }

        public TalentRequest Update(int id, TalentRequest updatedRequest)
        {
            TalentRequest existingRequest = Get(id);
            if (existingRequest == null)
                throw new KeyNotFoundException($"TalentRequest with ID {id} not found.");

            existingRequest.TalentName = updatedRequest.TalentName;
            existingRequest.ParentCategory = updatedRequest.ParentCategory;
            existingRequest.RequestDate = updatedRequest.RequestDate;

            context.Save();
            return Get(id);
        }
    }
}
