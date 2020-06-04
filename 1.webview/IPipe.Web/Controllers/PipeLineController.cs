using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace IPipe.Web.Controllers
{
    public class PipeLineController : Controller
    {
        public IActionResult EditPipeLine()
        {
            return View();
        }
    }
}