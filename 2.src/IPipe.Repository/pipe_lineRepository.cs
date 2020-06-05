
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

        public LineHoleDateModel GetLineHolesDate()
        {
            LineHoleDateModel lineHoleDateModel = new LineHoleDateModel();
            var holeDate = Db.Queryable<pipe_hole>()
                .Where(t=>t.CoorWgsX>=22.7302 && t.CoorWgsX <=22.7977 && t.CoorWgsY >= 113.8891&& t.CoorWgsY <= 113.9572)
                .Select(t => new HoleDateMolde() { hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep })
                .ToList();
            lineHoleDateModel.holeDateMoldes = holeDate;
            var LineDate = Db.Queryable<pipe_line>()
                           .Select(t => new LineDateMolde() { pSize = t.PSize ,line_Class =  t.line_Class, LineID = t.id,  sholeID = t.S_holeID,  eholeID = t.E_holeID })
                           .ToList();
            List<HoleDateMolde> reholeDateMoldes = new List<HoleDateMolde>();
            List<LineDateMolde> relineDateMoldes = new List<LineDateMolde>();
            foreach (var item in LineDate)
            {
                if (!holeDate.Any(t => t.holeID == item.sholeID) || !holeDate.Any(t => t.holeID == item.eholeID))
                    continue;
                var Shole = holeDate.Where(t => t.holeID == item.sholeID).First();
                var Ehole = holeDate.Where(t => t.holeID == item.eholeID).First();
                item.sCoorWgsX = Shole.CoorWgsX;
                item.sCoorWgsY = Shole.CoorWgsY;
                item.eDeep = Shole.Deep;
                item.eCoorWgsX = Ehole.CoorWgsX;
                item.eCoorWgsY = Ehole.CoorWgsY;
                item.sDeep = Ehole.Deep;
                item.cCoorWgsX = ((Shole.CoorWgsX + Ehole.CoorWgsX) / 2).ToString("0.0000#").ObjToMoney();
                item.cCoorWgsY = ((Shole.CoorWgsY + Ehole.CoorWgsY) / 2).ToString("0.0000#").ObjToMoney();
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
    }
}
                    