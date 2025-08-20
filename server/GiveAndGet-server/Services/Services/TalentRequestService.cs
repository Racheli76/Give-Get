using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Services.Dtos;
using Services.Interfaces;
using System.Collections.Generic;

namespace Services.Services
{
    public class TalentRequestService : ITalentRequestService
    {
        private readonly IRepository<TalentRequest> _repository;
        private readonly IMapper _mapper;
        private readonly IService<TalentDto> _talentService;
        private readonly IEmailService _emailService;
        private readonly IService<UserDto> _userService;

        public TalentRequestService(
            IRepository<TalentRequest> repository,
            IMapper mapper,
            IService<TalentDto> talentService,
            IEmailService emailService,
            IService<UserDto> userService)
        {
            _repository = repository;
            _mapper = mapper;
            _talentService = talentService;
            _emailService = emailService;
            _userService = userService;
        }

        public TalentRequestDto CreateTalentRequest(TalentRequestDto item)
        {
            var entity = _mapper.Map<TalentRequest>(item);
            var addedEntity = _repository.AddItem(entity);
            var newRequest = _mapper.Map<TalentRequestDto>(addedEntity);

            UserDto requestingUser = _userService.Get(newRequest.UserId);
            string subject = $"משתמש {requestingUser.UserName} ביקש להוסיף כשרון למערכת.";
            string body = "אנא הכנס בהקדם לדף ניהול בקשות ההוספה ואשר / דחה את הבקשה.\nיום נעים!";
            NotifyAdmins(subject, body);

            return newRequest;
        }

        public void ProcessTalentRequest(int id, TalentRequestDto toUpdate)
        {
            TalentRequestDto updated = Update(id, toUpdate);
            if (updated == null)
            {
                throw new Exception($"TalentRequest with ID {id} not found.");
            }

            TalentDto newTalent = new TalentDto(updated.TalentName, updated.ParentCategory);
            _talentService.AddItem(newTalent);
            NotifyUser(toUpdate.UserId, $"בקשתך להוספת כשרון {updated.TalentName} אושרה\nיום נעים");

            Delete(id);
        }

        public void DeleteTalentRequest(int id)
        {
            TalentRequestDto toDelete = Get(id);
            Delete(id);
            NotifyUser(toDelete.UserId, $"לצערנו בקשתך להוספת כשרון {toDelete.TalentName} סורבה\nיום נעים");
        }

        private void NotifyAdmins(string subject, string body)
        {
            List<UserDto> adminUsers = _userService.GetAll().Where(user => (bool)user.IsAdmin).ToList();
            foreach (UserDto admin in adminUsers)
            {
                try
                {
                    _emailService.SendEmail(subject, body, admin.Email);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error sending email to {admin.Email}: {ex.Message}");
                }
            }
        }

        private void NotifyUser(int userId, string message)
        {
            UserDto user = _userService.Get(userId);
            if (user != null)
            {
                _emailService.SendEmail("משתמש יקר", message, user.Email);
            }
        }

        public TalentRequestDto AddItem(TalentRequestDto item)
        {
            var entity = _mapper.Map<TalentRequest>(item);
            var addedEntity = _repository.AddItem(entity);
            return _mapper.Map<TalentRequestDto>(addedEntity);
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public TalentRequestDto Get(int id)
        {
            var entity = _repository.Get(id);
            return _mapper.Map<TalentRequestDto>(entity);
        }

        public List<TalentRequestDto> GetAll()
        {
            var entities = _repository.GetAll();
            return _mapper.Map<List<TalentRequestDto>>(entities);
        }

        public TalentRequestDto Update(int id, TalentRequestDto item)
        {
            var entity = _mapper.Map<TalentRequest>(item);
            var updatedEntity = _repository.Update(id, entity);
            return _mapper.Map<TalentRequestDto>(updatedEntity);
        }
    }

}
