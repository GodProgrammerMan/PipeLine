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
}
