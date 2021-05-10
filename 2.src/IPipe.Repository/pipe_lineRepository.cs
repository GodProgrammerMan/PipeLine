
using IPipe.Common.Helper;
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using SqlSugar;
using System.Collections.Generic;
using System.Linq;

namespace IPipe.Repository
{
	/// <summary>
	/// pipe_lineRepository
	/// </summary>
    public class pipe_lineRepository : BaseRepository<pipe_line>, Ipipe_lineRepository
    {
        public pipe_lineRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public LineHoleDateModel GetLineHolesDate(int areid,int type)
        {
            bool isBd = type != 1;
            LineHoleDateModel lineHoleDateModel = new LineHoleDateModel();
            var WSholeDate = Db.Queryable<pipe_hole>()
                .WhereIF(areid==2,t=> t.CoorWgsY > 22.7248853944 && t.CoorWgsY < 22.7666380348 && t.CoorWgsX > 113.9145808386 && t.CoorWgsX < 113.9606547741)
                .WhereIF(areid == 0, t => t.CoorWgsY > 22.5355792246 && t.CoorWgsY < 22.5455121833 && t.CoorWgsX > 114.0426322427 && t.CoorWgsX < 114.0592555776)
                .Where(t=>t.HType.Equals("WS")&& t.areid == areid)
                .Select(t => new HoleDateMolde() { hight = t.hight,szCoorX = t.szCoorX, szCoorY = t.szCoorY, hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep , subsid = t.Subsid, Feature = t.Feature,maxdeep = t.maxdeep })
                .ToList();

            var YSholeDate = Db.Queryable<pipe_hole>()
                .WhereIF(areid == 2, t => t.CoorWgsY > 22.7248853944 && t.CoorWgsY < 22.7666380348 && t.CoorWgsX > 113.9145808386 && t.CoorWgsX < 113.9606547741)
                .WhereIF(areid == 0, t => t.CoorWgsY > 22.5355792246 && t.CoorWgsY < 22.5455121833 && t.CoorWgsX > 114.0426322427 && t.CoorWgsX < 114.0592555776)
                .Where(t => t.HType.Equals("YS") && t.areid == areid)
                .Select(t => new HoleDateMolde() { hight = t.hight, szCoorX = t.szCoorX , szCoorY = t.szCoorY,hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep, subsid = t.Subsid, Feature = t.Feature , maxdeep = t.maxdeep })
                .ToList();
            WSholeDate.AddRange(YSholeDate);
            lineHoleDateModel.holeDateMoldes = WSholeDate;
            var LineDate = Db.Queryable<pipe_line>()
                           .Select(t => new LineDateMolde() { Lno =  t.Lno,pSize = t.PSize ,line_Class =  t.line_Class, LineID = t.id,  sholeID = t.S_holeID,  eholeID = t.E_holeID,eDeep = t.E_Deep,sDeep = t.S_Deep })
                           .ToList();
            List<HoleDateMolde> reholeDateMoldes = new List<HoleDateMolde>();
            List<LineDateMolde> relineDateMoldes = new List<LineDateMolde>();
            foreach (var item in LineDate)
            {
                if (!WSholeDate.Any(t => t.holeID == item.sholeID) || !WSholeDate.Any(t => t.holeID == item.eholeID))
                    continue;
                var Shole = WSholeDate.Where(t => t.holeID == item.sholeID).First();
                var Ehole = WSholeDate.Where(t => t.holeID == item.eholeID).First();
                double [] sCoorWgs=new double[] { Shole.CoorWgsX, Shole.CoorWgsY };
                double[] eCoorWgs = new double[] { Ehole.CoorWgsX, Ehole.CoorWgsY };
                if (isBd) {
                    if (areid == 1)
                    {
                        sCoorWgs = CoordinateCalculation.WGS84TOBD(sCoorWgs);
                        eCoorWgs = CoordinateCalculation.WGS84TOBD(eCoorWgs);
                    }
                    else {
                        sCoorWgs = CoordinateCalculation.shenzhenToBd(Shole.szCoorX, Shole.szCoorY, Shole.hight);
                        eCoorWgs = CoordinateCalculation.shenzhenToBd(Ehole.szCoorX, Ehole.szCoorY, Shole.hight);
                    }
                }
                item.S_Point = Shole.Exp_No;
                item.E_Point = Ehole.Exp_No;
                item.sCoorWgsX = sCoorWgs[0];
                item.sCoorWgsY = sCoorWgs[1];
                item.eCoorWgsX = eCoorWgs[0];
                item.eCoorWgsY = eCoorWgs[1];
                item.smaxdeep = Shole.maxdeep;
                item.emaxdeep = Ehole.maxdeep;
                item.ehight = Ehole.hight;
                item.shight = Shole.hight;
                item.s_subsid = Shole.subsid;
                item.s_Feature = Shole.Feature;
                item.e_subsid = Ehole.subsid;
                item.e_Feature = Ehole.Feature;
                item.cCoorWgsX = ((sCoorWgs[0] + eCoorWgs[0]) / 2).UtObjToMoney();
                item.cCoorWgsY = ((sCoorWgs[1] + eCoorWgs[1]) / 2).UtObjToMoney();
                item.dbCoor = CoordinateCalculation.WGS84TOBD(new double[] { item.cCoorWgsX, item.cCoorWgsY });
                if (!reholeDateMoldes.Any(t => t.holeID == Shole.holeID))
                    reholeDateMoldes.Add(Shole);
                if (!reholeDateMoldes.Any(t => t.holeID == Ehole.holeID))
                    reholeDateMoldes.Add(Ehole);
                relineDateMoldes.Add(item);
            }
            lineHoleDateModel.holeDateMoldes = reholeDateMoldes;
            lineHoleDateModel.lineDateMoldes = relineDateMoldes;
            return lineHoleDateModel;
        }

