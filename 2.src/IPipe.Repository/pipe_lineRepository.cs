
using IPipe.Common.Helper;
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
using NPOI.SS.Formula.Functions;
using System.Collections.Generic;
using System.IO;
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

        public LineHoleDateModel GetLineHolesDate(int type)
        {
            bool isBd = type != 1;
            LineHoleDateModel lineHoleDateModel = new LineHoleDateModel();
            var WSholeDate = Db.Queryable<pipe_hole>()
                .Where(t=>t.HType.Equals("WS"))
                .Select(t => new HoleDateMolde() { hight = t.hight,szCoorX = t.szCoorX, szCoorY = t.szCoorY, hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep , subsid = t.Subsid })
                .Take(1000)
                .ToList();
            var YSholeDate = Db.Queryable<pipe_hole>()
                .Where(t => t.HType.Equals("YS"))
                .Take(1000)
                .Select(t => new HoleDateMolde() { hight = t.hight, szCoorX = t.szCoorX , szCoorY = t.szCoorY,hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep, subsid = t.Subsid })
                .ToList();
            WSholeDate.AddRange(YSholeDate);
            lineHoleDateModel.holeDateMoldes = WSholeDate;
            var LineDate = Db.Queryable<pipe_line>()
                           .Select(t => new LineDateMolde() { Lno =  t.Lno,pSize = t.PSize ,line_Class =  t.line_Class, LineID = t.id,  sholeID = t.S_holeID,  eholeID = t.E_holeID })
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
                     sCoorWgs = CoordinateCalculation.shenzhenToBd(Shole.szCoorX, Shole.szCoorY, Shole.hight);
                     eCoorWgs = CoordinateCalculation.shenzhenToBd(Ehole.szCoorX, Ehole.szCoorY, Shole.hight);
                }
                item.S_Point = Shole.Exp_No;
                item.E_Point = Ehole.Exp_No;
                item.sCoorWgsX = sCoorWgs[0];
                item.sCoorWgsY = sCoorWgs[1];
                item.eDeep = Shole.Deep;
                item.eCoorWgsX = eCoorWgs[0];
                item.eCoorWgsY = eCoorWgs[1];
                item.sDeep = Ehole.Deep;
                item.s_subsid = Shole.subsid;
                item.e_subsid = Ehole.subsid;
                item.cCoorWgsX = ((sCoorWgs[0] + eCoorWgs[0]) / 2).ObjToMoney();
                item.cCoorWgsY = ((sCoorWgs[1] + eCoorWgs[1]) / 2).ObjToMoney();
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
            return lineInfoMolde;
        }

        public List<TreeLineMolde> getLineListBytree()
        {
            return Db.Queryable<pipe_line>().Select(t=> new TreeLineMolde() { eHoleID = t.E_holeID, id = t.id, sHoleID =t.S_holeID }).ToList();
        }

        public List<QueryLineHoleMolde>  GetQueryLineHolesDate(string kw)
        {
            var holeList = Db.Queryable<pipe_hole>()
                .Where(t=>t.Exp_No.Contains(kw))
                .Take(4)
                .OrderBy(t=>t.id,SqlSugar.OrderByType.Desc)
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 1, eNo = t.Exp_No, id = t.id }).ToList();

            var lineList = Db.Queryable<pipe_line>()
                .Where(t=>t.Lno.Contains(kw))
                .Take(4) 
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 1, eNo = t.Lno, id = t.id }).ToList();
            if (holeList != null) {
                holeList.AddRange(lineList);
            }
            return holeList;
        }

        public void UpdateParentsIDSChildrsIDS(string parentsIDS, string childrsIDS, int id)
        {
            Db.Updateable<pipe_line>()
                .SetColumns(it => new pipe_line() { parentIDs = parentsIDS, subclassIDs = childrsIDS })
                .Where(t => t.id == id)
                .ExecuteCommand();
        }
    }
}
                    