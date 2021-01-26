using IPipe.Model.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Generate
{
    public class Generate
    {
        public static void Main(string[] args)
        {
            //新建表首次运行需要创建所有框架代码。添加字段只需要创建实体即可。如果只改了单个表字段，尽量添加相对应的表名进行生成
            MyContext myContext = new MyContext();
            //生成单个实体CreateModels(myContext,"表名")
            var modelResult = FrameSeed.CreateModels(myContext,new string[] {"cctv"});
            //生成单个iRepository的CreateIRepositorys(myContext,"表名")
            var iRepositoryResult = FrameSeed.CreateIRepositorys(myContext, new string[] { "cctv" });
            //生成单个iServices的iServicesResult(myContext,"表名")
            var iServicesResult = FrameSeed.CreateIServices(myContext, new string[] { "cctv" });
            //生成单个repository的iServicesResult(myContext,"表名")
            var repositoryResult = FrameSeed.CreateRepository(myContext, new string[] { "cctv" });
            //生成单个services的CreateServices(myContext,"表名")
            var servicesResult =  FrameSeed.CreateServices(myContext, new string[] { "cctv" });
            Console.WriteLine($"实体创建结果：{modelResult}\n iRepository创建结果：{iRepositoryResult}\n" +
                $"iServicesResult创建结果：{iServicesResult}\n repositoryResult创建结果：{repositoryResult}\n" +
                $"servicesResult创建结果：{servicesResult}\n ");
        }
    }
}
