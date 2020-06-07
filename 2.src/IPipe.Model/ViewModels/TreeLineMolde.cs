using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model.ViewModels
{
    public class TreeLineMolde
    {
        /// <summary>
        /// 开始井
        /// </summary>
        public int sHoleID { get; set; }
        /// <summary>
        /// 结束井
        /// </summary>
        public int eHoleID { get; set; }
        /// <summary>
        /// 当前Line的id
        /// </summary>
        public int id { get; set; }
    }
}
