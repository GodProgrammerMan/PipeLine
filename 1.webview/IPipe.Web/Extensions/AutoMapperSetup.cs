using AutoMapper;
using IPipe.Web.AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace IPipe.Web.Extensions
{
    /// <summary>
    /// Automapper 启动服务
    /// </summary>
    public static class AutoMapperSetup
    {
        /// <summary>
        ///  Automapper 启动服务
        /// </summary>
        /// <param name="services"></param>
        public static void AddAutoMapperSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            services.AddAutoMapper(typeof(AutoMapperConfig));
            AutoMapperConfig.RegisterMappings();
        }
    }
}
