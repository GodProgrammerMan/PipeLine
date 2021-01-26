using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class YhDataMolde
    {
        /// <summary>
        /// 隐患信息
        /// </summary>
        public string testMsg { get; set; }
        /// <summary>
        /// 隐患ID
        /// </summary>
        public int id { get; set; }
        public double CoorWgsY { get; set; }
        public double CoorWgsX { get; set; }
        public string tableType { get; set; }
        public int objID { get; set; }
        public double height { get; set; }
        public double eheight { get; set; }
    }
}
