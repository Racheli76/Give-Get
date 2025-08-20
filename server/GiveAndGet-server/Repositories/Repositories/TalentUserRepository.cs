using Microsoft.EntityFrameworkCore;
using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repositories.Repositories
{
    public class TalentUserRepository :  ITalentUserExtensionRepository
    {
        private readonly IContext _context;

        public TalentUserRepository(IContext context)
        {
            _context = context;
        }

        public List<TalentUser> AddTalentsForUser(List<TalentUser> talents)
        {
            if (talents == null || !talents.Any())
                throw new ArgumentException("Talent list cannot be null or empty.");

            _context.TalentUser.AddRange(talents);
            _context.Save();

            return GetTalentsByUserId(talents.First().UserId);
        }


        public TalentUser AddItem(TalentUser item)
        {
            _context.TalentUser.Add(item);
            _context.Save();
            return item;
        }

        public void Delete(int id)
        {
            var talentUser = _context.TalentUser.Find(id);
            if (talentUser != null)
            {
                _context.TalentUser.Remove(talentUser);
                _context.Save();
            }
        }

        public void Delete(int userId, int talentId)
        {
            var talentUser = _context.TalentUser
                .FirstOrDefault(tu => tu.UserId == userId && tu.TalentId == talentId);

            if (talentUser != null)
            {
                _context.TalentUser.Remove(talentUser);
                _context.Save();
            }
        }

        public TalentUser Get(int id)
        {
            return _context.TalentUser.Find(id);
        }

        public List<TalentUser> GetAll()
        {
            return _context.TalentUser.ToList();
        }

        public TalentUser Update(int id, TalentUser entity)
        {
            var talentUser = _context.TalentUser.Find(id);
            if (talentUser != null)
            {
                talentUser.TalentId = entity.TalentId;
                talentUser.IsOffered = entity.IsOffered;
                _context.Save();
            }
            return talentUser;
        }

        public List<TalentUser> GetTalentsByUserId(int userId)
        {
            return _context.TalentUser.Where(t => t.UserId == userId).ToList();
        }

        public void DeleteTalentForUser(List<TalentUser> talents)
        {
            if (talents == null || !talents.Any())
                throw new ArgumentException("Talent list cannot be null or empty.");

            _context.TalentUser.RemoveRange(talents);
            _context.Save();

        }

        public void UpdateIsOffered(int userId, int talentId, bool isOffered)
        {
            // חיפוש הכישרון של המשתמש במסד הנתונים
            var talentUser = _context.TalentUser
                .FirstOrDefault(tu => tu.UserId == userId && tu.TalentId == talentId);

            if (talentUser != null)
            {
                // אם הסטטוס השתנה - מעדכנים ושומרים
                if (talentUser.IsOffered != isOffered)
                {
                    talentUser.IsOffered = isOffered;
                    _context.Save();
                }
            }
        }

    }
}