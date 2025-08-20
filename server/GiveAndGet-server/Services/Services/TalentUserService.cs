using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Dtos;
using Services.Interfaces;

namespace Services.Services
{
    public class TalentUserService : ITalentUserExtensionService
    {
        private readonly ITalentUserExtensionRepository _repository;
        private readonly IMapper _mapper;

        public TalentUserService(ITalentUserExtensionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public TalentUserDto AddItem(TalentUserDto item)
        {
            var talentUser = _mapper.Map<TalentUser>(item);
            var addedTalentUser = _repository.AddItem(talentUser);
            return _mapper.Map<TalentUserDto>(addedTalentUser);
        }

        public List<TalentUserDto> AddTalentsForUser(List<TalentUserDto> talents)
        {
            if (talents == null || !talents.Any())
                throw new ArgumentException("Talent list cannot be null or empty.");

            var talentEntities = _mapper.Map<List<TalentUser>>(talents);
            int userId = talentEntities.First().UserId; // גישה בטוחה לאינדקס ראשון

            _repository.AddTalentsForUser(talentEntities);

            var updatedTalents = _repository.GetTalentsByUserId(userId);
            return _mapper.Map<List<TalentUserDto>>(updatedTalents);
        }


        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public void Delete(int userId, int talentId)
        {
            _repository.Delete(userId, talentId);
        }

        public void DeleteTalentForUser(List<TalentUserDto> talents)
        {
            if (talents == null || !talents.Any())
                throw new ArgumentException("Talent list cannot be null or empty.");

            var talentEntities = _mapper.Map<List<TalentUser>>(talents);
            int userId = talentEntities.First().UserId; // גישה בטוחה לאינדקס ראשון

            _repository.DeleteTalentForUser(talentEntities);

        }

        public TalentUserDto Get(int id)
        {
            var talentUser = _repository.Get(id);
            return _mapper.Map<TalentUserDto>(talentUser);
        }

        public List<TalentUserDto> GetAll()
        {
            var talentUsers = _repository.GetAll();
            return _mapper.Map<List<TalentUserDto>>(talentUsers);
        }

        public List<TalentUserDto> GetTalentsByUserId(int userId)
        {
            var talents = _repository.GetTalentsByUserId(userId);
            return _mapper.Map<List<TalentUserDto>>(talents);
        }

        public TalentUserDto Update(int id, TalentUserDto entity)
        {
            var talentUser = _mapper.Map<TalentUser>(entity);
            var updatedTalentUser = _repository.Update(id, talentUser);
            return _mapper.Map<TalentUserDto>(updatedTalentUser);
        }

        public void UpdateIsOffered(int userId, int talentId, bool isOffered)
        {
            // קריאה לרפוזיטורי לביצוע עדכון הסטטוס
            _repository.UpdateIsOffered(userId, talentId, isOffered);
        }

    }
}
