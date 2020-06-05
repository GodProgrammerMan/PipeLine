using IPipe.Model.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class HoleInfoMolde
    {
        /// <summary>
        /// 实体数据
        /// </summary>
        public pipe_hole model { get; set; } = new pipe_hole();
        /// <summary>
        /// 图片
        /// </summary>
        public List<pipe_hole_img> imgs { get; set; } = new List<pipe_hole_img>();
        /// <summary>
        /// 隐患List
        /// </summary>
        public List<hidden_danger> dangers { get; set; } = new List<hidden_danger>();
    }
}
