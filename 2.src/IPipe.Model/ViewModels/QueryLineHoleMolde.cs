using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class QueryLineHoleMolde
    {
        public int id{ get; set;}
        public string eNo { get; set; }
        public double coorWgsY { get; set; }
        public double CoorWgsX { get; set; }
        public string addreess { get; set; }
        /// <summary>
        /// 数据类型
        /// </summary>
        public int dataType { get; set; }
    }
}
