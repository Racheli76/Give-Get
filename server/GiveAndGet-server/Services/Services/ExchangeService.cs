using AutoMapper;
using Repositories.Entity;
using Repositories.Interfaces;
using Repositories.Repositories;
using Services.Dtos;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using StatusExchange = Services.Dtos.StatusExchange;
using StatusExchangeRep = Repositories.Entity.StatusExchange;


namespace Services.Services
{
    public class ExchangeService : IExchangeExtensionService, IExchangeForChat
    {
        private readonly IExchangeExtensionRepository _repository;
        private readonly Repositories.Interfaces.IRepository<User> _userRepo;
        private readonly ITalentUserExtensionRepository _talentUserRepo;
        private readonly IMapper _mapper;


        public ExchangeService(IExchangeExtensionRepository repository,
                                Repositories.Interfaces.IRepository<User> userRep,  
                                    ITalentUserExtensionRepository talentUserRepo,
                                IMapper mapper)
        {
            this._repository = repository;
            this._userRepo = userRep;
            this._talentUserRepo = talentUserRepo;
            this._mapper = mapper;
        }

        public ExchangeDto AddItem(ExchangeDto item)
        {
            return _mapper.Map<ExchangeDto>(_repository.AddItem(_mapper.Map<Exchange>(item)));
        }

        public void Delete(int id)
        {
            _repository.Delete(id);
        }

        public ExchangeDto Get(int id)
        {
            return _mapper.Map<ExchangeDto>(_repository.Get(id));
        }
        public List<ExchangeDto> GetByUserId(int userId)
        {
            //SearchExhcahngesForUser(userId);
            return _mapper.Map<List<ExchangeDto>>(_repository.GetByUserId(userId));
        }

        public List<ExchangeDto> GetAll()
        {
            return _mapper.Map<List<ExchangeDto>>(_repository.GetAll());
        }

        public ExchangeDto Update(int id, ExchangeDto item)
        {
            return _mapper.Map<ExchangeDto>(_repository.Update(id, _mapper.Map<Exchange>(item)));
        }

        public void SearchExchangesForUser(int userId)
        {
            List<Exchange> exchanges = _repository.GetByUserId(userId);
            User user = _userRepo.Get(userId);
            List<TalentUser> userTalents = _talentUserRepo.GetTalentsByUserId(userId);

            List<TalentUser> allTalentUsers = _talentUserRepo.GetAll();
            List<Exchange> newExchanges = new List<Exchange>();

            ProcessTalentMatches(userId, user, userTalents, allTalentUsers, exchanges, newExchanges);

            foreach (Exchange exchange in newExchanges)
            {
                _repository.AddItem(exchange);
            }
        }

        /// <summary>
        /// מחפש שותפים מתאימים לעסקאות תוך התחשבות בגילאים ומגדר.
        /// </summary>
        private void ProcessTalentMatches(int userId, User user, List<TalentUser> userTalents,
                                  List<TalentUser> allTalentUsers, List<Exchange> existingExchanges,
                                  List<Exchange> newExchanges)
        {
            HashSet<(int, int, int, int)> existingPairs = new HashSet<(int, int, int, int)>(
                existingExchanges.Select(e =>
                    (Math.Min(e.User1Id, e.User2Id),
                     Math.Max(e.User1Id, e.User2Id),
                     Math.Min(e.Talent1Offered, e.Talent2Offered),
                     Math.Max(e.Talent1Offered, e.Talent2Offered)))
            );

            foreach (TalentUser talent in userTalents)
            {
                List<TalentUser> potentialPartners = allTalentUsers
                    .Where(t => t.TalentId == talent.TalentId && t.IsOffered != talent.IsOffered && t.UserId != userId)
                    .OrderByDescending(t => _userRepo.Get(t.UserId).Score)
                    .ToList();

                foreach (TalentUser partner in potentialPartners)
                {
                    User partnerUser = _userRepo.Get(partner.UserId);

                    if (user.Gender != partnerUser.Gender) continue;
                    if (!IsAgeMatch(user.Age, partnerUser.Age)) continue;

                    List<TalentUser> otherTalents = allTalentUsers
                        .Where(t =>
                            t.TalentId != talent.TalentId &&
                            t.UserId == partner.UserId &&
                            userTalents.Any(ut => ut.TalentId == t.TalentId && ut.IsOffered != talent.IsOffered) &&
                            t.IsOffered == talent.IsOffered
                        )
                        .ToList();

                    foreach (TalentUser otherTalent in otherTalents)
                    {
                        var pairKey = (Math.Min(userId, partner.UserId),
                                       Math.Max(userId, partner.UserId),
                                       Math.Min(talent.TalentId, otherTalent.TalentId),
                                       Math.Max(talent.TalentId, otherTalent.TalentId));

                        if (!existingPairs.Contains(pairKey))
                        {
                            newExchanges.Add(new Exchange
                            {
                                User1Id = userId,
                                User2Id = partner.UserId,
                                Talent1Offered = talent.IsOffered ? talent.TalentId : otherTalent.TalentId,
                                Talent2Offered = talent.IsOffered ? otherTalent.TalentId : talent.TalentId,
                                Status = StatusExchangeRep.NEW,
                                DateCreated = DateTime.Now
                            });

                            existingPairs.Add(pairKey);
                        }
                    }
                }
            }
        }





