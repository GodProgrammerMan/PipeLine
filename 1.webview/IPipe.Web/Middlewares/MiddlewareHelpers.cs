using IPipe.Common.Helper;
using Microsoft.AspNetCore.Builder;

namespace IPipe.Web.Middlewares
{
    public static class MiddlewareHelpers
    {
        /// <summary>
        /// SignalR中间件
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseSignalRSendMildd(this IApplicationBuilder app)
        {
            return app.UseMiddleware<SignalRSendMildd>();
        }


        /// <summary>
        /// 异常处理中间件
        /// </summary>
        /// <param name="app"></param>
        /// <returns></returns>
        public static IApplicationBuilder UseExceptionHandlerMidd(this IApplicationBuilder app)
        {
            return app.UseMiddleware<JumpErrorMiddleware>();
        }

    }
}
