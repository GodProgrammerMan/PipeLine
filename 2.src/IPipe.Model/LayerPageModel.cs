using System;
using System.Collections.Generic;
using System.Text;

namespace IPipe.Model
{
    public class LayerPageModel<T>
    {
        /// <summary>
        /// 返回代码
        /// </summary>
        public int code { get; set; }
        /// <summary>
        /// 数据总数
        /// </summary>
        public int count { get; set; }
        /// <summary>
        /// 数据
        /// </summary>
        public List<T> data { get; set; } = new List<T>();
        /// <summary>
        /// 成功
        /// </summary>
        public string msg { get; set; }
    }
}
