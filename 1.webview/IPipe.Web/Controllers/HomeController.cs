using Microsoft.AspNetCore.Mvc;

namespace IPipe.Web.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// 主界面加载主页
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }
    }
}
