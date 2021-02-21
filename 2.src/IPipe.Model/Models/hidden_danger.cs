
using System;
using System.Linq;
using System.Text;
using SqlSugar;


namespace IPipe.Model.Models
{
        ///<summary>
    ///
    ///</summary>
    [SugarTable("hidden_danger")]
    public class hidden_danger
    {
        public hidden_danger()
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
           /// Desc:隐患名称
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string hd_name { get; set; }

            
           /// <summary>
           /// Desc:隐患内容
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string content { get; set; }

            
           /// <summary>
           /// Desc:隐患时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime hd_time { get; set; }

            
           /// <summary>
           /// Desc:处理时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime handleTime { get; set; }

            
           /// <summary>
           /// Desc:处理状态（0-未处理，1已处理，2，处理中）
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int handleState { get; set; }

            
           /// <summary>
           /// Desc:处理单位
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string handUnit { get; set; }

            
           /// <summary>
           /// Desc:地址雷达图
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string GR_img { get; set; }

            
           /// <summary>
           /// Desc:对象ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int objID { get; set; }

            
           /// <summary>
           /// Desc:对象表ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string tableType { get; set; }
        public double CoorWgsY { get; set; }
        public double CoorWgsX { get; set; }
        public int areid { get; set; }
        public string areatwo { get; set; }
    }
}
                    