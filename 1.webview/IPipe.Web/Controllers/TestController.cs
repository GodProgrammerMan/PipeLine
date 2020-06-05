using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPipe.IServices;
using IPipe.Model.Models;
using Microsoft.AspNetCore.Mvc;

namespace IPipe.Web.Controllers
{
    public class TestController : Controller
    {

        readonly Ipipe_lineServices _ipipe_LineServices;

        List<pipe_line> list1 = new List<pipe_line>();
        List<pipe_line> list2 = new List<pipe_line>();

		public IActionResult Index(){
			return View();
		}
        
        public void Compute(pipe_line pipe)
        {
            List<pipe_line> LineList = _ipipe_LineServices.Query().Result;

			getParents(pipe, LineList);
			getChildrs(pipe, LineList);

		}

		private void getParents(pipe_line pipe, List<pipe_line> list)
		{
			for (int i = 0; list != null && i < list.Count; i++)
			{
				if (list[i].E_Point == pipe.S_Point && !isExist(list1, list[i]))
				{
					list1.Add(list[i]);
					getParents(list[i], list);
				}
			}
		}

		private void getChildrs(pipe_line pipe, List<pipe_line> list)
		{
			for (int i = 0; list != null && i < list.Count; i++)
			{
				if (list[i].S_Point == pipe.E_Point && !isExist(list2, list[i]))
				{
					list2.Add(list[i]);
					getChildrs(list[i], list);
				}
			}
		}

		private Boolean isExist(List<pipe_line> list, pipe_line pipe)
		{
			for (int i = 0; list != null && i < list.Count; i++)
			{
				if (list[i].S_Point == pipe.S_Point && list[i].E_Point == pipe.E_Point)
					return true;
			}
			return false;
		}
	}
}