        /// <summary>
        /// קובע אם שני גילאים יכולים להיות בהתאמה עסקית.
        /// </summary>
        private bool IsAgeMatch(int age1, int age2)
        {
            int minAge = Math.Min(age1, age2);
            int maxAge = Math.Max(age1, age2);

            if (maxAge <= 5) return minAge >= 3; // פעוטות יכולים עם פעוטות  
            if (maxAge <= 10) return minAge >= 5;
            if (maxAge <= 15) return minAge >= 10;
            if (maxAge <= 20) return minAge >= 15;
            if (maxAge <= 30) return minAge >= 18;
            if (maxAge <= 50) return minAge >= 25;
            return minAge >= 40; // מבוגרים יכולים עם בני גילם  
        }


        public void UpdateUserExchanges(int userId, List<int> removedTalentIds, List<int> addedTalentIds)
        {
            // שליפת כל העסקאות של המשתמש
            List<Exchange> userExchanges = _repository.GetByUserId(userId);

            // איתור עסקאות חדשות או ממתינות שמכילות כישרונות שהוסרו
            List<Exchange> exchangesToDelete = userExchanges
                .Where(e => ((StatusExchange)e.Status == StatusExchange.NEW || (StatusExchange)e.Status == StatusExchange.WAITING) &&
                            (removedTalentIds.Contains(e.Talent1Offered) || removedTalentIds.Contains(e.Talent2Offered)))
                .ToList();

            // מחיקת העסקאות שמצאנו
            foreach (Exchange exchange in exchangesToDelete)
            {
                _repository.Delete(exchange.Id);
            }

            // חיפוש עסקאות חדשות אפשריות
            SearchExchangesForUser(userId);
        }







        //the asyncronic part
        public async Task<bool> IsUserInExchangeAsync(int userId, int exchangeId)
        {
            // שימוש ב-Task.Run כדי להריץ את המתודה הסינכרונית בצורה אסינכרונית
            Exchange exchange = await Task.Run(() => _repository.Get(exchangeId));

            if (exchange == null)
            {
                return false;
            }

            return exchange.User1Id==userId || exchange.User2Id==userId;
        }

        public ExchangeDto UpdateStatus(int id, StatusExchangeRep status, int userId)
        {
            if (IsUserInExchangeAsync(userId, id).Result.ToString() != "True")
            {
                return null;
            }
            var exchange = _repository.Get(id);
            if (exchange == null) return null;

            if (exchange.User1Id == userId)
            {
                exchange.User1Confirmed = true;
            }
            else if (exchange.User2Id == userId)
            {
                exchange.User2Confirmed = true;
            }

            if (exchange.Status == StatusExchangeRep.NEW && (exchange.User1Confirmed || exchange.User2Confirmed))
            {
                exchange.Status = StatusExchangeRep.WAITING;
            }
            else if (exchange.Status == StatusExchangeRep.WAITING && exchange.User1Confirmed && exchange.User2Confirmed)
            {
                exchange.Status = StatusExchangeRep.PROCCESSING;
                exchange.User1Confirmed = false;
                exchange.User2Confirmed = false;
            }
            else if (exchange.Status == StatusExchangeRep.PROCCESSING && exchange.User1Confirmed && exchange.User2Confirmed)
            {
                exchange.Status = StatusExchangeRep.DONE;
            }

            _repository.Update(id, exchange);
            return _mapper.Map<ExchangeDto>(exchange);
        }
    }
}