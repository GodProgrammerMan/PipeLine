using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class LineHoleDateModel
    {
        public List<LineDateMolde> lineDateMoldes { get; set; } = new List<LineDateMolde>();
        public List<HoleDateMolde> holeDateMoldes { get; set; } = new List<HoleDateMolde>();
    }

    public class LineDateMolde { 
        public int LineID { get; set; }
        public int sholeID { get; set; }
        public int eholeID { get; set; }
        public string S_Point { get; set; }
        public string E_Point { get; set; }
        public string s_subsid { get; set; }
        public string e_subsid { get; set; }
        public double sCoorWgsX { get; set; }
        public double sCoorWgsY { get; set; }
        public double sDeep { get; set; }
        public double eCoorWgsX { get; set; }
        public double eCoorWgsY { get; set; }
        public double eDeep { get; set; }
        public string line_Class { get; set; }
        public string pSize { get; set; }
        public double cCoorWgsY { get; set; }
        public double cCoorWgsX { get; set; }
        public string Lno { get; set; }
        public string s_Feature { get; set; }
        public string e_Feature { get; set; }
        public double shight { get; set; }
        public double ehight { get; set; }
        public double smaxdeep { get; set; }
        public double emaxdeep { get; set; }
        public double[] dbCoor { get; set; }
    }

    public class HoleDateMolde {
        public double hight { get; set; }
        public string subsid { get; set; }
        public int holeID { get; set; }
        public string Exp_No { get; set; }
        public double CoorWgsX { get; set; }
        public double CoorWgsY { get; set; }
        public double Deep { get; set; }
        public string hType { get; set; }
        public double szCoorX { get; set; }
        public double szCoorY { get; set; }
        public string Feature { get; set; }
        public double maxdeep { get; set; }
    }
}
