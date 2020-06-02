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
        public double sCoorWgsX { get; set; }
        public double sCoorWgsY { get; set; }
        public double sDeep { get; set; }
        public double eCoorWgsX { get; set; }
        public double eCoorWgsY { get; set; }
        public double eDeep { get; set; }
    }

    public class HoleDateMolde {

        public int holeID { get; set; }
        public string Exp_No { get; set; }
        public double CoorWgsX { get; set; }
        public double CoorWgsY { get; set; }
        public double Deep { get; set; }
    }
}
