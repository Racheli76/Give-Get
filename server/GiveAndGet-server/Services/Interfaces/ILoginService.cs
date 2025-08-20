using Services.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Services.Interfaces
{
    public interface ILoginService
    {
        string GenerateToken(UserDto user);
        UserDto Verify(string name, string pwd);
        bool ValidateUserId(ClaimsPrincipal user, int userId);
        int GetUserIdFromToken(ClaimsPrincipal user);
        bool CheckIsAdmin(ClaimsPrincipal user);
    }
}
