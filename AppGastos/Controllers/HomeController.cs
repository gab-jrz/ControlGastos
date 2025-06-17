using Microsoft.AspNetCore.Mvc;

namespace AppGastos.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return Content("¡La API y el backend están funcionando correctamente!");
        }
    }
} 