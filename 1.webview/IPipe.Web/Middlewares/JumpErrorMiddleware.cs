using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPipe.Web.Middlewares
{
    public class JumpErrorMiddleware
    {
        private readonly RequestDelegate _next;
        private static readonly log4net.ILog log = log4net.LogManager.GetLogger(typeof(JumpErrorMiddleware));

        public JumpErrorMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                if (ex != null) log.Error(ex.GetBaseException().ToString());
            }
  
            var response = context.Response;
            //如果是404就跳转到主页
            if (response.StatusCode == 404)
                response.Redirect("/common/error.html?statusCode=400");
            else if (response.StatusCode == 500)
                response.Redirect("/common/error.html?statusCode=500&msg=服务器出错了，麻烦您联系我吧QQ：960842214");
        }
    }
}
