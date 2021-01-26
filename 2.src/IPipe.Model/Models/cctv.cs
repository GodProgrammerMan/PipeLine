
using System;
using System.Linq;
using System.Text;
using SqlSugar;


namespace IPipe.Model.Models
{
        ///<summary>
    ///
    ///</summary>
    [SugarTable("cctv")]
    public class cctv
    {
        public cctv()
        {
        }
                   /// <summary>
           /// Desc:表ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
           [SugarColumn(IsPrimaryKey=true,IsIdentity=true)]
        public int id { get; set; }

            
           /// <summary>
           /// Desc:线ID
           /// Default:
           /// Nullable:True
           /// </summary>
        
        public int? LineID { get; set; }

            
           /// <summary>
           /// Desc:cctvID
           /// Default:
           /// Nullable:True
           /// </summary>
        
        public int? cctvID { get; set; }

            
           /// <summary>
           /// Desc:cctv内容
           /// Default:
           /// Nullable:True
           /// </summary>
        
        public string cctvJsonStr { get; set; }

            
           /// <summary>
           /// Desc:等级
           /// Default:
           /// Nullable:True
           /// </summary>
        
        public int? grade { get; set; }

            
           /// <summary>
           /// Desc:管线名
           /// Default:
           /// Nullable:True
           /// </summary>
        
        public string lno { get; set; }

       public int areid { get; set; }
    }
}
                    