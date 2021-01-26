using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IPipe.Common.Helper;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace IPipe.Web.Controllers
{
    public class BaseController : Controller
    {
        public int areid = 1;
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var areaname = GetValue("area");
            if (string.IsNullOrWhiteSpace(areaname))
            {
                areid = 1;
            }
            else {
                if (areaname.Equals("gd_sz_gm")) 
                    areid = 2;
                 else 
                    areid = 1;
            }
            base.OnActionExecuting(filterContext);
        }

        /// <summary>
        /// 添加cookie缓存不设置过期时间
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        public void AddCookie(string key, string value)
        {
            try
            {
                HttpContext.Response.Cookies.Append(key, value);
            }
            catch (Exception)
            {
            }
        }
        /// <summary>
        /// 添加cookie缓存设置过期时间
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="time"></param>
        public void AddCookie(string key, string value, int time)
        {
            HttpContext.Response.Cookies.Append(key, value, new CookieOptions
            {
                Expires = DateTime.Now.AddMilliseconds(time)
            });
        }
        /// <summary>
        /// 删除cookie缓存
        /// </summary>
        /// <param name="key"></param>
        public void DeleteCookie(string key)
        {
            HttpContext.Response.Cookies.Delete(key);
        }
        /// <summary>
        /// 根据键获取对应的cookie
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string GetValue(string key)
        {
            var value = "";
            HttpContext.Request.Cookies.TryGetValue(key, out value);
            if (string.IsNullOrWhiteSpace(value))
            {
                value = string.Empty;
            }
            return value;
        }
    }
}