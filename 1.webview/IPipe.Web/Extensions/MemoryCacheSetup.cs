using IPipe.Common.MemoryCache;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace IPipe.Web.Extensions
{
    /// <summary>
    /// Cors 启动服务
    /// </summary>
    public static class MemoryCacheSetup
    {
        /// <summary>
        ///     Cors 启动服务
        /// </summary>
        /// <param name="services"></param>
        public static void AddMemoryCacheSetup(this IServiceCollection services)
        {
            if (services == null) throw new ArgumentNullException(nameof(services));

            services.AddScoped<ICaching, MemoryCaching>();
            services.AddSingleton<IMemoryCache>(factory =>
            {
                var cache = new MemoryCache(new MemoryCacheOptions());
                return cache;
            });
        }
    }
}
