using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class MessageService : IMessageExtensionService
    {
        private readonly IMessageExtensionRepository _repository;
        private readonly IMapper _mapper;

        public MessageService(IMessageExtensionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<MessageDto> AddItemAsync(MessageDto item)
        {
            var entity = _mapper.Map<Message>(item);
            var saved = await _repository.AddItemAsync(entity); // שמירה אסינכרונית ל-DB
            return _mapper.Map<MessageDto>(saved);
        }

        public async Task<List<MessageDto>> GetByExchangeIdAsync(int exchangeId)
        {
            var messages = await _repository.GetByExchangeIdAsync(exchangeId); // שליפת הודעות לפי עסקה
            return _mapper.Map<List<MessageDto>>(messages);
        }

        public async Task<MessageDto> GetAsync(int id)
        {
            var message = await _repository.GetAsync(id);
            return _mapper.Map<MessageDto>(message);
        }

        public async Task<List<MessageDto>> GetAllAsync()
        {
            var allMessages = await _repository.GetAllAsync();
            return _mapper.Map<List<MessageDto>>(allMessages);
        }

        public async Task<MessageDto> UpdateAsync(int id, MessageDto item)
        {
            var entity = _mapper.Map<Message>(item);
            var updated = await _repository.UpdateAsync(id, entity);
            return _mapper.Map<MessageDto>(updated);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }
    }

}
