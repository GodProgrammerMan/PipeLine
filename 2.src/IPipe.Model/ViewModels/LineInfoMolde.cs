using IPipe.Model.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class LineInfoMolde
    {
        public int cctvID { get; set; }
        /// <summary>
        /// 实体数据
        /// </summary>
        public pipe_line model { get; set; } = new pipe_line();
        /// <summary>
        /// 图片
        /// </summary>
        public List<pipe_line_img> imgs { get; set; } = new List<pipe_line_img>();
        /// <summary>
        /// 隐患List
        /// </summary>
        public List<hidden_danger>  dangers { get; set; } = new List<hidden_danger>();
        /// <summary>
        /// 流向分析
        /// </summary>
        public FlowToAndTrMolde flowToMolde { get; set; } = new FlowToAndTrMolde();
        /// <summary>
        /// 溯源分析
        /// </summary>
        public FlowToAndTrMolde traceabilityMolde { get; set; } = new FlowToAndTrMolde();
    }

    public class FlowToAndTrMolde { 
        public int wsLineSum { get; set; }
        public int ysLineSum { get; set; }
        public int fLineSum { get; set; }
        public int rLineSum { get; set; }
        public List<SeLineMolde> seLineMoldes { get; set; } = new List<SeLineMolde>();
    }
    public class SeLineMolde {
        public int id{ get; set; }
        public string pSize { get; set; }
        public string lno { get; set; }
        public string line_Class { get; set; }
        public int e_holeID { get; set; }
        public int s_holeID { get; set; }
    }
}
