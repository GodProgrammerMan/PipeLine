using System.IO;
using System.Reflection;
using System.Xml;
using Autofac.Extensions.DependencyInjection;
using log4net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace IPipe.Web
{
    public class Program
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(Program));
        public static void Main(string[] args)
        {
            XmlDocument log4netConfig = new XmlDocument();
            log4netConfig.Load(File.OpenRead("Log4net.config"));

            var repo = log4net.LogManager.CreateRepository(
                Assembly.GetEntryAssembly(), typeof(log4net.Repository.Hierarchy.Hierarchy));

            log4net.Config.XmlConfigurator.Configure(repo, log4netConfig["log4net"]);

            // ���ɳ��� web Ӧ�ó���� Microsoft.AspNetCore.Hosting.IWebHost��Build��WebHostBuilder���յ�Ŀ�ģ�������һ�������WebHost����������������
            var host = CreateHostBuilder(args).Build();

            // ���������ڽ��������������� Microsoft.Extensions.DependencyInjection.IServiceScope��
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var loggerFactory = services.GetRequiredService<ILoggerFactory>();
            }
            host.Run();
        }
        public static IHostBuilder CreateHostBuilder(string[] args) =>
          Host.CreateDefaultBuilder(args)
            .UseServiceProviderFactory(new AutofacServiceProviderFactory()) //<--NOTE 
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder
                .UseStartup<Startup>()
                .ConfigureLogging((hostingContext, builder) =>
                {
                    builder.ClearProviders();
                    builder.SetMinimumLevel(LogLevel.Trace);
                    builder.AddConfiguration(hostingContext.Configuration.GetSection("Logging"));
                    builder.AddConsole();
                    builder.AddDebug();
                });
            });
    }
}
