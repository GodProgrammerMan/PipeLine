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
    }
}
