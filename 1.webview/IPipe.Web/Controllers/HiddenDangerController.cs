using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPipe.IServices;
using IPipe.Model.Models;
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
        public IActionResult Index(string action="add",int ty=1,double x=0,double y=0,double z=0,int objID=0,int id=0)
        {
            //创建和编辑隐患
            hidden_danger model = new hidden_danger();
            if (objID == 0 || "add".Equals(action) || !_ihidden_DangerServices.IsAny(t => t.id == id))
            {
                model = null;
                action = "add";
                ViewBag.departmentName = "无部门";
                ViewBag.departmentID = 0;
            }
            else
            {
                model = _ihidden_DangerServices.Query(t => t.id == id).Result.First();
                action = "edit";
            }
            //固定添加的参数附上

            ViewBag.action = action;
            return View(model);
        }

    }
}