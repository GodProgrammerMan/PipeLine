using IPipe.Model.Models;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace IPipe.Web.Extensions
{
    /// <summary>
    /// Db 启动服务
    /// </summary>
    public static class DbSetup
    {
        /// <summary>
        ///  Db 启动服务
        /// </summary>
        /// <param name="services"></param>
        public static void AddDbSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            services.AddScoped<DBSeed>();
            services.AddScoped<MyContext>();
        }
    }
}
