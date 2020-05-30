using System;

namespace IPipe.Model.Models
{
    public class FrameSeed
    {
        /// <summary>
        /// 生成Model层
        /// </summary>
        /// <param name="myContext">上下文</param>
        /// <param name="tableNames">数据库表名数组，默认空，生成所有表</param>
        /// <returns></returns>
        public static bool CreateModels(MyContext myContext, string[] tableNames = null)
        {

            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path.Substring(0, path.Length - 39);
                myContext.Create_Model_ClassFileByDBTalbe($@"{path}\IPipe.Model\Models", "IPipe.Model.Models", tableNames, "");
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }

        /// <summary>
        /// 生成IRepository层
        /// </summary>
        /// <param name="myContext">上下文</param>
        /// <param name="tableNames">数据库表名数组，默认空，生成所有表</param>
        /// <returns></returns>
        public static bool CreateIRepositorys(MyContext myContext, string[] tableNames = null)
        {

            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path.Substring(0, path.Length - 39);
                myContext.Create_IRepository_ClassFileByDBTalbe($@"{path}IPipe.IRepository", "IPipe.IRepository", tableNames, "");
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }



        /// <summary>
        /// 生成 IService 层
        /// </summary>
        /// <param name="myContext">上下文</param>
        /// <param name="tableNames">数据库表名数组，默认空，生成所有表</param>
        /// <returns></returns>
        public static bool CreateIServices(MyContext myContext, string[] tableNames = null)
        {

            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path.Substring(0, path.Length - 39);
                myContext.Create_IServices_ClassFileByDBTalbe($@"{path}IPipe.IServices", "IPipe.IServices", tableNames, "");
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }



        /// <summary>
        /// 生成 Repository 层
        /// </summary>
        /// <param name="myContext">上下文</param>
        /// <param name="tableNames">数据库表名数组，默认空，生成所有表</param>
        /// <returns></returns>
        public static bool CreateRepository(MyContext myContext, string[] tableNames = null)
        {

            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path.Substring(0, path.Length - 39);
                myContext.Create_Repository_ClassFileByDBTalbe($@"{path}IPipe.Repository", "IPipe.Repository", tableNames, "");
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }



        /// <summary>
        /// 生成 Service 层
        /// </summary>
        /// <param name="myContext">上下文</param>
        /// <param name="tableNames">数据库表名数组，默认空，生成所有表</param>
        /// <returns></returns>
        public static bool CreateServices(MyContext myContext, string[] tableNames = null)
        {

            try
            {
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path.Substring(0, path.Length - 39);
                myContext.Create_Services_ClassFileByDBTalbe($@"{path}IPipe.Services", "IPipe.Services", tableNames, "");
                return true;
            }
            catch (Exception)
            {
                return false;
            }

        }
    }
}
