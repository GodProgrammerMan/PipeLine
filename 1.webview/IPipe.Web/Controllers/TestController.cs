using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace IPipe.Web.Controllers
{
    public class TestController : Controller
    {
		readonly Ipipe_holeServices _ipipe_HoleServices;
		readonly Ipipe_lineServices _ipipe_LineServices;

		public TestController(Ipipe_holeServices ipipe_HoleServices, Ipipe_lineServices ipipe_LineServices)
		{
			_ipipe_HoleServices = ipipe_HoleServices;
			_ipipe_LineServices = ipipe_LineServices;
		}

		string parentsIDS = "0,";
		string ChildrsIDS = "0,";

		public IActionResult Index(){
			//处理
			//List<TreeLineMolde> treeList = _ipipe_LineServices.getLineListBytree();
			//foreach (var item in treeList)
			//{
			//	//计算
			//	Compute(item, treeList);
			//	//修改
			//	_ipipe_LineServices.UpdateParentsIDSChildrsIDS(parentsIDS.TrimEnd(','), ChildrsIDS.TrimEnd('.'), item.id);

			//}
			return View();
		}
        
        public void Compute(TreeLineMolde  treeLineMolde, List<TreeLineMolde> treeList)
        {
			parentsIDS = "0,";
		    ChildrsIDS = "0,";
			getParents(treeLineMolde, treeList);
			getChildrs(treeLineMolde, treeList);


		}

		private void getParents(TreeLineMolde treeLineMolde, List<TreeLineMolde> treeList)
		{
			foreach (var item in treeList)
			{
				if (item.eHoleID == treeLineMolde.sHoleID && !isExist(parentsIDS,item.id)) {
					parentsIDS += $"{item.id},";
					getParents(item, treeList);
				}
			}
		}

		private void getChildrs(TreeLineMolde treeLineMolde, List<TreeLineMolde> treeList)
		{
			foreach (var item in treeList)
			{
				if (item.sHoleID == treeLineMolde.eHoleID && !isExist(ChildrsIDS, item.id))
				{
					ChildrsIDS += $"{item.id},";
					getChildrs(item, treeList);
				}
			}
		}

		private Boolean isExist(string IDS, int id)
		{
			return IDS.IndexOf($",{id},") > -1;
		}
	}
}