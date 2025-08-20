using Repositories.Entity;
using Services.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using StatusExchange = Repositories.Entity.StatusExchange;

namespace Services.Interfaces
{
    public interface IService<T>
    {
        List<T> GetAll();
        T Get(int id);
        T AddItem(T item);
        T Update(int id, T entity);
        void Delete(int id);


    }


    public interface ITalentExtensionService : IService<TalentDto>
    {
        List<TalentDto> GetByParentCategory(int parentCategoryId);
        void ProcessTalentRequest(int id);
    }

    public interface ITalentUserExtensionService : IService<TalentUserDto>
    {
        List<TalentUserDto> AddTalentsForUser(List<TalentUserDto> talents);
        void DeleteTalentForUser(List<TalentUserDto> talents);
        List<TalentUserDto> GetTalentsByUserId(int userId);
        public void Delete(int userId, int talentId);
        void UpdateIsOffered(int userId, int talentId, bool isOffered);

    }

    public interface IExchangeExtensionService : IService<ExchangeDto>
    {
        List<ExchangeDto> GetByUserId(int userId);
        void SearchExchangesForUser(int userId);
        void UpdateUserExchanges(int userId, List<int> removedTalentIds, List<int> addedTalentIds);
        public ExchangeDto UpdateStatus(int id, StatusExchange status, int userId);


    }

    public interface IUserService : IService<UserDto>
    {
        UserDto GetUserProfile(ClaimsPrincipal user, string host);
        UserDto AddUser(UserDto user, string talents);
        UserDto UpdateUser(int id, UserDto updateUser, string talents);
        UserDto UpdateUserScore(int id, int action);
        byte[] GetProfileImage(int id);
        List<TopUserDto> GetTopUsers();
        TopUserDto GetNotSecret(int id);

    }

    public interface ITalentRequestService:IService<TalentRequestDto>
    {
        TalentRequestDto CreateTalentRequest(TalentRequestDto item);
        void ProcessTalentRequest(int id, TalentRequestDto toUpdate);
        void DeleteTalentRequest(int id);
    }




}
