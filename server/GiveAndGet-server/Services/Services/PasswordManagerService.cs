using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;

namespace Services.Services
{
    public  class PasswordManagerService
    {
        public static string HashPassword(string password)
        {
            //create hash password using salt
            string salt = BCrypt.Net.BCrypt.GenerateSalt();
            return BCrypt.Net.BCrypt.HashPassword(password, salt);
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            //verify if the hashed password and the password are the same
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}
