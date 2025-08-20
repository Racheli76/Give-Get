using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Interfaces
{
    public interface ITalentControllerService
    {
        IActionResult Post(int id);
    }
}
