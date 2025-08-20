//using Repositories.Entity;
//using Repositories.Interfaces;
//using System.Collections.Generic;
//using System.Linq;

//namespace Repositories.Repositories
//{
//    public class ConnectionRepository : IMessageExtensionRepository<Connection>
//    {
//        private readonly IContext context;

//        public ConnectionRepository(IContext context)
//        {
//            this.context = context;
//        }

//        public Connection AddItem(Connection item)
//        {
//            context.Connections.Add(item);
//            context.Save();
//            return item;
//        }

//        public void Delete(int id)
//        {
//            Connection connection = Get(id);
//            if (connection != null)
//            {
//                context.Connections.Remove(connection);
//                context.Save();
//            }
//        }

//        public void DeleteByConnectionId(string connectionId)
//        {
//            var connection = GetByConnectionId(connectionId);
//            if (connection != null)
//            {
//                context.Connections.Remove(connection);
//                context.Save();
//            }
//        }

//        public Connection Get(int id)
//        {
//            return context.Connections.FirstOrDefault(c => c.Id == id);
//        }

//        public Connection GetByConnectionId(string connectionId)
//        {
//            return context.Connections.FirstOrDefault(c => c.ConnectionId == connectionId);
//        }

//        public List<Connection> GetAll()
//        {
//            return context.Connections.ToList();
//        }

//        public List<Connection> GetByUserId(int userId)
//        {
//            return context.Connections.Where(c => c.UserId == userId).ToList();
//        }

//        public Connection Update(int id, Connection entity)
//        {
//            Connection connection = Get(id);
//            if (connection == null)
//                throw new KeyNotFoundException($"Connection with ID {id} not found.");

//            connection.ConnectionId = entity.ConnectionId;
//            connection.UserId = entity.UserId;
//            connection.ConnectedAt = entity.ConnectedAt;

//            context.Save();
//            return Get(id);
//        }
//    }
//}
