using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPipe.IServices;
using Microsoft.AspNetCore.Mvc;

namespace IPipe.Web.Controllers
{
    public class HiddenDangerController : Controller
    {
        readonly Ihidden_dangerServices  _ihidden_DangerServices;
        readonly Ipipe_lineServices _ipipe_LineServices;

        public HiddenDangerController(Ihidden_dangerServices  ihidden_DangerServices, Ipipe_lineServices ipipe_LineServices)
        {
            _ihidden_DangerServices = ihidden_DangerServices;
            _ipipe_LineServices = ipipe_LineServices;
        }
        public IActionResult Index(string action="add",int ty=1,double x=0,double y=0,double z=0,int objID=0)
        {
            //创建和编辑隐患


            return View();
        }

    }
}