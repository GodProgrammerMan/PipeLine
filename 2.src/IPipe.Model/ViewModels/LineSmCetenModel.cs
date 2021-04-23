using Org.BouncyCastle.Asn1.X9;
using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class LineSmCetenModel
    {
        public string Gxbh { get; set; }
        public string qdh { get; set; }
        public double S_Deep { get; set; }
        public string zdh { get; set; }
        public double E_Deep { get; set; }  
        public string Type { get; set; }
        public string ZType { get; set; }
        public string Material { get; set; }
        public string PSize { get; set; }
        public string CabNum { get; set; }
        public string FlowDir { get; set; }
        public string Address { get; set; }
        public string EmBed { get; set; }
        public DateTime MDate { get; set; }
        public string Belong { get; set; }
        public string DataSource { get; set; } 
        public double PipeLength { get; set; }
        public double startx { get; set; }
        public double starty { get; set; }
        public double starth { get; set; }
        public double endx { get; set; }
        public double endy { get; set; }
        public double endh { get; set; }
        public double startbottom { get; set; }
        public double startcrow { get; set; }
        public double endbottom { get; set; }
        public double endcrow { get; set; }
        public double diax { get; set; }
        public double diay { get; set; }
        public double lxjd { get; set; }//流向角度
        public double bzjd { get; set; }//标注角度
    }
    public class HoleSmCetenModel {
        /// <summary>
        /// 排序点号
        /// </summary>
        public string Pxdh { get; set; }
        public string DH { get; set; }
        public string Type { get; set; }
        public string ZType { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double High { get; set; }
        public string Feature { get; set; }
        public  string  Subsid { get; set; }
        public string FeaMaterial { get; set; }
        public string Belong { get; set; }
        public DateTime MDate { get; set; }
        public string DataSource { get; set; }
        public string Note { get; set; }
    }
    public class GxdModel { 
       public string CG_WTBH { get; set; }
        public string CG_LJDH { get; set; }
        public double CG_MS { get; set; }
    }
}
