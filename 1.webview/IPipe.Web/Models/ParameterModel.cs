using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IPipe.Web.Models
{
    public class GetLineHoleModel 
    {
        public int sum { get; set; }
        public string logo { get; set; }
        public string departmentName { get; set; }
        public string name { get; set; }
    }
    public class IDParameter { 
        public int id { get; set; }
    }
    public class KWParameter {
        public string kw { get; set; }
    }

    public class EditHiddenDangerModel
    {
        public int id { get; set; }
        public string hd_name { get; set; }
        public string GR_img { get; set; }
        public string content { get; set; }
        public DateTime hd_time { get; set; }
        public DateTime handleTime { get; set; }
        public int handleState { get; set; }
        public string handUnit { get; set; }
        public int objID { get; set; }
        public string tableType { get; set; }
        public double CoorWgsY { get; set; }
        public double CoorWgsX { get; set; }
        public string action { get; set; }
    }
}
