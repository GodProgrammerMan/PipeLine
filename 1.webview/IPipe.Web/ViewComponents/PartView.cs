using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPipe.Web.ViewComponents
{
    [ViewComponent(Name = "PartView")]
    public class PartView : ViewComponent
    {

        public PartView()
        {

        }
        /// <summary>
        /// 部分视图展示
        /// </summary>
        /// <param name="partName">视图组件将要显示的视图名</param>
        /// <param name="param">参数</param>
        /// <returns></returns>
        public async Task<IViewComponentResult> InvokeAsync(
        string partName, IDictionary<string, object> param = null)
        {
            switch (partName)
            {
                case "3DPartView":
                  #region 3dcensium,地图
                   // await Task.Run(() => _articleCategoryServices.GetArticleForIndex());
                    return View(partName);
                #endregion
                case "2DPartView":
                    #region 3dcensium,地图
                    // await Task.Run(() => _articleCategoryServices.GetArticleForIndex());
                    return View(partName);
                #endregion
                default:
                    return View(partName);
            }
        }
    }

}
