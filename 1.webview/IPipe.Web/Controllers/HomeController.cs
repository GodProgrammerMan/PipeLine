using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using IPipe.Web.Models;
using IPipe.Common.HttpContextUser;
using IPipe.IServices;
using IPipe.Model.ViewModels;

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
