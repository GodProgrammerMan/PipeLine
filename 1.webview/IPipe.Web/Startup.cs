using System;
using System.Collections.Generic;
using System.Linq;
using Autofac;
using IPipe.Common;
using IPipe.Common.Helper;
using IPipe.Common.LogHelper;
using IPipe.Web.Extensions;
using IPipe.Web.Filter;
using log4net;
using log4net.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using IPipe.Web.AOP;
using System.Reflection;
using Autofac.Extras.DynamicProxy;
using IPipe.Web.Middlewares;
using IPipe.Common.Hubs;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.Features;
using System.IO;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Http;

namespace IPipe.Web
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }
        /// <summary>
        /// log4net �ִ���
        /// </summary>
        public static ILoggerRepository Repository { get; set; }
        private IServiceCollection _services;
        private static readonly ILog log = LogManager.GetLogger(typeof(GlobalExceptionsFilter));

        public Startup(IConfiguration configuration,IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        /// <summary>
        /// ע�����
        /// </summary>
        /// <param name="services"></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // ����code�����������в�һ��,�Դ������˷�װ,����鿴�Ҳ� Extensions �ļ���.
            services.AddSingleton<IRedisCacheManager, RedisCacheManager>();//ע�Ỻ�����
            services.AddSingleton(new Appsettings(Configuration));//��ʼ��ע��Configuration����
            services.AddSingleton(new LogLock(Env.ContentRootPath));//ע��log�ռ�

            
            services.AddMemoryCacheSetup();//ע��Microsoft.Extensions.Caching.Memory����
            services.AddAutoMapperSetup();//ע�ᴴ����ϵӳ��
            services.AddCorsSetup();//ע��Cors �������񣬿������������������
            services.AddSqlsugarSetup();//�������ݿ�����

            services.AddSignalR().AddNewtonsoftJsonProtocol();//ע�ῪʼSignalR��jsonͨ��


            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue; // In case of multipart
            });

            //����session
            services.AddSession(options =>
            {
                // ���� Session ����ʱ��
                options.IdleTimeout = TimeSpan.FromMinutes(60);
            });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => false;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.Configure<KestrelServerOptions>(x => x.AllowSynchronousIO = true)
                    .Configure<IISServerOptions>(x => x.AllowSynchronousIO = true);

            services.AddControllersWithViews(o =>
            {
                // ȫ���쳣����
                o.Filters.Add(typeof(GlobalExceptionsFilter));
            }).AddRazorRuntimeCompilation();

            _services = services;
        }

        // ע����CreateDefaultBuilder�У����Autofac���񹤳�
        public void ConfigureContainer(ContainerBuilder builder)
        {
            var basePath = AppContext.BaseDirectory;

            #region ���нӿڲ�ķ���ע��
            var servicesDllFile = Path.Combine(basePath, "IPipe.Services.dll");
            var repositoryDllFile = Path.Combine(basePath, "IPipe.Repository.dll");

            if (!(File.Exists(servicesDllFile) && File.Exists(repositoryDllFile)))
            {
                var msg = "Repository.dll��service.dll ��ʧ����Ϊ��Ŀ�����ˣ�������Ҫ��F6���룬��F5���У����� bin �ļ��У���������";
                log.Error(msg);
                throw new Exception(msg);
            }



            // AOP ���أ������Ҫ��ָ���Ĺ��ܣ�ֻ��Ҫ�� appsettigns.json ��Ӧ��Ӧ true ���С�
            var cacheType = new List<Type>();
            if (Appsettings.app(new string[] { "AppSettings", "RedisCachingAOP", "Enabled" }).ObjToBool())
            {
                builder.RegisterType<IPipeRedisCacheAOP>();
                cacheType.Add(typeof(IPipeRedisCacheAOP));
            }
            if (Appsettings.app(new string[] { "AppSettings", "MemoryCachingAOP", "Enabled" }).ObjToBool())
            {
                builder.RegisterType<IPipeCacheAOP>();
                cacheType.Add(typeof(IPipeCacheAOP));
            }
            if (Appsettings.app(new string[] { "AppSettings", "TranAOP", "Enabled" }).ObjToBool())
            {
                builder.RegisterType<IPipeTranAOP>();
                cacheType.Add(typeof(IPipeTranAOP));
            }
            if (Appsettings.app(new string[] { "AppSettings", "LogAOP", "Enabled" }).ObjToBool())
            {
                builder.RegisterType<IPipeLogAOP>();
                cacheType.Add(typeof(IPipeLogAOP));
            }
            

            // ��ȡ Service.dll ���򼯷��񣬲�ע��
            var assemblysServices = Assembly.LoadFrom(servicesDllFile);
            builder.RegisterAssemblyTypes(assemblysServices)
                      .AsImplementedInterfaces()
                      .InstancePerDependency()
                      .EnableInterfaceInterceptors()//����Autofac.Extras.DynamicProxy;
                      .InterceptedBy(cacheType.ToArray());//����������������б�����ע�ᡣ

            // ��ȡ Repository.dll ���򼯷��񣬲�ע��
            var assemblysRepository = Assembly.LoadFrom(repositoryDllFile);
            builder.RegisterAssemblyTypes(assemblysRepository)
                   .AsImplementedInterfaces()
                   .InstancePerDependency();

            #endregion

            #region û�нӿڲ�ķ����ע��

            //��Ϊû�нӿڲ㣬���Բ���ʵ�ֽ��ֻ���� Load ������
            //ע�����ʹ��û�нӿڵķ��񣬲������ʹ�� AOP ���أ��ͱ�������Ϊ�鷽��
            //var assemblysServicesNoInterfaces = Assembly.Load("IPipe.Services");
            //builder.RegisterAssemblyTypes(assemblysServicesNoInterfaces);

            #endregion

            #region û�нӿڵĵ����࣬����class��������

            ////ֻ��ע������е��鷽�����ұ�����public
            //builder.RegisterAssemblyTypes(Assembly.GetAssembly(typeof(HttpCookieHelper)))
            //    .EnableClassInterceptors()
            //    .InterceptedBy(cacheType.ToArray());
            #endregion

            #region ����ע��һ�����нӿڵ��࣬����interface��������

            //�����鷽��
            //builder.RegisterType<AopService>().As<IAopService>()
            //   .AsImplementedInterfaces()
            //   .EnableInterfaceInterceptors()
            //   .InterceptedBy(typeof(IPipeCacheAOP));
            #endregion

        }

        /// <summary>
        /// ע���м�ܵ�
        /// </summary>
        /// <param name="app"></param>
        /// <param name="env"></param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            // signalr 
            app.UseSignalRSendMildd();
            #region Environment
            if (env.IsDevelopment())
            {
                // �ڿ��������У�ʹ���쳣ҳ�棬�������Ա�¶�����ջ��Ϣ�����Բ�Ҫ��������������
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // �ڷǿ��������У�ʹ��HTTP�ϸ�ȫ����(or HSTS) ���ڱ���web��ȫ�Ƿǳ���Ҫ�ġ�
                // ǿ��ʵʩ HTTPS �� ASP.NET Core����� app.UseHttpsRedirection
                app.UseHsts();

            }
            #endregion

 
            // ������������ ע���±���Щ�м����˳�򣬺���Ҫ ������������

            app.UseCors("pipeWeb");

            // ʹ�þ�̬�ļ�
            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes = true 
            });

            // ���ش�����
            app.UseStatusCodePages();//�Ѵ����뷵��ǰ̨��������404
            // Routing
            app.UseRouting();
            //sesion
            //app.UseSession();
            app.UseCookiePolicy();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapHub<ChatHub>("/web/msgPush");
            });
        }
    }
}
