using Repositories.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositories.Interfaces
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T Get(int id);
        T AddItem(T item);
        T Update(int id, T entity);
        void Delete(int id);
    }

    
    public interface ITalentExtensionRepository : IRepository<Talent>
    {
        List<Talent> GetByParentId(int parentId);
    }

    public interface ITalentUserExtensionRepository : IRepository<TalentUser>
    {
        List<TalentUser> AddTalentsForUser(List<TalentUser> talents);
        void DeleteTalentForUser(List<TalentUser> talents);
        List<TalentUser> GetTalentsByUserId(int userId); // פונקציה להוספת כישרונות לפי מזהה משתמש
        public void Delete(int userId, int talentId);
        void UpdateIsOffered(int userId, int talentId, bool isOffered);

    }

    public interface IExchangeExtensionRepository: IRepository<Exchange>
    {
        List<Exchange> GetByUserId(int userId);
        Exchange UpdateStatus(int id, StatusExchange status);


    }

    public interface ILoginRepository
    {
        User VerifyUser(string userName, string password);
    }

} 