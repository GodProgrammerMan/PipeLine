using AutoMapper;

namespace IPipe.Web.AutoMapper
{
    public class CustomProfile : Profile
    {
        /// <summary>
        /// 配置构造函数，用来创建关系映射
        /// </summary>
        public CustomProfile()
        {
            //CreateMap<IPipeArticle, IPipeViewModels>();
            //CreateMap<IPipeViewModels, IPipeArticle>();
        }
    }
}
