using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Services.Services
{
    public class TalentService : ITalentExtensionService
    {
        private readonly ITalentExtensionRepository _repository;
        private readonly IMapper _mapper;
        private readonly Lazy<IService<TalentRequestDto>> _talentRequestService;
        private readonly IEmailService _emailService;
        private readonly Lazy<IUserService> _userService;

        public TalentService(ITalentExtensionRepository repository,
                             IMapper mapper,
                             Lazy<IService<TalentRequestDto>> talentRequestService,
                             IEmailService emailService,
                             Lazy<IUserService> userService)
        {
            this._repository = repository;
            this._mapper = mapper;
            this._talentRequestService = talentRequestService;
            this._emailService = emailService;
            this._userService = userService;
        }

        public TalentDto AddItem(TalentDto item)
        {
            return _mapper.Map<TalentDto>(_repository.AddItem(_mapper.Map<Talent>(item)));
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public TalentDto Get(int id)
        {
            return _mapper.Map<TalentDto>(_repository.Get(id));
        }

        public List<TalentDto> GetAll()
        {
            return _mapper.Map<List<TalentDto>>(_repository.GetAll());
        }

        public List<TalentDto> GetByParentCategory(int parentCategoryId)
        {
            var talents = _repository.GetByParentId(parentCategoryId);
            return _mapper.Map<List<TalentDto>>(talents);
        }

        public TalentDto Update(int id, TalentDto item)
        {
            return _mapper.Map<TalentDto>(_repository.Update(id, _mapper.Map<Talent>(item)));
        }

        public void ProcessTalentRequest(int id)
        {
            TalentRequestDto req = _talentRequestService.Value.Get(id);

            if (req == null)
            {
                throw new KeyNotFoundException($"Request with ID {id} not found.");
            }

            // create new talent
            TalentDto newTalent = new TalentDto(req.TalentName, req.ParentCategory);
            AddItem(newTalent);

            // Send email notification
            UserDto user = _userService.Value.Get(req.UserId);
            if (user != null)
            {
                _emailService.SendEmail(user.Email, "Talent Request Completed", $"Your requested talent '{req.TalentName}' has been added successfully!");
            }

            // delete request
            _talentRequestService.Value.Delete(id);
        }
    }
}