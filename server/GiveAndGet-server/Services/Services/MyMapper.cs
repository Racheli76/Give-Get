using AutoMapper;
using Repositories.Entity;
using Services.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.Services
{
    public class MyMapper : Profile
    {
        public MyMapper()
        {
            // user
            // convert from server to client
            CreateMap<User, UserDto>()
                .ForMember(
                    dest => dest.ProfileImageUrl,
                    src => src.MapFrom(i => i.ProfileImage != null ? $"/api/User/profile-image/{i.Id}" : null))
                .ForMember(
                    dest => dest.Profile,
                    src => src.MapFrom(i => i.ProfileImage));
            // convert from client to server
            CreateMap<UserDto, User>()
                .ForMember(
                    dest => dest.ProfileImage,
                    src => src.MapFrom(i => i.File != null ? i.File.FileName : "default_profile_image.png")); // Default profile image          
            // others - only from server to client
            CreateMap<Comment, CommentDto>().ReverseMap();
            CreateMap<Exchange, ExchangeDto>().ReverseMap();
            CreateMap<Message, MessageDto>().ReverseMap();
            CreateMap<Talent, TalentDto>().ReverseMap();
            CreateMap<TalentRequest, TalentRequestDto>().ReverseMap();
            CreateMap<TalentUser, TalentUserDto>().ReverseMap();
            CreateMap<User, TopUserDto>()
                .ForMember(dest => dest.ProfileImageUrl,
                    opt => opt.MapFrom(src => src.ProfileImage != null ? $"/api/User/profile-image/{src.Id}" : null));

        }
    }
}