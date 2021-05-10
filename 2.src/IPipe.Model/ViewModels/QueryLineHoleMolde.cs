using IPipe.Model.Models;
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
    public class QueryLineListMolde
    {
        public int id { get; set; }
        public string eNo { get; set; }
        public double coorWgsY { get; set; }
        public double CoorWgsX { get; set; }
        public string addreess { get; set; }
        /// <summary>
        /// 数据类型
        /// </summary>
        public int dataType { get; set; }
        public int? grade { get; set; }
    }
    public class LineCCTVInfoMolde {
        public int sholeid { get; set; }
        public int eholeid { get; set; }
        /// <summary>
        ///纬度
        /// </summary>
        public double clat { get; set; }
        /// <summary>
        /// 经度
        /// </summary>
        public double clng { get; set; }
        public string lno{ get; set; }
        public string spoint { get; set; }
        public string epoint { get; set; }
        public string classType { get; set; }
        public string material { get; set; }
        public string pSize { get; set; }
        public string emBed { get; set; }
        public string belong { get; set; }
        public string address { get; set; }
        public int grade { get; set; }
        public string cctvJsonStr { get; set; }
        public string yhcontent { get; set; }
        public int handleState { get; set; }
        public bool isAnyCCTV { get; set; }
        public bool isAnyYH { get; set; }
    }
}
