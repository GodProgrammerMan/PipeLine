using IPipe.Common;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace IPipe.Web.Extensions
{
    /// <summary>
    /// Cors 启动服务
    /// </summary>
    public static class CorsSetup
    {
        public static void AddCorsSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));



            services.AddCors(c =>
            {
                //允许任意跨域请求，也要配置中间件
                c.AddPolicy("pipeWeb", policy =>
                {
                    policy.AllowAnyOrigin();
                    policy.AllowAnyMethod();
                    policy.AllowAnyHeader();
                });
            });
        }
    }
}
