
using System;
using System.Linq;
using System.Text;
using SqlSugar;


namespace IPipe.Model.Models
{
        ///<summary>
    ///
    ///</summary>
    [SugarTable("pipe_hole_img")]
    public class pipe_hole_img
    {
        public pipe_hole_img()
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
           /// Desc:管线ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int holeID { get; set; }

            
           /// <summary>
           /// Desc:图片名称
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string imgName { get; set; }

            
           /// <summary>
           /// Desc:图片url
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string imgURL { get; set; }

            
           /// <summary>
           /// Desc:创建时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime creatTime { get; set; }

            
           /// <summary>
           /// Desc:备注
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string regRemarks { get; set; }

        public int areid { get; set; }
        public string areatwo { get; set; }
    }
}
                    