        public LineInfoMolde GetLineInfoByID(int id)
        {
            LineInfoMolde lineInfoMolde = new LineInfoMolde();
            var model = Db.Queryable<pipe_line>().Where(t => t.id == id).First();
            if (model == null || model.id == 0) 
                return null;
            lineInfoMolde.model = model;
            //ͼƬ
            lineInfoMolde.imgs = Db.Queryable<pipe_line_img>().Where(t => t.lineID == id).ToList();
            lineInfoMolde.dangers = Db.Queryable<hidden_danger>().Where(t => t.objID == id && t.tableType == "pipe_line").ToList();

            //流向分析
            #region 流向分析
            var farr = model.subclassIDs.Split(',');
            var flowLineList = Db.Queryable<pipe_line>().In(t=>t.id, farr).Select(t=>new SeLineMolde() { e_holeID = SqlFunc.Subqueryable<pipe_hole>().Where(s => s.id == t.E_holeID && s.Feature.Equals("出水口")).Select(s => s.id), id = t.id, line_Class = t.line_Class, lno = t.Lno, pSize = t.PSize }).ToList();
            //污水管与雨水管数量
            var wsFLineSum = flowLineList.Any(t => t.line_Class == "WS") ? flowLineList.Where(t => t.line_Class == "WS").Count() : 0;
            var ysFLineSum = flowLineList.Any(t => t.line_Class == "YS") ? flowLineList.Where(t => t.line_Class == "YS").Count() : 0;
            //圆管与方管数量
            var rFLineSum = flowLineList.Any(t => t.pSize.IndexOf('X') < 0) ? flowLineList.Where(t => t.pSize.IndexOf('X') < 0).Count() : 0;
            var fFLineSum = flowLineList.Any(t => t.pSize.IndexOf('X') > -1) ? flowLineList.Where(t => t.pSize.IndexOf('X') > -1).Count() : 0;
            FlowToAndTrMolde flowToAndTrMolde = new FlowToAndTrMolde();
            flowToAndTrMolde.wsLineSum = wsFLineSum;
            flowToAndTrMolde.ysLineSum = ysFLineSum;
            flowToAndTrMolde.rLineSum = rFLineSum;
            flowToAndTrMolde.fLineSum = fFLineSum;
            flowToAndTrMolde.seLineMoldes = flowLineList;
            lineInfoMolde.flowToMolde = flowToAndTrMolde;
            #endregion

            //溯源分析
            #region 溯源分析
            var tarr = model.parentIDs.Split(',');

            var trLineList = Db.Queryable<pipe_line>().In(t=>t.id, tarr).Select(t => new SeLineMolde() { s_holeID = SqlFunc.Subqueryable<pipe_hole>().Where(s => s.id == t.S_holeID && s.Feature.Equals("进水口")).Select(s => s.id), id = t.id, line_Class = t.line_Class, lno = t.Lno, pSize = t.PSize }).ToList();
            //污水管与雨水管数量
            var wsTLineSum = trLineList.Any(t => t.line_Class == "WS") ? trLineList.Where(t => t.line_Class == "WS").Count() : 0;
            var ysTLineSum = trLineList.Any(t => t.line_Class == "YS") ? trLineList.Where(t => t.line_Class == "YS").Count() : 0;
            //圆管与方管数量
            var rTLineSum = trLineList.Any(t => t.pSize.IndexOf('X') < 0) ? trLineList.Where(t => t.pSize.IndexOf('X') < 0).Count() : 0;
            var fTLineSum = trLineList.Any(t => t.pSize.IndexOf('X') > -1) ? trLineList.Where(t => t.pSize.IndexOf('X') > -1).Count() : 0;
            FlowToAndTrMolde traceabilityMolde = new FlowToAndTrMolde();
            traceabilityMolde.wsLineSum = wsTLineSum;
            traceabilityMolde.ysLineSum = ysTLineSum;
            traceabilityMolde.rLineSum = rTLineSum;
            traceabilityMolde.fLineSum = fTLineSum;
            traceabilityMolde.seLineMoldes = trLineList;
            lineInfoMolde.traceabilityMolde = traceabilityMolde;
            #endregion

            return lineInfoMolde;
        }

