
using System;
using System.Linq;
using System.Text;
using SqlSugar;


namespace IPipe.Model.Models
{
        ///<summary>
    ///
    ///</summary>
    [SugarTable("pipe_line")]
    public class pipe_line
    {
        public pipe_line()
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
           /// Desc:S井点ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int S_holeID { get; set; }

            
           /// <summary>
           /// Desc:s井点编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string S_Point { get; set; }

            
           /// <summary>
           /// Desc:s井深度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double S_Deep { get; set; }

            
           /// <summary>
           /// Desc:e井点ID
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int E_holeID { get; set; }

            
           /// <summary>
           /// Desc:e井点编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string E_Point { get; set; }

            
           /// <summary>
           /// Desc:e井深度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double E_Deep { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string code { get; set; }

            
           /// <summary>
           /// Desc:检测方法
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Material { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int ServiceLif { get; set; }

            
           /// <summary>
           /// Desc:管线大小
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string PSize { get; set; }

            
           /// <summary>
           /// Desc:数量
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int CabNum { get; set; }

            
           /// <summary>
           /// Desc:总数
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int TotalHole { get; set; }

            
           /// <summary>
           /// Desc:用户井总数
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int UsedHole { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string FlowDir { get; set; }

            
           /// <summary>
           /// Desc:地址
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Address { get; set; }

            
           /// <summary>
           /// Desc:道路编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Roadcode { get; set; }

            
           /// <summary>
           /// Desc:填埋方式
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string EmBed { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public DateTime MDate { get; set; }

            
           /// <summary>
           /// Desc:归属
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Belong { get; set; }

            
           /// <summary>
           /// Desc:
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
        
        public DateTime UpdateTime { get; set; }

            
           /// <summary>
           /// Desc:管线编号
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Lno { get; set; }

            
           /// <summary>
           /// Desc:管线类型
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int LineType { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int PDS { get; set; }

            
           /// <summary>
           /// Desc:状态
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public int status { get; set; }

            
           /// <summary>
           /// Desc:管线长度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double PipeLength { get; set; }

            
           /// <summary>
           /// Desc:操作人
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Operator { get; set; }

            
           /// <summary>
           /// Desc:笔记
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string Note { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double startbotto { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double startcrow { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double endbotto { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double endcrow { get; set; }

            
           /// <summary>
           /// Desc:
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double Angel { get; set; }

            
           /// <summary>
           /// Desc:长度
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public double SHAPE_Leng { get; set; }

            
           /// <summary>
           /// Desc:管段类型（污水，雨水，雨污）
           /// Default:
           /// Nullable:False
           /// </summary>
        
        public string line_Class { get; set; }

        public string parentIDs { get; set; }
        public string subclassIDs { get; set; }
    }
}
                    