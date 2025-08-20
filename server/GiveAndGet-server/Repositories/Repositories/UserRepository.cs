using Repositories.Entity;
using Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Repositories.Repositories
{
    public class UserRepository:IRepository<User>
    {
        private readonly IContext _context;

        public UserRepository(IContext context)
        {
            this._context = context;
        }

        public User AddItem(User user)
        {
            _context.Users.Add(user);
            _context.Save();
            return Get(user.Id);
        }

        public User Get(int id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public User GetByUsername(string username)
        {
            return _context.Users.FirstOrDefault(u => u.UserName == username);
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public List<User> GetActiveUsers()
        {
            return _context.Users.Where(u => u.IsActive).ToList();
        }

        public User Update(int id, User updatedUser)
        {
            User existingUser = Get(id);
            if (existingUser == null)
                throw new KeyNotFoundException($"User with ID {id} not found.");
            
            
            existingUser.HashPwd = updatedUser.HashPwd;
            existingUser.PhoneNumber = updatedUser.PhoneNumber;
            existingUser.Email = updatedUser.Email;
            existingUser.UserName = updatedUser.UserName;
            existingUser.Score = updatedUser.Score;
            //existingUser.Talents = updatedUser.Talents;
            existingUser.Age = updatedUser.Age;
            existingUser.Gender = updatedUser.Gender;
            existingUser.Desc = updatedUser.Desc;
            existingUser.IsActive = updatedUser.IsActive;
            if (!string.IsNullOrEmpty(updatedUser.ProfileImage)&&updatedUser.ProfileImage!="default_profile_image.png")
            {
                existingUser.ProfileImage = updatedUser.ProfileImage;
            }

            _context.Save();
            return existingUser;
        }

        // מחיקת משתמש לפי מזהה
        public void Delete(int id)
        {
            User user = Get(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.Save();
            }
        }

        // חיפוש משתמשים לפי כישרון מוצע
        public List<User> GetByOfferedTalent(int talentId)
        {
            var userIds = _context.TalentUser
                .Where(tu => tu.TalentId == talentId && tu.IsOffered)
                .Select(tu => tu.UserId)
                .ToList();

            return _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToList();
        }


        // חיפוש משתמשים לפי כישרון נדרש
        public List<User> GetByWantedTalent(int talentId)
        {
            var userIds = _context.TalentUser
                .Where(tu => tu.TalentId == talentId && !tu.IsOffered)
                .Select(tu => tu.UserId)
                .ToList();

            return _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToList();
        }
    }
}