        public List<TreeLineMolde> getLineListBytree(int areid)
        {
            return Db.Queryable<pipe_line>().Where(t=>t.areid == areid).Select(t=> new TreeLineMolde() { eHoleID = t.E_holeID, id = t.id, sHoleID =t.S_holeID }).ToList();
        }

        public List<QueryLineHoleMolde>  GetQueryLineHolesDate(string kw)
        {
            var holeList = Db.Queryable<pipe_hole>()
                .Where(t=>t.Exp_No.Contains(kw))
                .Take(4)
                .OrderBy(t=>t.id,SqlSugar.OrderByType.Desc)
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 2, eNo = t.Exp_No, id = t.id }).ToList();

            var lineList = Db.Queryable<pipe_line>()
                .Where(t=>t.Lno.Contains(kw))
                .Take(4) 
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 1, eNo = t.Lno, id = t.id }).ToList();
            if (holeList != null) {
                holeList.AddRange(lineList);
            }
            return holeList;
        }
        public List<QueryLineListMolde> GetQueryPipeLineList(string kw,int areid)
        {
            var lineList = Db.Queryable<pipe_line>()
                .Where(t => t.areid == areid)
                .Where(t => t.Lno.Contains(kw)||t.E_Point.Contains(kw)||t.S_Point.Contains(kw))
                .Select(t => new QueryLineListMolde() { addreess = t.Address, dataType = 1, eNo = t.Lno, id = t.id})
                .Take(7)
                .ToList();
            return lineList;
        }

        public void UpdateFlowToData(pipe_line item)
        {
            Db.Updateable<pipe_line>()
            .SetColumns(it => new pipe_line() { S_holeID = item.E_holeID, S_Point = item.E_Point, S_Deep = item.E_Deep, startbotto= item.endbotto, startcrow = item.endcrow,  E_holeID = item.S_holeID, E_Point= item.S_Point, E_Deep= item.S_Deep, endbotto= item.startbotto, endcrow = item.startcrow })
            .Where(t => t.id == item.id)
            .ExecuteCommand();
        }

        public void UpdateHoleIDByID(int sholeID, int eholeID, int lineid)
        {
            Db.Updateable<pipe_line>()
            .SetColumns(it => new pipe_line() { S_holeID = sholeID, E_holeID = eholeID })
            .Where(t => t.id == lineid)
            .ExecuteCommand();
        }

        public void UpdateParentsIDSChildrsIDS(string parentsIDS, string childrsIDS, int id)
        {
            Db.Updateable<pipe_line>()
                .SetColumns(it => new pipe_line() { parentIDs = parentsIDS, subclassIDs = childrsIDS })
                .Where(t => t.id == id)
                .ExecuteCommand();
        }

        public StatisticalAllDataDataModel GetStatisticalAllDataData(int areid)
        {
            StatisticalAllDataDataModel model = new StatisticalAllDataDataModel();
            var cctvlist = Db.Queryable<cctv>().Where(t => t.areid == areid).Select(t => new cctv() { grade = t.grade, lno = t.lno, areatwo = t.areatwo }).ToList();
            var yhlist = Db.Queryable<hidden_danger>().Where(t => t.areid == areid).Select(t => new hidden_danger() { hd_name = t.hd_name, handleState = t.handleState, handleTime = t.handleTime, tableType = t.tableType, areatwo = t.areatwo }).ToList();
            var holelist = Db.Queryable<pipe_hole>().Where(t=>t.areid == areid).Select(t=>new pipe_hole() {HType=t.HType,  Subsid =t.Subsid, areatwo = t.areatwo }).ToList();
            var linelist = Db.Queryable<pipe_line>().Where(t => t.areid == areid).Select(t => new pipe_line() { Material = t.Material,PSize = t.PSize,line_Class = t.line_Class, areatwo = t.areatwo }).ToList();

            var holes =  holelist.Where(t => !string.IsNullOrWhiteSpace(t.Subsid)).ToList();
            var wscctv = cctvlist.Where(t => t.lno.Contains("WS")).ToList();
            var yscctv = cctvlist.Where(t => t.lno.Contains("YS")).ToList();
            model.wscctvSum = wscctv.Count();
            model.yscctvSum = yscctv.Count();
            model.pipeholeSum = holes.Count();
            model.pipelineSum = linelist.Count();
            model.yhpipehole = yhlist.Where(t=>t.tableType.Equals("pipe_hole")).Count();
            model.yhpipeline = yhlist.Where(t => t.tableType.Equals("pipe_line")).Count();

            //井类型
            model.holeTypeValues =  holes.GroupBy(t =>new { t.Subsid } ).Select(t => new CommonNameValueModel { name = t.Key.Subsid, value = t.Count() }).ToList();

            //cctv 等级
            List<string> cctvStartList = new List<string>() { "Ⅰ级", "Ⅱ级", "Ⅲ级", "Ⅳ级"};
            List<string> pipeTypeList = new List<string>() { "污水", "雨水" };

            var wscctv1 = wscctv.Where(t => t.grade == 1).Count();
            var wscctv2 = wscctv.Where(t => t.grade == 2).Count();
            var wscctv3 = wscctv.Where(t => t.grade == 3).Count();
            var wscctv4 = wscctv.Where(t => t.grade == 4).Count();
            var yscctv1 = yscctv.Where(t => t.grade == 1).Count();
            var yscctv2 = yscctv.Where(t => t.grade == 2).Count();
            var yscctv3 = yscctv.Where(t => t.grade == 3).Count();
            var yscctv4 = yscctv.Where(t => t.grade == 4).Count();
            model.cctvStartList = cctvStartList;
            model.pipeTypeList = pipeTypeList;
            CommonAllValueListModel cctvListModel = new CommonAllValueListModel
            {
                list1 = new List<int>() { wscctv1, yscctv1 },
                list2 = new List<int>() { wscctv2, yscctv2 },
                list3 = new List<int>() { wscctv3, yscctv3 },
                list4 = new List<int>() { wscctv4, yscctv4 }
            };
            model.cctvStartmodel = cctvListModel;

            //管线材料类型统计
            var linemtypeList = linelist.GroupBy(t =>new { t.Material }).Select(t => new CommonNameValueModel { name = t.Key.Material, value = t.Count() }).ToList();
            model.linemtypeNameList = linemtypeList.Select(t=>t.name).ToList();
            model.linemtypevalueList = linemtypeList.Select(t => t.value).ToList();

            //隐患状态统计
            List<string> yhStartList = new List<string>() { "未处理", "已处理", "处理中" };
            model.yhStateList = yhStartList;
            var wsyhList = yhlist.Where(t => t.hd_name.Contains("WS")).ToList();
            var ysyhList = yhlist.Where(t => t.hd_name.Contains("YS")).ToList();

            var wsyh0 = wsyhList.Where(t => t.handleState == 0).Count();
            var wsyh1 = wsyhList.Where(t => t.handleState == 1).Count();
            var wsyh2 = wsyhList.Where(t => t.handleState == 2).Count();

            var ysyh0 = ysyhList.Where(t => t.handleState == 0).Count();
            var ysyh1 = ysyhList.Where(t => t.handleState == 1).Count();
            var ysyh2 = ysyhList.Where(t => t.handleState == 2).Count();

            CommonAllValueListModel yhListModel = new CommonAllValueListModel
            {
                list1 = new List<int>() { wsyh0, ysyh0 },
                list2 = new List<int>() { wsyh1, ysyh1 },
                list3 = new List<int>() { wsyh2, ysyh2 }
            };
            model.yhStartmodel = yhListModel;

            //区域统计，污水管，雨水管，隐患数
            List<CommonAreaModel> areaname = new List<CommonAreaModel>();
            var wsline = linelist.Where(t => t.line_Class.Equals("WS"));
            var ysline = linelist.Where(t => t.line_Class.Equals("YS"));
            if (areid == 1)
            {
                CommonAreaModel commonAreaModel = new CommonAreaModel() {
                    name = "高明区",
                    wsvalue = wsline.Where(t=>t.areatwo.Equals("高明区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("高明区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("高明区")).Count()
                };
                CommonAreaModel commonAreaModel1 = new CommonAreaModel()
                {
                    name = "三水区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("三水区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("三水区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("三水区")).Count()
                };
                CommonAreaModel commonAreaModel2 = new CommonAreaModel()
                {
                    name = "南海区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("南海区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("南海区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("南海区")).Count()
                };
                CommonAreaModel commonAreaModel3 = new CommonAreaModel()
                {
                    name = "禅城区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("禅城区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("禅城区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("禅城区")).Count()
                };
                CommonAreaModel commonAreaModel4 = new CommonAreaModel()
                {
                    name = "顺德区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("顺德区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("顺德区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("顺德区")).Count()
                };
                areaname.Add(commonAreaModel);
                areaname.Add(commonAreaModel1);
                areaname.Add(commonAreaModel2);
                areaname.Add(commonAreaModel3);
                areaname.Add(commonAreaModel4);
            }
            else {
                CommonAreaModel commonAreaModel = new CommonAreaModel()
                {
                    name = "宝安区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("宝安区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("宝安区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("宝安区")).Count()
                };
                CommonAreaModel commonAreaModel1 = new CommonAreaModel()
                {
                    name = "光明区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("光明区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("光明区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("光明区")).Count()
                };
                CommonAreaModel commonAreaModel2 = new CommonAreaModel()
                {
                    name = "龙华区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("龙华区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("龙华区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("龙华区")).Count()
                };
                CommonAreaModel commonAreaModel3 = new CommonAreaModel()
                {
                    name = "南山区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("南山区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("南山区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("南山区")).Count()
                };

                CommonAreaModel commonAreaModel4 = new CommonAreaModel()
                {
                    name = "龙岗区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("龙岗区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("龙岗区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("龙岗区")).Count()
                };
                CommonAreaModel commonAreaModel5 = new CommonAreaModel()
                {
                    name = "福田区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("福田区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("福田区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("福田区")).Count()
                };
                CommonAreaModel commonAreaModel6 = new CommonAreaModel()
                {
                    name = "罗湖区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("罗湖区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("罗湖区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("罗湖区")).Count()
                };
                CommonAreaModel commonAreaModel7 = new CommonAreaModel()
                {
                    name = "盐田区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("盐田区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("盐田区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("盐田区")).Count()
                };
                CommonAreaModel commonAreaModel8 = new CommonAreaModel()
                {
                    name = "坪山区",
                    wsvalue = wsline.Where(t => t.areatwo.Equals("坪山区")).Count(),
                    value = yhlist.Where(t => t.areatwo.Equals("坪山区")).Count(),
                    ysvalue = ysline.Where(t => t.areatwo.Equals("坪山区")).Count()
                };
                areaname.Add(commonAreaModel);
                areaname.Add(commonAreaModel1);
                areaname.Add(commonAreaModel2);
                areaname.Add(commonAreaModel3);
                areaname.Add(commonAreaModel4);
                areaname.Add(commonAreaModel5);
                areaname.Add(commonAreaModel6);
                areaname.Add(commonAreaModel7);
                areaname.Add(commonAreaModel8);
            }
            model.areamaxvalue = areaname.Max(t => t.value);
            model.areaList = areaname;
            return model;
        }


    }
}
                    