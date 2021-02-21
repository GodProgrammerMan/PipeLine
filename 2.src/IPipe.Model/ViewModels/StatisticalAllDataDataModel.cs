using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class StatisticalAllDataDataModel
    {
        /// <summary>
        /// 污水cctv个数
        /// </summary>
        public int wscctvSum { get; set; }
        /// <summary>
        /// 雨水cctv个数
        /// </summary>
        public int yscctvSum { get; set; }
        /// <summary>
        /// 井盖个数
        /// </summary>
        public int pipeholeSum { get; set; }
        /// <summary>
        /// 管线个数
        /// </summary>
        public int pipelineSum { get; set; }
        /// <summary>
        /// 井隐患个数
        /// </summary>
        public int yhpipehole { get; set; }
        /// <summary>
        /// 隐患管段
        /// </summary>
        public int yhpipeline { get; set; }
        /// <summary>
        /// 井类型饼状图
        /// </summary>
        public List<CommonNameValueModel> holeTypeValues { get; set; }

        /// <summary>
        /// cctv等级List
        /// </summary>
        public List<string> cctvStartList { get; set; } = new List<string>();
        /// <summary>
        /// 类型List
        /// </summary>
        public List<string> pipeTypeList { get; set; } = new List<string>();
        /// <summary>
        /// cctv数据
        /// </summary>
        public CommonAllValueListModel cctvStartmodel { get; set; } = new CommonAllValueListModel();
        /// <summary>
        /// 管线材料类型统计name
        /// </summary>
        public List<string> linemtypeNameList { get; set; } = new List<string>();
        /// <summary>
        /// 管线材料类型统计valueo
        /// </summary>
        public List<int> linemtypevalueList { get; set; } = new List<int>();
        /// <summary>
        /// 隐患状态list
        /// </summary>
        public List<string> yhStateList { get; set; } = new List<string>();
        /// <summary>
        /// 隐患数据
        /// </summary>
        public CommonAllValueListModel yhStartmodel { get; set; } = new CommonAllValueListModel();
        public List<CommonAreaModel> areaList { get; set; } = new List<CommonAreaModel>();
        public int areamaxvalue { get; set; }
    }

    public class CommonAreaModel { 
           public string name { get; set; }
           public int wsvalue { get; set; }
           public int ysvalue { get; set; }
           public int value { get; set; }
    }

    public class CommonAllValueListModel {
        public List<int> list1 { get; set; } = new List<int>();
        public List<int> list2 { get; set; } = new List<int>();
        public List<int> list3 { get; set; } = new List<int>();
        public List<int> list4 { get; set; } = new List<int>();
    }

    public class CommonNameValueModel{
         public string name { get; set; }
         public int value { get; set; }
    }
}
