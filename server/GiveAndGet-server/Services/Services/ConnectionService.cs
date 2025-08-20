//using AutoMapper;
//using Repositories.Interfaces;
//using Services.Dtos;
//using Services.Interfaces;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

//namespace Services.Services
//{
//    public class ConnectionService : IService<ConnectionDto>
//    {
//        private readonly IMessageExtensionRepository<Connection> _repository;
//        private readonly IMapper _mapper;

//        public ConnectionService(IMessageExtensionRepository<Connection> repository, IMapper mapper)
//        {
//            this._repository = repository;
//            this._mapper = mapper;
//        }

//        public ConnectionDto AddItem(ConnectionDto item)
//        {
//            return _mapper.Map<ConnectionDto>(_repository.AddItem(_mapper.Map<Connection>(item)));
//        }

//        public void Delete(int id)
//        {
//            _repository.Delete(id);
//        }

//        public ConnectionDto Get(int id)
//        {
//            return _mapper.Map<ConnectionDto>(_repository.Get(id));
//        }

//        public List<ConnectionDto> GetAll()
//        {
//            return _mapper.Map<List<ConnectionDto>>(_repository.GetAll());
//        }

//        public ConnectionDto Update(int id, ConnectionDto item)
//        {
//            return _mapper.Map<ConnectionDto>(_repository.Update(id, _mapper.Map<Connection>(item)));
//        }
//    }
//}
