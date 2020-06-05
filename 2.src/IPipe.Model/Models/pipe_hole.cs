
using System;
using System.Linq;
using System.Text;
using SqlSugar;


namespace IPipe.Model.Models
{
        ///<summary>
    ///
    ///</summary>
    [SugarTable("pipe_hole")]
    public class pipe_hole
    {
        public pipe_hole()
        {
        }
                   /// <summary>
           /// Desc:表id
           /// Default:
           /// Nullable:False
           /// </summary>
        
           [SugarColumn(IsPrimaryKey=true,IsIdentity=true)]
        public int id { get; set; }

            
           /// <summary>
           /// Desc:项目NO
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string prj_No { get; set; }

            
           /// <summary>
           /// Desc:项目名称
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string prj_Name { get; set; }

            
           /// <summary>
           /// Desc:某编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Exp_No { get; set; }

            
           /// <summary>
           /// Desc:井类型
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string HType { get; set; }

            
           /// <summary>
           /// Desc:某类型
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string ZType { get; set; }

            
           /// <summary>
           /// Desc:深圳独立坐标X
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double szCoorX { get; set; }

            
           /// <summary>
           /// Desc:深圳独立坐标Y
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double szCoorY { get; set; }

            
           /// <summary>
           /// Desc:wgs84的X
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double CoorWgsY { get; set; }

            
           /// <summary>
           /// Desc:wgs84的Y
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double CoorWgsX { get; set; }

            
           /// <summary>
           /// Desc:高度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double hight { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int rotation { get; set; }

            
           /// <summary>
           /// Desc:编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Code { get; set; }

            
           /// <summary>
           /// Desc:井特点（如终止点：则没有井）
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Feature { get; set; }

            
           /// <summary>
           /// Desc:井类型
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Subsid { get; set; }

            
           /// <summary>
           /// Desc:材质
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string FeaMateria { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Spec { get; set; }

            
           /// <summary>
           /// Desc:井深度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double deep { get; set; }

            
           /// <summary>
           /// Desc:井的形状
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string wellShape { get; set; }

            
           /// <summary>
           /// Desc:材质
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string wellMater { get; set; }

            
           /// <summary>
           /// Desc:井管数
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double WellPipes { get; set; }

            
           /// <summary>
           /// Desc:井大小
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string WellSize { get; set; }

            
           /// <summary>
           /// Desc:地址
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Address { get; set; }

            
           /// <summary>
           /// Desc:归属
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Belong { get; set; }

            
           /// <summary>
           /// Desc:m时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime MDate { get; set; }

            
           /// <summary>
           /// Desc:地图码
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string MapCode { get; set; }

            
           /// <summary>
           /// Desc:什么单位
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string SUnit { get; set; }

            
           /// <summary>
           /// Desc:s时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime SDate { get; set; }

            
           /// <summary>
           /// Desc:更新时间
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime updateTime { get; set; }

            
           /// <summary>
           /// Desc:可见度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Visibility { get; set; }

            
           /// <summary>
           /// Desc:状态
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int status { get; set; }

            
           /// <summary>
           /// Desc:点
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int pointPosit { get; set; }

            
           /// <summary>
           /// Desc:操作员
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Operator { get; set; }

            
           /// <summary>
           /// Desc:备注
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Note { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string ljm { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Angel { get; set; }

            
           /// <summary>
           /// Desc:什么的名称
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string SymbolName { get; set; }

            
    }
}
                    