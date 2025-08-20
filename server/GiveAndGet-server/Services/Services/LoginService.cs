using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Services.Dtos;
using Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services.Services
{
    public class LoginService : ILoginService
    {
        private readonly IService<UserDto> _userService;
        private readonly IConfiguration _config;

        public LoginService(IService<UserDto> userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        public string GenerateToken(UserDto user)
        {
            //the code to encode in a bytes array
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            //encoding
            var carditional = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.IsAdmin == true ? "admin" : "user") // הוספת תביעה לתפקיד
            };
            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"], _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: carditional
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public UserDto Verify(string name, string pwd)
        {
            return _userService.GetAll().FirstOrDefault(u => u.UserName == name && BCrypt.Net.BCrypt.Verify(pwd, u.HashPwd));
        }

        public bool ValidateUserId(ClaimsPrincipal user, int userId)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return false;
            }
            return int.Parse(claim.Value) == userId;
        }

        public int GetUserIdFromToken(ClaimsPrincipal user)
        {
            var claim = user.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
            {
                return -1;
            }
            return int.Parse(claim.Value);
        }

        public bool CheckIsAdmin(ClaimsPrincipal user)
        {
            return user.FindFirst(ClaimTypes.Role).Value == "admin";
        }
    }
}