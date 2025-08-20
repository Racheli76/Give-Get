using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class CommentService : Interfaces.IService<CommentDto>
    {
        private readonly Repositories.Interfaces.IRepository<Comment> _repository;
        private readonly IMapper _mapper;

        public CommentService(Repositories.Interfaces.IRepository<Comment> repository, IMapper mapper)
        {
            this._repository = repository;
            this._mapper = mapper;
        }

        public CommentDto AddItem(CommentDto item)
        {
            return _mapper.Map<CommentDto>(_repository.AddItem(_mapper.Map<Comment>(item)));
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public List<CommentDto> Get(int id)
        {
            return _mapper.Map<List<CommentDto>>(((CommentRepository)_repository).GetNext30(id));
        }

        public List<CommentDto> GetAll()
        {
            return _mapper.Map<List<CommentDto>>(_repository.GetAll());
        }

        public CommentDto Update(int id, CommentDto item)
        {
            return _mapper.Map<CommentDto>(_repository.Update(id, _mapper.Map<Comment>(item)));
        }

        CommentDto Interfaces.IService<CommentDto>.Get(int id)
        {
            throw new NotImplementedException();
        }
    }
}
