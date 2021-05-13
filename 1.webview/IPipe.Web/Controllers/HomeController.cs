using IPipe.Common.Helper;
using IPipe.Common.mdb;
using IPipe.IServices;
using IPipe.Model;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Web.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace IPipe.Web.Controllers
{
    public class HomeController : BaseController
    {
        readonly Ipipe_holeServices _ipipe_HoleServices;
        readonly Ipipe_lineServices _ipipe_LineServices;
        readonly Ihidden_dangerServices _ihidden_DangerServices;
        readonly IcctvServices _icctvServices;
        readonly Ipipe_hole_imgServices _ipipe_Hole_ImgServices;
        readonly Ipipe_line_imgServices _ipipe_Line_ImgServices;


        public HomeController(Ipipe_line_imgServices ipipe_Line_ImgServices, Ipipe_hole_imgServices ipipe_Hole_ImgServices, IcctvServices icctvServices, Ihidden_dangerServices ihidden_DangerServices, Ipipe_holeServices ipipe_HoleServices, Ipipe_lineServices ipipe_LineServices)
        {
            _ipipe_Hole_ImgServices = ipipe_Hole_ImgServices;
            _ipipe_Line_ImgServices = ipipe_Line_ImgServices;
            _icctvServices = icctvServices;
            _ihidden_DangerServices = ihidden_DangerServices;
            _ipipe_HoleServices = ipipe_HoleServices;
            _ipipe_LineServices = ipipe_LineServices;
        }
        /// <summary>
        /// 主界面加载主页
        /// </summary>
        /// <returns></returns>
        public IActionResult Index()
        {
            return RedirectToRoute(new { Controller = "Home", Action = "homeIndex" });
        }

        /// <summary>
        ///  新主页
        /// </summary>
        /// <returns></returns>
        public IActionResult HomeIndex()
        {
            ViewBag.areanme = GetAreName();
            return View();
        }
        public IActionResult Map()
        {
            ViewBag.areanme = GetAreName();
            return View();
        }

        public IActionResult CCTV() {
            ViewBag.areanme = GetAreName();
            return View();
        }


        public string GetAreName()
        {

            string areaname = "佛山市";
            switch (areid)
            {
                case 0:
                    areaname = "深圳市市民中心";
                    break;
                case 1:
                    areaname = "佛山市";
                    break;
                case 2:
                    areaname = "深圳市";
                    break;
                default:
                    break;
            }
            return areaname;
        }

        #region 隐患转成照片
        public void SetHYToImg()
        {
            var hyList = _ihidden_DangerServices.QuerySql($" SELECT * FROM hidden_danger where areid =0").Result;
            List<pipe_hole_img> holeList = new List<pipe_hole_img>();
            List<pipe_line_img> lineList = new List<pipe_line_img>();
            foreach (var item in hyList)
            {
                if (item.tableType.Equals("pipe_hole"))
                {
                    var hole = new pipe_hole_img()
                    {
                        areid = item.areid,
                        creatTime = item.hd_time,
                        holeID = item.objID,
                        imgName = item.hd_name,
                        regRemarks = item.content,
                        imgURL = item.GR_img
                    };
                    holeList.Add(hole);
                }
                else
                {
                    var line = new pipe_line_img()
                    {
                        areid = item.areid,
                        creatTime = item.hd_time,
                        lineID = item.objID,
                        imgName = item.hd_name,
                        regRemarks = item.content,
                        imgURL = item.GR_img
                    };
                    lineList.Add(line);
                }
            }
            _ipipe_Hole_ImgServices.Add(holeList);
            _ipipe_Line_ImgServices.Add(lineList);
        }
        #endregion

        #region 更新Cookies切换
        public IActionResult SetChangeSession(string area)
        {
            var result = new MessageModel<LineInfoMolde>() { msg = "参数错误", status = 204, response = null, success = true };
            if (string.IsNullOrWhiteSpace(area))
                return new JsonResult(result);
            HttpContext.Response.Cookies.Delete("area");

            HttpContext.Response.Cookies.Append("area", area, new CookieOptions//佛山数据
            {
                Expires = DateTime.Now.AddYears(120),
            });
            result.msg = "切换成功";
            result.status = 200;
            return new JsonResult(result);
        }
        #endregion

        #region 找最深的点
        public void SetHoleMaxDeep()
        {
            var holeList = _ipipe_HoleServices.QuerySql(" SELECT * FROM pipe_hole where areid= 0 ").Result;
            List<pipe_hole> pipe_Holes = new List<pipe_hole>();
            foreach (var item in holeList)
            {
                pipe_hole model = new pipe_hole()
                {
                    id = item.id,
                    maxdeep = item.maxdeep
                };
                pipe_Holes.Add(model);
            }
            var pipeList = _ipipe_LineServices.QuerySql(" SELECT * FROM pipe_line where areid= 0 ").Result;
            foreach (var item in pipeList)
            {
                //起点
                if (pipe_Holes.Any(t => t.id == item.S_holeID))
                {
                    var shole = pipe_Holes.Where(t => t.id == item.S_holeID).First();
                    if (item.S_Deep > shole.maxdeep)
                    {
                        pipe_Holes.Remove(shole);
                        pipe_hole newmodel = new pipe_hole()
                        {
                            id = shole.id,
                            maxdeep = item.S_Deep
                        };
                        pipe_Holes.Add(newmodel);
                    }
                }
                //终点
                if (pipe_Holes.Any(t => t.id == item.E_holeID))
                {
                    var ehole = pipe_Holes.Where(t => t.id == item.E_holeID).First();
                    if (item.E_Deep > ehole.maxdeep)
                    {
                        pipe_Holes.Remove(ehole);
                        pipe_hole newmodel = new pipe_hole()
                        {
                            id = ehole.id,
                            maxdeep = item.E_Deep
                        };
                        pipe_Holes.Add(newmodel);
                    }
                }
            }

            foreach (var item in pipe_Holes)
            {
                _ipipe_HoleServices.UpdateMaxDeep(item);
            }
        }
        #endregion

        #region 找ID
        public void FindID()
        {
            var holeList = _ipipe_HoleServices.QuerySql(" SELECT * FROM pipe_hole where areid=1 ").Result;
            var pipeList = _ipipe_LineServices.QuerySql(" SELECT * FROM pipe_line where areid=1 ").Result;
            foreach (var item in pipeList)
            {
                var s_point = holeList.Where(t => t.Exp_No == item.S_Point).First();
                var e_point = holeList.Where(t => t.Exp_No == item.E_Point).First();

                _ipipe_LineServices.UpdateHoleIDByID(s_point.id, e_point.id, item.id);
            }
        }
        #endregion

        #region 自定义隐患数据
        public void SetMarkYHData()
        {
            var holeList = _ipipe_HoleServices.QuerySql($" SELECT * FROM pipe_hole where areid =0 ").Result;
            var pipeList = _ipipe_LineServices.QuerySql($" SELECT * FROM pipe_line where areid =0 ").Result;

            List<pipe_hole> holezk = new List<pipe_hole>();
            holezk.Add(new pipe_hole() { Exp_No = "井盖破损", Belong = "井盖以及出现破损情况，应及时处理", Address = "https://image.imlzx.cn/ipipe/hole10.jpg" });
            holezk.Add(new pipe_hole() { Exp_No = "井盖丢失", Belong = "井盖以及出现破损情况，应及时处理", Address = "https://image.imlzx.cn/ipipe/hole12.jpg" });
            holezk.Add(new pipe_hole() { Exp_No = "井盖松动", Belong = "井盖以及出现破损情况，应及时处理", Address = "https://image.imlzx.cn/ipipe/hole11.jpg" });
            List<pipe_line> pipezk = new List<pipe_line>();
            pipezk.Add(new pipe_line() { EmBed = "发生破裂", Address = "管段发生破裂情况，并有泥土入管现象，破裂等级V", Belong = "https://image.imlzx.cn/ipipe/lda.png" });
            pipezk.Add(new pipe_line() { EmBed = "发生破裂", Address = "管段发生破裂情况，并有泥土入管现象，破裂等级Ⅱ", Belong = "https://image.imlzx.cn/ipipe/lda.png" });
            pipezk.Add(new pipe_line() { EmBed = "发生变形破裂", Address = "管段发生变形破裂情况，并有泥土入管现象，破裂等级Ⅱ", Belong = "https://image.imlzx.cn/ipipe/lda.png" });
            pipezk.Add(new pipe_line() { EmBed = "发生穿插", Address = "管段发生穿插破裂情况，并有泥土入管现象，破裂等级Ⅱ", Belong = "https://image.imlzx.cn/ipipe/lda.png" });
            pipezk.Add(new pipe_line() { EmBed = "发生脱节", Address = "发生脱节，并有泥土入管现象，破裂等级Ⅱ", Belong = "https://image.imlzx.cn/ipipe/lda.png" });
            Random r = new Random();
            List<hidden_danger> insertList = new List<hidden_danger>();
            foreach (var item in holeList)
            {
                if (item.id % 20 == 0)
                {
                    var yh = holezk[r.Next(0, 2)];
                    hidden_danger holeyh = new hidden_danger()
                    {
                        content = $"{item.Exp_No}{yh.Belong}",
                        hd_name = $"{item.Exp_No}{yh.Exp_No}",
                        hd_time = DateTime.Now.AddMonths(-r.Next(1, 22)),
                        GR_img = yh.Address,
                        handUnit = "凯方达",
                        handleState = r.Next(0, 2),
                        handleTime = DateTime.Now.AddMonths(-r.Next(1, 22)),
                        objID = item.id,
                        tableType = "pipe_hole",
                        CoorWgsX = item.CoorWgsX,
                        CoorWgsY = item.CoorWgsY,
                        areid = item.areid
                    };
                    insertList.Add(holeyh);
                }

            }

            foreach (var item in pipeList)
            {
                if (item.id % 20 == 0)
                {
                    if (!holeList.Any(t => t.id == item.S_holeID) || !holeList.Any(t => t.id == item.E_holeID))
                        continue;
                    var Shole = holeList.Where(t => t.id == item.S_holeID).First();
                    var Ehole = holeList.Where(t => t.id == item.E_holeID).First();
                    double[] sCoorWgs = new double[] { Shole.CoorWgsX, Shole.CoorWgsY };
                    double[] eCoorWgs = new double[] { Ehole.CoorWgsX, Ehole.CoorWgsY };
                    var yh = pipezk[r.Next(0, 2)];
                    hidden_danger Listyh = new hidden_danger()
                    {
                        content = $"{item.Lno}{yh.Address}",
                        hd_name = $"{item.Lno}{yh.EmBed}",
                        hd_time = DateTime.Now.AddMonths(-r.Next(1, 22)),
                        GR_img = yh.Belong,
                        handUnit = "凯方达",
                        handleState = r.Next(0, 2),
                        handleTime = DateTime.Now.AddMonths(-r.Next(1, 22)),
                        objID = item.id,
                        tableType = "pipe_line",
                        CoorWgsX = ((sCoorWgs[0] + eCoorWgs[0]) / 2).UtObjToMoney(),
                        CoorWgsY = ((sCoorWgs[1] + eCoorWgs[1]) / 2).UtObjToMoney(),
                        areid = item.areid
                    };

                    insertList.Add(Listyh);
                }
            }

            _ihidden_DangerServices.Add(insertList);
        }
        #endregion  

        #region 读取mdb文件
        public void ReadMdbforYS()
        {
            var gxdPoint = ReadMdbHelper.UseOleDbConnection(@"D:\梁泽祥工作文件夹\演示系统需求\市中心区管线.mdb", "select CG_WTBH,CG_MS,CG_LJDH from GXD where CG_GXZL in('YL','WL') ");
            var gxddata = DatatableHelper.ToDataList<GxdModel>(gxdPoint);
            var mdbdataPoint = ReadMdbHelper.UseOleDbConnection(@"D:\梁泽祥工作文件夹\演示系统需求\市中心区管线.mdb", "select * from Line where ZType = 'PS'");
            var linedata = DatatableHelper.ToDataList<LineSmCetenModel>(mdbdataPoint);
            var mdbdataline = ReadMdbHelper.UseOleDbConnection(@"D:\梁泽祥工作文件夹\演示系统需求\市中心区管线.mdb", "select * from Point where ZType = 'PS'");
            var holedata = DatatableHelper.ToDataList<HoleSmCetenModel>(mdbdataline);
            //List<pipe_hole> holesList = new List<pipe_hole>();
            //foreach (var item in holedata)
            //{
            //    var coor = CoordinateCalculation.shenzhenTOWGS84(new double[] { item.X, item.Y, item.High });
            //    pipe_hole model = new pipe_hole()
            //    {
            //        prj_No = "市民中心普查",
            //        prj_Name = "市民中心普查",
            //        Exp_No = item.DH,
            //        HType = item.Type.ToUpper(),
            //        ZType = "PS",
            //        szCoorX = item.X,
            //        szCoorY = item.Y,
            //        hight = item.High,
            //        CoorWgsX = coor[1],
            //        CoorWgsY = coor[0],
            //        rotation = 0,
            //        Code = "",
            //        Feature = item.Feature,
            //        Subsid = item.Subsid,
            //        FeaMateria = item.FeaMaterial,
            //        Spec = "",
            //        deep = 0,
            //        wellShape = "",
            //        wellMater = "",
            //        WellSize = "",
            //        WellPipes = 0,
            //        Address = "市民中心路段",
            //        Belong = item.Belong,
            //        MDate = item.MDate,
            //        MapCode = "",
            //        SUnit = item.DataSource,
            //        SDate = DateTime.Now,
            //        updateTime = DateTime.Now,
            //        Visibility = "",
            //        status = 1,
            //        pointPosit = 1,
            //        Operator = "",
            //        Note = item.Note==null?"" : item.Note,
            //        ljm = "",
            //        Angel = "",
            //        SymbolName = ""
            //    }
            //  ;

            //    holesList.Add(model);
            //}
            //if (holesList.Count > 0)
            //{
            //    var sum = _ipipe_HoleServices.Add(holesList).Result;
            //}
            List<pipe_line> lineList = new List<pipe_line>();
            var holeList = _ipipe_HoleServices.Query(t=>t.areid==0).Result;
            foreach (var item in linedata)
            {
                if (!holeList.Any(t => t.Exp_No == item.qdh) || !holeList.Any(t => t.Exp_No == item.zdh) || !gxddata.Any(t => t.CG_WTBH.Equals(item.zdh) && t.CG_LJDH.Equals(item.qdh)))
                    continue;
                var s_Point = new pipe_hole();
                var e_Point = new pipe_hole();
                double sdeep = 0;
                double edeep = 0;
                var zdhList = gxddata.Where(t => t.CG_WTBH.Equals(item.zdh) && t.CG_LJDH.Equals(item.qdh)).First();
                if (item.FlowDir.Equals("-"))
                {
                    s_Point = holeList.Where(t => t.Exp_No == item.zdh).First();
                    e_Point = holeList.Where(t => t.Exp_No == item.qdh).First();
                    edeep = item.S_Deep;
                    sdeep = zdhList.CG_MS;
                }
                else
                {
                    s_Point = holeList.Where(t => t.Exp_No == item.qdh).First();
                    e_Point = holeList.Where(t => t.Exp_No == item.zdh).First();
                    sdeep = item.S_Deep;
                    edeep= zdhList.CG_MS;
                }

                pipe_line model = new pipe_line()
                {
                    S_holeID = s_Point.id,
                    S_Point = s_Point.Exp_No,
                    S_Deep = sdeep,
                    E_holeID = e_Point.id,
                    E_Point = e_Point.Exp_No,
                    E_Deep = edeep,
                    line_Class = item.Type,
                    code = "",
                    Material = item.Material,
                    ServiceLif = 30,
                    PSize = item.PSize,
                    CabNum = 0,
                    TotalHole = 0,
                    UsedHole = 0,
                    FlowDir = "+",
                    Address = "市民中心路段",
                    Roadcode = "",
                    EmBed = item.EmBed,
                    MDate = item.MDate,
                    Belong = item.Belong,
                    SUnit = "",
                    SDate = DateTime.Now,
                    UpdateTime = DateTime.Now,
                    Lno = item.Gxbh,
                    LineType = 0,
                    PDS = 0,
                    status = 0,
                    PipeLength = item.PipeLength,
                    Operator = "",
                    Note = "",
                    startbotto = 0,
                    startcrow = 0,
                    endbotto = 0,
                    endcrow = 0,
                    Angel = 0,
                    SHAPE_Leng = 0,
                    parentIDs = "",
                    subclassIDs = "",
                    areatwo = "市民中心",
                    areid = 0
                };

                lineList.Add(model);
            }
            if (lineList.Count > 0)
            {
                var sum = _ipipe_LineServices.Add(lineList).Result;
            }

        }

        public void ReadMdbforWS()
        {
            var mdbdataPoint = ReadMdbHelper.UseOleDbConnection(@"C:\Users\msda002\Desktop\梁泽祥工作文件夹\演示系统需求\乐从总合并.mdb", "select * from WSPOINT");
            var holedata = DatatableHelper.ToDataList<HoleFSModel>(mdbdataPoint);
            var mdbdataline = ReadMdbHelper.UseOleDbConnection(@"C:\Users\msda002\Desktop\梁泽祥工作文件夹\演示系统需求\乐从总合并.mdb", "select * from WSLINE");
            var linedata = DatatableHelper.ToDataList<LineFsModel>(mdbdataline);
            List<pipe_hole> holesList = new List<pipe_hole>();
            foreach (var item in holedata)
            {
                var coor = CoordinateCalculation.fsTOWGS84(new double[] { item.X, item.Y, item.Surf_H });
                pipe_hole model = new pipe_hole()
                {
                    prj_No = item.Exp_No,
                    prj_Name = item.Map_No,
                    Exp_No = item.Exp_No.Trim(),
                    HType = "WS",
                    ZType = "PS",
                    szCoorX = item.X,
                    szCoorY = item.Y,
                    hight = item.Surf_H,
                    CoorWgsX = coor[1],
                    CoorWgsY = coor[0],
                    rotation = 0,
                    Code = item.Exp_NoOld,
                    Feature = item.Feature,
                    Subsid = item.Subsid,
                    FeaMateria = "",
                    Spec = "",
                    deep = item.B_DEEP,
                    wellShape = "",
                    wellMater = "",
                    WellSize = "",
                    WellPipes = 0,
                    Address = item.Road,
                    Belong = "",
                    MDate = DateTime.Now,
                    MapCode = item.Map_No,
                    SUnit = "",
                    SDate = DateTime.Now,
                    updateTime = DateTime.Now,
                    Visibility = "",
                    status = 1,
                    pointPosit = 1,
                    Operator = "",
                    Note = "",
                    ljm = "",
                    Angel = "",
                    SymbolName = ""
                }
              ;

                holesList.Add(model);
            }
            if (holesList.Count > 0)
            {
                var sum = _ipipe_HoleServices.Add(holesList).Result;
            }
            List<pipe_line> lineList = new List<pipe_line>();
            var holeList = _ipipe_HoleServices.Query().Result;
            foreach (var item in linedata)
            {
                if (!holeList.Any(t => t.Exp_No == item.E_Point) || !holeList.Any(t => t.Exp_No == item.S_Point))
                    continue;
                var s_Point = holeList.Where(t => t.Exp_No == item.S_Point).First();
                var e_Point = holeList.Where(t => t.Exp_No == item.E_Point).First();

                pipe_line model = new pipe_line()
                {
                    S_holeID = s_Point.id,
                    S_Point = s_Point.Exp_No,
                    S_Deep = item.S_Deep,
                    E_holeID = e_Point.id,
                    E_Point = e_Point.Exp_No,
                    E_Deep = item.E_Deep,
                    line_Class = "WS",
                    code = "",
                    Material = item.Material,
                    ServiceLif = 30,
                    PSize = item.D_S,
                    CabNum = 0,
                    TotalHole = 0,
                    UsedHole = 0,
                    FlowDir = item.FlowDirect == 0 ? "+" : "-",
                    Address = item.Road,
                    Roadcode = "",
                    EmBed = item.EmBed,
                    MDate = item.MDate,
                    Belong = item.B_Code,
                    SUnit = "",
                    SDate = DateTime.Now,
                    UpdateTime = DateTime.Now,
                    Lno = s_Point.Exp_No + e_Point.Exp_No,
                    LineType = 0,
                    PDS = 0,
                    status = 0,
                    PipeLength = 1,
                    Operator = "",
                    Note = "",
                    startbotto = 0,
                    startcrow = 0,
                    endbotto = 0,
                    endcrow = 0,
                    Angel = 0,
                    SHAPE_Leng = 0,
                    parentIDs = "",
                    subclassIDs = ""
                };

                lineList.Add(model);
            }
            if (lineList.Count > 0)
            {
                var sum = _ipipe_LineServices.Add(lineList).Result;
            }

        }

        public void ReadMdbforLine()
        {
            var data = ReadMdbHelper.UseOleDbConnection(@"C:\Users\msda002\Desktop\梁泽祥工作文件夹\演示系统需求\乐从总合并.mdb", "select * from WSPOINT");

        }
        #endregion

        #region CCTV管线等级
        public IActionResult GetCCTVGrade()
        {
            var cctvsList = _icctvServices.QuerySql($" SELECT lineID,grade,lno FROM cctv where areid= {areid} ").Result;
            return new JsonResult(cctvsList);
        }

        private List<cctv> GetCctvIDsModels()
        {
            List<cctv> cctvIDList = new List<cctv>() {
                new cctv { cctvID = 95, grade = 1, LineID = 949,lno ="WS187WS200", cctvJsonStr="{\"msg\":{\"id\":95,\"no\":1,\"video\":\"深圳市_BWB83~BWB85_181115112206\",\"smanhole\":\"BWB83\",\"fmanhole\":\"BWB85\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.63\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"逆流\",\"pipelength\":\"26.38\",\"testlength\":\"24.91\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB83~BWB85\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":169,\"no\":1,\"dist\":\"0\",\"code\":\"\",\"grade\":\"0\",\"location\":\"\",\"picture\":\"照片1\",\"remarks\":\"无异常\",\"path\":\"D02F7498-F762-43C4-A2B3-A7D8516EF00E\",\"pipe\":{\"id\":95,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv {cctvID = 96,grade = 2, LineID = 950 ,lno ="WS200WS205",cctvJsonStr="{\"msg\":{\"id\":96,\"no\":6,\"video\":\"深圳市_BYB19~EWB1428_181115103221\",\"smanhole\":\"BYB19\",\"fmanhole\":\"EWB1428\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.55\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"39.52\",\"testlength\":\"25.15\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB19~EWB1428\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":170,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"408\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"5540D4F4-186C-455B-A77C-30652875A7C0\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":171,\"no\":2,\"dist\":\"2.2\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"7B6952C0-17E2-4A91-8478-CC9469543BC8\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":172,\"no\":3,\"dist\":\"4.1\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"F7A432C9-B003-4372-A38E-00F3640055E2\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":173,\"no\":4,\"dist\":\"6.5\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片4\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"E20A7EA0-563F-40E1-BC45-16F5D0C06327\",\"pipe\":{\"id\":96,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,1.7875,0.0,2.0,0.09046052631578948,0.0,0.0,0.0,0.0,0.0,6.5,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.4,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 97, grade = 3,LineID = 951,lno ="WS219WS228",cctvJsonStr="{\"msg\":{\"id\":97,\"no\":10,\"video\":\"深圳市_BYB52~BYB47_181120150057\",\"smanhole\":\"BYB52\",\"fmanhole\":\"BYB47\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.65\",\"fdepth\":\"3.78\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"29.7\",\"testlength\":\"22.25\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB52~BYB47\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":174,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"0743A07D-2FB2-46D5-864E-C46CBAA39390\",\"pipe\":{\"id\":97,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":175,\"no\":2,\"dist\":\"12.47\",\"code\":\"CJ\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片2\",\"remarks\":\"沉积物厚度在管径的40%~50% 。\",\"path\":\"469DF6D0-D5DE-4A14-873E-1C32148AE85E\",\"pipe\":{\"id\":97,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,5.5,0.0,5.5,0.03367003367003367,5.0,0.0,0.0,5.0,0.0,5.0,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅲ\":\"管道过流受阻比较严重，运行受到明显影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅲ\":\"根据基础数据进行全面的考虑，应尽快处理\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.85,\"mi\":5.5},\"code\":\"200\"}"},
                new cctv {cctvID = 98,grade = 1, LineID = 952 ,lno ="WS228WS222",cctvJsonStr="{\"msg\":{\"id\":98,\"no\":16,\"video\":\"深圳市_EWB1425~XH15-3_181120164918\",\"smanhole\":\"BWB1425\",\"fmanhole\":\"HX15-3\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.33\",\"fdepth\":\"3.56\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"顺流\",\"pipelength\":\"27.59\",\"testlength\":\"21.88\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1425~HX15-3\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":176,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"469DF6D0-D5DE-4A14-873E-1C32148AE85E\",\"pipe\":{\"id\":98,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.5,0.0,0.0,0.5,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.4},\"code\":\"200\"}"},
                new cctv { cctvID = 99,grade = 3, LineID = 953,lno ="WS222WS232",cctvJsonStr="{\"msg\":{\"id\":99,\"no\":11,\"video\":\"深圳市_BYB52~BYB55_181120151216、深圳市_BYB55~BYB52_181120152143\",\"smanhole\":\"BYB52\",\"fmanhole\":\"BYB55\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.74\",\"fdepth\":\"3.77\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"21.6\",\"testlength\":\"9.37\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB52~BYB55\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":177,\"no\":1,\"dist\":\"9.31\",\"code\":\"ZW\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片1,正向\",\"remarks\":\"过水断面损失在25%~50%之间。\",\"path\":\"06123C45-ABB8-4C51-AD99-A5064D17718D\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":178,\"no\":2,\"dist\":\"9.31\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片2,正向\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"F7A09063-B6D2-42CA-8583-3745BEA5284B\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":179,\"no\":3,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片3,正向\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"96F9BD18-7947-4E96-A67B-05ED8CB7FD59\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":180,\"no\":4,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片4,反向\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"D1E35B8B-55E3-423E-8D6C-89E59FE023DE\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":181,\"no\":5,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片5,反向\",\"remarks\":\"沉积物厚度在管径的30%~40%之间。\",\"path\":\"A119A66D-6E6F-493B-BCD7-BC452390CC9C\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":182,\"no\":6,\"dist\":\"6.83\",\"code\":\"ZW\",\"grade\":\"3\",\"location\":\"507\",\"picture\":\"照片6,反向\",\"remarks\":\"过水断面损失在25%~50%之间。\",\"path\":\"041B64C4-06BC-4246-89B8-7EAF21123C47\",\"pipe\":{\"id\":99,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,5.5,0.0,5.5,0.09259259259259259,5.0,0.0,0.0,5.0,0.0,10.0,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅲ\":\"管道过流受阻比较严重，运行受到明显影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅲ\":\"根据基础数据进行全面的考虑，应尽快处理\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.85,\"mi\":5.5},\"code\":\"200\"}"},
                new cctv { cctvID = 100,grade = 2, LineID = 954,lno ="WS232WS239",cctvJsonStr="{\"msg\":{\"id\":100,\"no\":3,\"video\":\"深圳市_BYB18~BYB8_181115095857\",\"smanhole\":\"BYB18\",\"fmanhole\":\"BYB8\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.63\",\"fdepth\":\"2.51\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"47.39\",\"testlength\":\"45.73\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB18~BYB8\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":183,\"no\":1,\"dist\":\"0.66\",\"code\":\"PL\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"裂痕-当下列一个或多个情况存在时：1）在管壁上可见细裂痕；2）在管壁上由细裂缝处冒出少量沉积物；3）轻度剥落。\",\"path\":\"7CCE110A-6F79-4AF7-BE64-D1680861F9C1\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":184,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"4D90DB20-B29B-4339-91EA-360494AC199E\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":185,\"no\":3,\"dist\":\"4.68\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"405\",\"picture\":\"照片3\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"F91D3343-C45C-4A3A-AE20-3797C11B2D08\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":186,\"no\":4,\"dist\":\"6.54\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"405\",\"picture\":\"照片4\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"0C393A3D-9FDE-47AC-B07D-F7C0D8CF344B.png\",\"pipe\":{\"id\":100,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,1.375,0.0,2.0,0.058029120067524795,0.0,0.0,0.0,0.0,0.0,5.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.4,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv {cctvID = 101,grade = 3, LineID = 955 ,lno ="WS125WS124",cctvJsonStr="{\"msg\":{\"id\":101,\"no\":12,\"video\":\"深圳市_BYB55~BYB58_181120152956\",\"smanhole\":\"BYB55\",\"fmanhole\":\"BYB58\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.86\",\"fdepth\":\"3.63\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"25.63\",\"testlength\":\"24.24\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB55~BYB58\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":187,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度在管径的30%~40%之间。\",\"path\":\"5A180284-6DCA-42AC-909D-6AD481453926\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":188,\"no\":2,\"dist\":\"14.6\",\"code\":\"PL\",\"grade\":\"1\",\"location\":\"1100\",\"picture\":\"照片2\",\"remarks\":\"裂痕-当下列一个或多个情况存在时：1）在管壁上可见细裂痕；2）在管壁上由细裂缝处冒出少量沉积物；3）轻度剥落。\",\"path\":\"424D5FAC-135B-49F9-B456-ECBA0E6F18F8\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":189,\"no\":3,\"dist\":\"19.8\",\"code\":\"BX\",\"grade\":\"2\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"变形为管道直径的5%~15% 。\",\"path\":\"85F4ECE2-5BE2-465E-BA92-D570BF45AFF0\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":190,\"no\":4,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"3\",\"location\":\"804\",\"picture\":\"照片4\",\"remarks\":\"重度腐蚀—粗骨料或钢筋完全显露。\",\"path\":\"1546EDDD-4A6B-4E2A-9985-D935D324161E\",\"pipe\":{\"id\":101,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[5.0,2.75,0.0,5.0,0.06437768240343347,2.0,0.0,0.0,2.0,0.0,7.5,0.0],\"sEvaluate\":{\"Ⅲ\":\"管段缺陷严重，结构状况受到影响\"},\"yEvaluate\":{\"Ⅱ\":\"管道过流有一定的受阻，运行受影响不大\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅲ\":\"结构在短期内可能发生破坏，应尽快修复\"},\"mIEvaluate\":{\"Ⅱ\":\"没有立即进行处理的必要，但宜安排处理计划\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":4.5,\"mi\":3.1},\"code\":\"200\"}"},
                new cctv {cctvID = 102,grade = 1, LineID = 956 ,lno ="WS154WS152",cctvJsonStr="{\"msg\":{\"id\":102,\"no\":2,\"video\":\"深圳市_BYB9~BYB9-1_181115121434\",\"smanhole\":\"BYB9\",\"fmanhole\":\"BYB9-1\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.57\",\"fdepth\":\"3.51\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"逆流\",\"pipelength\":\"29.61\",\"testlength\":\"28.27\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB9~BYB9-1\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":191,\"no\":1,\"dist\":\"3.56\",\"code\":\"TL\",\"grade\":\"1\",\"location\":\"1100\",\"picture\":\"照片1\",\"remarks\":\"接口材料在管道内水平方向中心线上部可见。\",\"path\":\"F3B33036-F250-4A9F-8481-597251B4F1E5\",\"pipe\":{\"id\":102,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,1.1,0.0,1.1,0.03377237419790611,0.0,0.0,0.0,0.0,0.0,1.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.77,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 103,grade = 1, LineID = 957,lno ="WS239WS244",cctvJsonStr="{\"msg\":{\"id\":103,\"no\":14,\"video\":\"深圳市_EWB1424~BYB5_181120160505\",\"smanhole\":\"BWB1424\",\"fmanhole\":\"BYB5\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.59\",\"fdepth\":\"2.62\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"逆流\",\"pipelength\":\"51.12\",\"testlength\":\"49.06\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1424~BYB5\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":192,\"no\":1,\"dist\":\"22.92\",\"code\":\"TL\",\"grade\":\"1\",\"location\":\"203\",\"picture\":\"照片1\",\"remarks\":\"接口材料在管道内水平方向中心线上部可见。\",\"path\":\"BFF05CD8-FE73-40F7-B245-4B441922AD21\",\"pipe\":{\"id\":103,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,1.1,0.0,1.1,0.019561815336463225,0.0,0.0,0.0,0.0,0.0,1.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.77,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 104,grade = 1, LineID = 958,lno ="WS244WS243",cctvJsonStr="{\"msg\":{\"id\":104,\"no\":15,\"video\":\"深圳市_EWB1424~EWB1425_181120163324\",\"smanhole\":\"BWB1424\",\"fmanhole\":\"BWB1425\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.52\",\"fdepth\":\"3.41\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"800\",\"direction\":\"顺流\",\"pipelength\":\"40.51\",\"testlength\":\"38.74\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BWB1424~BWB1425\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":193,\"no\":1,\"dist\":\"0\",\"code\":\"\",\"grade\":\"0\",\"location\":\"\",\"picture\":\"照片1\",\"remarks\":\"\",\"path\":\"16BAD4B7-891D-4A06-B2BE-C2636EC26845\",\"pipe\":{\"id\":104,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 105,grade = 1, LineID = 959,lno ="WS242WS241",cctvJsonStr="{\"msg\":{\"id\":105,\"no\":5,\"video\":\"深圳市_BYB18~BYB19_181115102407\",\"smanhole\":\"BYB18\",\"fmanhole\":\"BYB19\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.41\",\"fdepth\":\"2.63\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"29.95\",\"testlength\":\"25.22\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB18~BYB19\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":194,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"1001\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"5540D4F4-186C-455B-A77C-30652875A7C0\",\"pipe\":{\"id\":105,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.033388981636060105,0.0,0.0,0.0,0.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 106,grade = 1, LineID = 960,lno ="WS220WS221",cctvJsonStr="{\"msg\":{\"id\":106,\"no\":4,\"video\":\"深圳市_BYB8~BYB5_181115100922\",\"smanhole\":\"BYB8\",\"fmanhole\":\"BYB5\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.51\",\"fdepth\":\"2.77\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"顺流\",\"pipelength\":\"30.97\",\"testlength\":\"30.07\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BYB8~BYB5\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":195,\"no\":1,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片1\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"945FE506-06DD-42E5-8C51-C77C6DF1F572\",\"pipe\":{\"id\":106,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.03228931223764934,0.0,0.0,0.0,0.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.0},\"code\":\"200\"}"},
                new cctv { cctvID = 107,grade = 1, LineID =  961,lno ="WS221WS227",cctvJsonStr="{\"msg\":{\"id\":107,\"no\":13,\"video\":\"深圳市_BYB58~BYB62_181120154047\",\"smanhole\":\"BYB58\",\"fmanhole\":\"BYB62\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"3.82\",\"fdepth\":\"3.71\",\"pipetype\":\"雨水\",\"material\":\"砼\",\"diameter\":\"600\",\"direction\":\"逆流\",\"pipelength\":\"22.22\",\"testlength\":\"21.08\",\"site\":\"扬马小区\",\"date\":\"2018-11-20\",\"remarks\":\"检测管段编号：BYB58~BYB62\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":196,\"no\":1,\"dist\":\"0.01\",\"code\":\"CJ\",\"grade\":\"1\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"沉积物厚度为管径的20%~30% 。\",\"path\":\"5A180284-6DCA-42AC-909D-6AD481453926\",\"pipe\":{\"id\":107,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":197,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"0B494B86-0C99-4234-AF26-7889B60CCCD0\",\"pipe\":{\"id\":107,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.04500450045004501,0.5,0.0,0.0,0.5,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":0.4},\"code\":\"200\"}"},
                new cctv { cctvID = 108,grade = 2, LineID = 962,lno ="WS224WS226",cctvJsonStr="{\"msg\":{\"id\":108,\"no\":9,\"video\":\"深圳市_BWB82~BWB83_181115111526\",\"smanhole\":\"BWB82\",\"fmanhole\":\"BWB83\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.55\",\"fdepth\":\"2.71\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"逆流\",\"pipelength\":\"22.87\",\"testlength\":\"24.95\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB82~BWB83\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":198,\"no\":1,\"dist\":\"0.94\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"607\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"EBB8B2A0-0C51-48CB-9FE5-98FB5A9F7922\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":199,\"no\":2,\"dist\":\"2.75\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"205\",\"picture\":\"照片2\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"E4CE3445-7999-4848-872A-3FD98D511D2E\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":200,\"no\":3,\"dist\":\"6.64\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"610\",\"picture\":\"照片3\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"252733AB-C5D9-4761-A806-991E84EA0487\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":201,\"no\":4,\"dist\":\"11.71\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"203\",\"picture\":\"照片4\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"C543FBC6-0E69-4832-BA12-F33739500BD7\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":202,\"no\":5,\"dist\":\"6.64\",\"code\":\"CK\",\"grade\":\"2\",\"location\":\"1001\",\"picture\":\"照片5\",\"remarks\":\"中度错口—相接的两个管口偏差为管壁厚度的1/2~1之间。\",\"path\":\"3C137682-F9E5-4F12-BA75-7EF75C249189\",\"pipe\":{\"id\":108,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[2.0,2.2,0.0,2.2,0.04372540445999125,0.5,0.0,0.0,0.5,0.0,2.0,0.0],\"sEvaluate\":{\"Ⅱ\":\"管道缺陷明显超过一级，具有变坏的趋势\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅱ\":\"结构在短期内不会发生破坏现象，但应做修复计划\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":1.54,\"mi\":0.4},\"code\":\"200\"}"},
                new cctv { cctvID = 109,grade = 1, LineID = 963,lno ="WS226WS225",cctvJsonStr="{\"msg\":{\"id\":109,\"no\":7,\"video\":\"深圳市_BWB82~BWB81_181115105333\",\"smanhole\":\"BWB82\",\"fmanhole\":\"BWB81\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.63\",\"fdepth\":\"2.68\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"顺流\",\"pipelength\":\"44.67\",\"testlength\":\"43.2\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB82~BWB81\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":203,\"no\":1,\"dist\":\"1.95\",\"code\":\"SG\",\"grade\":\"1\",\"location\":\"408\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失不大于15% 。\",\"path\":\"E7C3F9C6-4669-400D-8653-5CEA653501C0\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":204,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"0B494B86-0C99-4234-AF26-7889B60CCCD0\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":205,\"no\":3,\"dist\":\"0.01\",\"code\":\"BX\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片3\",\"remarks\":\"变形不大于管道直径的5%。\",\"path\":\"07E2F830-5C51-4629-8B2F-BFDD29B5E163\",\"pipe\":{\"id\":109,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[1.0,0.8250000000000001,0.0,1.0,0.036937541974479515,0.5,0.0,0.0,0.5,0.0,1.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅰ\":\"无或有轻微影响，管道运行基本不受影响\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅰ\":\"没有明显需要处理的缺陷\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.7,\"mi\":0.4},\"code\":\"200\"}"},
                new cctv { cctvID = 110,grade = 1, LineID = 964,lno ="WS225WS230",cctvJsonStr="{\"msg\":{\"id\":110,\"no\":8,\"video\":\"深圳市_BWB81~BWB79_181115110258\",\"smanhole\":\"BWB81\",\"fmanhole\":\"BWB79\",\"method\":\"CCTV\",\"laidyear\":\"2010\",\"sdepth\":\"2.68\",\"fdepth\":\"2.89\",\"pipetype\":\"污水\",\"material\":\"砼\",\"diameter\":\"400\",\"direction\":\"顺流\",\"pipelength\":\"42.48\",\"testlength\":\"41.82\",\"site\":\"发达路\",\"date\":\"2018-11-15\",\"remarks\":\"检测管段编号：BWB81~BWB79\",\"project\":{\"id\":19,\"no\":null,\"name\":null,\"site\":null,\"client\":null,\"person\":null,\"writer\":null,\"checker\":null,\"approver\":null,\"infoA\":0,\"infoB\":0,\"infoC\":0,\"date\":null,\"user\":null,\"company\":null,\"localSrc\":null},\"items\":[{\"id\":206,\"no\":1,\"dist\":\"4.28\",\"code\":\"ZW\",\"grade\":\"2\",\"location\":\"507\",\"picture\":\"照片1\",\"remarks\":\"过水断面损失在15%~25%之间。\",\"path\":\"EBB8B2A0-0C51-48CB-9FE5-98FB5A9F7922\",\"pipe\":{\"id\":110,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false},{\"id\":207,\"no\":2,\"dist\":\"0.01\",\"code\":\"FS\",\"grade\":\"1\",\"location\":\"804\",\"picture\":\"照片2\",\"remarks\":\"轻度腐蚀—表面轻微剥落，管壁出现凹凸面。\",\"path\":\"0B494B86-0C99-4234-AF26-7889B60CCCD0\",\"pipe\":{\"id\":110,\"no\":0,\"video\":null,\"smanhole\":null,\"fmanhole\":null,\"method\":null,\"laidyear\":null,\"sdepth\":null,\"fdepth\":null,\"pipetype\":null,\"material\":null,\"diameter\":null,\"direction\":null,\"pipelength\":null,\"testlength\":null,\"site\":null,\"date\":null,\"remarks\":null,\"project\":null,\"items\":null,\"value\":null,\"sEvaluate\":null,\"yEvaluate\":null,\"sMEvaluate\":null,\"yMEvaluate\":null,\"rIEvaluate\":null,\"mIEvaluate\":null,\"pipeGeom\":null,\"reverse\":false,\"ri\":0.0,\"mi\":0.0},\"score\":null,\"reverse\":false}],\"value\":[0.5,0.55,0.0,0.55,0.02354048964218456,2.0,0.0,0.0,2.0,0.0,0.5,0.0],\"sEvaluate\":{\"Ⅰ\":\"无或有轻微缺陷，结构状况基本不受影响，但具有潜在变坏的可能\"},\"yEvaluate\":{\"Ⅱ\":\"管道过流有一定的受阻，运行受影响不大\"},\"sMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"yMEvaluate\":{\"Ⅰ\":\"局部缺陷\"},\"rIEvaluate\":{\"Ⅰ\":\"结构条件基本完好，不修复\"},\"mIEvaluate\":{\"Ⅱ\":\"没有立即进行处理的必要，但宜安排处理计划\"},\"pipeGeom\":null,\"reverse\":false,\"ri\":0.385,\"mi\":1.6},\"code\":\"200\"}"}
            };
            var pipe_Lines = _ipipe_LineServices.QuerySql($" SELECT id,Lno FROM pipe_line where areid= 0 ").Result;
            int index = 0;
            List<cctv> mdes = new List<cctv>();
            foreach (var item in pipe_Lines)
            {

                if (index >= cctvIDList.Count)
                {
                    index = 0;
                }
                cctv cctvIDsModel = new cctv()
                {
                    LineID = item.id,
                    cctvID = cctvIDList[index].cctvID,
                    cctvJsonStr = cctvIDList[index].cctvJsonStr,
                    grade = cctvIDList[index].grade,
                    lno = item.Lno,
                    areid = areid
                };
                mdes.Add(cctvIDsModel);
                index++;
            }
            _icctvServices.Add(mdes);
            return mdes;
        }
        #endregion

        #region 导入excel
        /// <summary>
        /// 先导入井
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ImportHoleExcel()
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

                List<pipe_hole> holesList = new List<pipe_hole>();
                foreach (var file in files)
                {

                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        var szX = dt.Rows[i][6].ToString().Trim().UtObjToMoney();
                        var szY = dt.Rows[i][7].ToString().Trim().UtObjToMoney();
                        var szH = dt.Rows[i][8].ToString().Trim().UtObjToMoney();
                        var coors = CoordinateCalculation.shenzhenTOWGS84(new double[] { szX, szY, szH });

                        pipe_hole model = new pipe_hole()
                        {
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
                            deep = dt.Rows[i][19].ToString().UtObjToMoney(),
                            wellShape = dt.Rows[i][20].ToString(),
                            wellMater = dt.Rows[i][21].ToString(),
                            WellSize = dt.Rows[i][22].ToString(),
                            WellPipes = dt.Rows[i][23].ToString().UtObjToMoney(),
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
                if (holesList.Count > 0)
                {
                    var sum = _ipipe_HoleServices.Add(holesList).Result;
                    result.response = true;
                    result.msg = $"已导入井点记录{sum}条";
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
                if (holeList.Count <= 0)
                {
                    result.msg = "请先上传井点坐标！";
                    return new JsonResult(result);
                }
                List<pipe_line> lineList = new List<pipe_line>();
                foreach (var file in files)
                {
                    DataTable dt = OfficeHelper.ReadStreamToDataTable(file.OpenReadStream());
                    for (int i = 1; i < dt.Rows.Count; i++)//从第二行开始读取数据
                    {
                        if (!holeList.Any(t => t.Exp_No == dt.Rows[i][3].ToString()) || !holeList.Any(t => t.Exp_No == dt.Rows[i][5].ToString()))
                            continue;
                        var s_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][3].ToString()).First();
                        var e_Point = holeList.Where(t => t.Exp_No == dt.Rows[i][5].ToString()).First();
                        var pSize = dt.Rows[i][14].ToString();

                        double S_Deep = 0;
                        double E_Deep = 0;
                        double startbotto = 0;
                        double startcrow = 0;
                        double endbotto = 0;
                        double endcrow = 0;
                        if ("-".Equals(dt.Rows[i][20].ToString().Trim()))
                        {
                            s_Point = e_Point;
                            e_Point = s_Point;
                            S_Deep = dt.Rows[i][6].ToString().UtObjToMoney();
                            E_Deep = dt.Rows[i][4].ToString().UtObjToMoney();
                            startbotto = dt.Rows[i][46].ToString().UtObjToMoney();
                            startcrow = dt.Rows[i][47].ToString().UtObjToMoney();
                            endbotto = dt.Rows[i][44].ToString().UtObjToMoney();
                            endcrow = dt.Rows[i][45].ToString().UtObjToMoney();
                        }

                        pipe_line model = new pipe_line()
                        {
                            S_holeID = s_Point.id,
                            S_Point = s_Point.Exp_No,
                            S_Deep = S_Deep,
                            E_holeID = e_Point.id,
                            E_Point = e_Point.Exp_No,
                            E_Deep = E_Deep,
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
                            PipeLength = dt.Rows[i][33].ToString().UtObjToMoney(),
                            Operator = dt.Rows[i][34].ToString(),
                            Note = dt.Rows[i][36].ToString(),
                            startbotto = startbotto,
                            startcrow = startcrow,
                            endbotto = endbotto,
                            endcrow = endcrow,
                            Angel = dt.Rows[i][49].ToString().UtObjToMoney(),
                            SHAPE_Leng = dt.Rows[i][50].ToString().UtObjToMoney(),
                            parentIDs = "",
                            subclassIDs = ""

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

        #region 管段大范围\隐患请求
        [HttpPost]
        public IActionResult GetLineHolesDateForBd()
        {
            var result = new MessageModel<LineHoleDateModel>() { msg = "参数错误", response = null, success = true };
            var LineHoles = _ipipe_LineServices.GetLineHolesDate(areid, 0);
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
            var LineHoles = _ipipe_LineServices.GetLineHolesDate(areid);
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
        /// 获取隐患
        /// </summary>
        /// <returns></returns>
        public IActionResult GetYhData()
        {
            var result = new MessageModel<List<YhDataMolde>>() { msg = "参数错误", response = null, success = true };
            var yhList = _ihidden_DangerServices.GetYhData(areid);
            if (yhList != null && yhList.Count() > 0)
            {
                result.response = yhList;
                result.msg = "获取隐患数据成功！";
            }
            else
                result.msg = "目前还没有隐患数据哦";


            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管段详细信息
        [HttpPost]
        public IActionResult GetLineInfoByID(IDParameter obj)
        {
            var result = new MessageModel<LineInfoMolde>() { msg = "参数错误", response = null, success = true };
            if (obj.id <= 0)
                return new JsonResult(result);

            var LineHoles = _ipipe_LineServices.GetLineInfoByID(obj.id);
            if (LineHoles != null)
            {
                var cctvsList = _icctvServices.QuerySql($" SELECT lineID FROM cctv where areid= {areid} and lineID = {LineHoles.model.id}  ").Result;
                if (cctvsList.Any(t => t.LineID == LineHoles.model.id))
                {
                    LineHoles.cctvID = cctvsList.Where(t => t.LineID == LineHoles.model.id).Select(t => t.LineID).First().Value;
                }
                result.response = LineHoles;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        /// <summary>
        /// 获取CCTV资料
        /// </summary>
        /// <returns></returns>
        public IActionResult GetCCTVInfoByID(int pipeid)
        {
            var result = new MessageModel<string>() { msg = "参数错误", response = null, success = true };
            if (pipeid == 0)
                return new JsonResult(result);
            var cctvsList = _icctvServices.QuerySql($" SELECT lineID,cctvJsonStr FROM cctv where areid= {areid} and LineID= {pipeid} ").Result;
            if (cctvsList.Any(t => t.LineID == pipeid))
            {
                result.msg = "获取CCTV资料成功！";
                result.response = cctvsList.Where(t => t.LineID == pipeid).Select(t => t.cctvJsonStr).First();
            }
            return new JsonResult(result);
        }
        #endregion

        #region 查询单个管井信息
        [HttpPost]
        public IActionResult GetHoleInfoByID(IDParameter obj)
        {
            var result = new MessageModel<HoleInfoMolde>() { msg = "参数错误", response = null, success = false };
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

        #region 查询管点和管端
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
            else
            {
                result.msg = $"没有找到合适的管道记录";
                result.response = LineHoles;
            }
            //现将管
            return new JsonResult(result);
        }
        #endregion

        #region 统计与报表
        public IActionResult GetStatisticalAllDataData(string areacode)
        {
            var result = new MessageModel<StatisticalAllDataDataModel>() { msg = "参数错误", status = 404, response = null, success = true };
            int areidman = 1;
            if (string.IsNullOrWhiteSpace(areacode))
            {
                areidman = 1;
            }
            else
            {
                if (areacode.Equals("gd_sz_gm"))
                    areidman = 2;
                else if (areacode.Equals("gd_fs"))
                    areidman = 1;
                else if (areacode.Equals("gd_sz_sm"))
                    areidman = 0;

            }
            var statisticalDataModel = _ipipe_LineServices.GetStatisticalAllDataData(areidman);
            if (statisticalDataModel != null)
            {
                result.status = 200;
                result.response = statisticalDataModel;
                result.msg = "获取数据成功";
            }
            return new JsonResult(result);
        }
        #endregion

        #region 查询管线lineList
        [HttpPost]
        public IActionResult GetLineCCTVdata(IDParameter obj)
        {
            var result = new MessageModel<LineCCTVInfoMolde>() { msg = "参数错误", response = null, success = false };
            if (obj.id <= 0)
                return new JsonResult(result);

            var cctvLine = _ipipe_HoleServices.GetLineCCTVdata(obj.id,areid);
            if (cctvLine != null)
            {
                result.success = true;
                result.response = cctvLine;
                result.msg = "获取管道数据成功！";
            }
            else
                result.msg = "目前还没有该管道数据哦";
            return new JsonResult(result);
        }
        [HttpPost]
        public IActionResult GetPipeLineList(KWParameter obj) {
            var result = new MessageModel<List<QueryLineListMolde>>() { msg = "参数错误", response = null, success = false };
            if (string.IsNullOrWhiteSpace(obj.kw))
            {
                result.msg = "关键字为空！";
                return new JsonResult(result);
            }
            var LineList = _ipipe_LineServices.GetQueryPipeLineList(obj.kw,areid);
            result.response = LineList;
            if (LineList != null && LineList.Count > 0) {
                result.msg = $"共发现{LineList.Count}条管道记录";
                result.success = true;
            }else
                result.msg = $"没有找到合适的管道记录";
            
            //现将管
            return new JsonResult(result);
        }
        #endregion
    }
}
