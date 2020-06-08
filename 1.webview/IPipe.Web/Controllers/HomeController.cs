﻿using IPipe.Common.Helper;
using IPipe.IServices;
using IPipe.Model;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;

namespace IPipe.Web.Controllers
{
    public class HomeController : Controller
    {
        readonly Ipipe_holeServices _ipipe_HoleServices;
        readonly Ipipe_lineServices _ipipe_LineServices;

        public HomeController(Ipipe_holeServices ipipe_HoleServices, Ipipe_lineServices ipipe_LineServices) {
            _ipipe_HoleServices = ipipe_HoleServices;
            _ipipe_LineServices = ipipe_LineServices;
        }
        /// <summary>
        /// 主界面加载主页
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return View();
        }

        #region 导入excel
        /// <summary>
        /// 先导入井
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ImportHoleExcel() {
            var result = new MessageModel<bool>() { msg = "参数错误", response = false, success = true };
            try
            {
                var files = Request.Form.Files;
                if (files.Count <= 0) {
                    result.msg = "没有上传任何文件！";
                    return new JsonResult(result);
                }

                List<pipe_hole> holesList = new List<pipe_hole>();
                foreach (var file in files)
                {

                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        var szX = dt.Rows[i][6].ToString().Trim().ObjToMoney();
                        var szY = dt.Rows[i][7].ToString().Trim().ObjToMoney();
                        var szH = dt.Rows[i][8].ToString().Trim().ObjToMoney();
                        var coors = CoordinateCalculation.shenzhenTOWGS84(new double[] { szX, szY, szH });

                        pipe_hole model = new pipe_hole() {
                            prj_No = dt.Rows[i][1].ToString().Trim(),
                            prj_Name = dt.Rows[i][2].ToString().Trim(),
                            Exp_No = dt.Rows[i][3].ToString().Trim(),
                            HType = dt.Rows[i][4].ToString().Trim(),
                            ZType = dt.Rows[i][5].ToString().Trim(),
                            szCoorX = szX,
                            szCoorY = szY,
                            hight = szH,
                            CoorWgsX = coors[0],
                            CoorWgsY = coors[1],
                            rotation = dt.Rows[i][10].ToString().ObjToInt(),
                            Code = dt.Rows[i][11].ToString(),
                            Feature = dt.Rows[i][12].ToString(),
                            Subsid = dt.Rows[i][13].ToString(),
                            FeaMateria = dt.Rows[i][15].ToString(),
                            Spec = dt.Rows[i][16].ToString(),
                            deep = dt.Rows[i][19].ToString().ObjToMoney(),
                            wellShape = dt.Rows[i][20].ToString(),
                            wellMater = dt.Rows[i][21].ToString(),
                            WellSize = dt.Rows[i][22].ToString(),
                            WellPipes = dt.Rows[i][23].ToString().ObjToMoney(),
                            Address = dt.Rows[i][24].ToString(),
                            Belong = dt.Rows[i][26].ToString(),
                            MDate = dt.Rows[i][27].ToString().ObjToDate(),
                            MapCode = dt.Rows[i][28].ToString(),
                            SUnit = dt.Rows[i][29].ToString(),
                            SDate = dt.Rows[i][30].ToString().ObjToDate(),
                            updateTime = dt.Rows[i][31].ToString().ObjToDate(),
                            Visibility = dt.Rows[i][36].ToString(),
                            status = dt.Rows[i][37].ObjToInt(),
                            pointPosit = dt.Rows[i][39].ToString().ObjToInt(),
                            Operator = dt.Rows[i][40].ToString(),
                            Note = dt.Rows[i][41].ToString(),
                            ljm = dt.Rows[i][42].ToString(),
                            Angel = dt.Rows[i][43].ToString(),
                            SymbolName = dt.Rows[i][44].ToString()
                        }
                      ;

                        holesList.Add(model);
                    }
                }
                if (holesList.Count > 0) {
                   var sum = _ipipe_HoleServices.Add(holesList).Result;
                    result.response = true;
                    result.msg = $"已导入井点记录{sum}条";
                }
                else 
                    result.msg= "Excel没有数据!";
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                result.msg = $"上传文件错误信息列表错误:{ex.ToString()}";
                return new JsonResult(result);
            }
        }
        /// <summary>
        /// 再导入管线
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ImportLineExcel()
        {
            var result = new MessageModel<bool>() { msg = "参数错误", response = false, success = true };
            try
            {
                var files = Request.Form.Files;
                if (files.Count <= 0)
                {
                    result.msg = "没有上传任何文件！";
                    return new JsonResult(result);
                }
                var holeList = _ipipe_HoleServices.Query().Result;
                if (holeList.Count<=0) {
                    result.msg = "请先上传井点坐标！";
                    return new JsonResult(result);
                }
                List<pipe_line> lineList = new List<pipe_line>();
                foreach (var file in files)
                {
                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        if (!holeList.Any(t=>t.Exp_No == dt.Rows[i][3].ToString())|| !holeList.Any(t => t.Exp_No == dt.Rows[i][5].ToString()))
                            continue;
                        var s_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][3].ToString()).First();
                        var e_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][5].ToString()).First();
                        var pSize = dt.Rows[i][14].ToString();
                        
                        pipe_line model = new pipe_line()
                        {
                            S_holeID = s_Point.id,
                            S_Point = s_Point.Exp_No,
                            S_Deep = dt.Rows[i][4].ToString().ObjToMoney(),
                            E_holeID = e_Point.id,
                            E_Point = e_Point.Exp_No,
                            E_Deep = dt.Rows[i][6].ToString().ObjToMoney(),
                            line_Class = dt.Rows[i][7].ToString(),
                            code = dt.Rows[i][9].ToString(),
                            Material = dt.Rows[i][10].ToString(),
                            ServiceLif = dt.Rows[i][11].ToString().ObjToInt(),
                            PSize = pSize,
                            CabNum = dt.Rows[i][17].ToString().ObjToInt(),
                            TotalHole = dt.Rows[i][18].ToString().ObjToInt(),
                            UsedHole = dt.Rows[i][19].ToString().ObjToInt(),
                            FlowDir = dt.Rows[i][20].ToString(),
                            Address = dt.Rows[i][21].ToString(),
                            Roadcode = dt.Rows[i][22].ToString(),
                            EmBed = dt.Rows[i][23].ToString(),
                            MDate = dt.Rows[i][24].ToString().ObjToDate(),
                            Belong = dt.Rows[i][25].ToString(),
                            SUnit = dt.Rows[i][26].ToString(),
                            SDate = dt.Rows[i][27].ToString().ObjToDate(),
                            UpdateTime = dt.Rows[i][28].ToString().ObjToDate(),
                            Lno = dt.Rows[i][29].ToString(),
                            LineType = dt.Rows[i][30].ToString().ObjToInt(),
                            PDS = dt.Rows[i][31].ToString().ObjToInt(),
                            status = dt.Rows[i][32].ToString().ObjToInt(),
                            PipeLength = dt.Rows[i][33].ToString().ObjToMoney(),
                            Operator = dt.Rows[i][34].ToString(),
                            Note = dt.Rows[i][36].ToString(),
                            startbotto = dt.Rows[i][44].ToString().ObjToMoney(),
                            startcrow = dt.Rows[i][45].ToString().ObjToMoney(),
                            endbotto = dt.Rows[i][46].ToString().ObjToMoney(),
                            endcrow = dt.Rows[i][47].ToString().ObjToMoney(),
                            Angel = dt.Rows[i][49].ToString().ObjToMoney(),
                            SHAPE_Leng = dt.Rows[i][50].ToString().ObjToMoney()
                        };

                        lineList.Add(model);
                    }
                }
                if (lineList.Count > 0)
                {
                    var sum = _ipipe_LineServices.Add(lineList).Result;
                    result.response = true;
                    result.msg = $"已导入管段记录{sum}条";
                }
                else
                    result.msg = "Excel没有数据!";
                return new JsonResult(result);
            }
            catch (Exception ex)
            {
                result.msg = $"上传文件错误信息列表错误:{ex.ToString()}";
                return new JsonResult(result);
            }
        }
        #endregion

        #region 管段大范围请求
        [HttpPost]
        public IActionResult GetLineHolesDateForBd() {
            var result = new MessageModel<LineHoleDateModel>() { msg = "参数错误", response = null, success = true };
            var LineHoles = _ipipe_LineServices.GetLineHolesDate(0);
            if (LineHoles != null && LineHoles.holeDateMoldes.Count > 0 && LineHoles.lineDateMoldes.Count > 0)
            {
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有管道数据哦";


            return new JsonResult(result);
        }
        /// <summary>
        /// 获取管线和管井数据
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetLineHolesDate()
        {
            var result = new MessageModel<LineHoleDateModel>() { msg = "参数错误", response = null, success = true };
            var LineHoles = _ipipe_LineServices.GetLineHolesDate();
            if (LineHoles != null && LineHoles.holeDateMoldes.Count > 0 && LineHoles.lineDateMoldes.Count > 0)
            {
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有管道数据哦";
            

            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管段详细信息
        [HttpPost]
        public IActionResult GetLineInfoByID(IDParameter obj) {
            var result = new MessageModel<LineInfoMolde>() { msg = "参数错误", response = null, success = true };
            if (obj.id <= 0) 
                return new JsonResult(result);
            
            var LineHoles = _ipipe_LineServices.GetLineInfoByID(obj.id);
            if (LineHoles != null)
            {
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管井信息
        [HttpPost]
        public IActionResult GetHoleInfoByID(IDParameter obj) {
            var result = new MessageModel<HoleInfoMolde>() { msg = "参数错误",response = null, success = false };
            if (obj.id <= 0)
                return new JsonResult(result);

            var LineHoles = _ipipe_HoleServices.GetHoleInfoByID(obj.id);
            if (LineHoles != null)
            {
                result.success = true;
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        #endregion

        #region 查询管点和管段
        /// <summary>
        /// 查询管
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetQueryLineHolesDate(KWParameter obj)
        {
            var result = new MessageModel<List<QueryLineHoleMolde>>() { msg = "参数错误", response = null, success = false };
            if (string.IsNullOrWhiteSpace(obj.kw))
            {
                result.msg = "关键字为空！";
                return new JsonResult(result);
            } 
            var LineHoles = _ipipe_LineServices.GetQueryLineHolesDate(obj.kw);
            if (LineHoles.Count > 0)
            {
                result.msg = $"共发现{LineHoles.Count}条管道记录";
                result.response = LineHoles;
                result.success = true;
            }
            else {
                result.msg = $"没有找到合适的管道记录";
                result.response = LineHoles;
            }
            //现将管
            return new JsonResult(result);
        }
        #endregion

    }
}
