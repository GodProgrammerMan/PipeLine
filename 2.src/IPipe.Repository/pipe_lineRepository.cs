
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
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
                .Select(t => new HoleDateMolde() { hType = t.HType, holeID=t.id, Exp_No = t.Exp_No, CoorWgsX = t.CoorWgsX, CoorWgsY=t.CoorWgsY, Deep = t.deep })
                .ToList();
            lineHoleDateModel.holeDateMoldes = holeDate;
            var LineDate = Db.Queryable<pipe_line>()
                           .Select(t => new LineDateMolde() { pSize = t.PSize ,line_Class =  t.line_Class, LineID = t.id,  sholeID = t.S_holeID,  eholeID = t.E_holeID })
                           .ToList();
            lineHoleDateModel.holeDateMoldes = holeDate;
            foreach (var item in LineDate)
            {
                if (!holeDate.Any(t=>t.holeID == item.sholeID) || !holeDate.Any(t => t.holeID == item.eholeID))
                    continue;
                var Shole = holeDate.Where(t => t.holeID == item.sholeID).First();
                var Ehole = holeDate.Where(t => t.holeID == item.eholeID).First();
                item.sCoorWgsX = Shole.CoorWgsX;
                item.sCoorWgsY = Shole.CoorWgsY;
                item.eDeep = Shole.Deep;
                item.eCoorWgsX = Ehole.CoorWgsX;
                item.eCoorWgsY = Ehole.CoorWgsY;
                item.sDeep = Ehole.Deep;
                item.cCoorWgsX = (Shole.CoorWgsX + Ehole.CoorWgsX)/2;
                item.cCoorWgsY = (Shole.CoorWgsY + Ehole.CoorWgsY) / 2; ;
            }
            lineHoleDateModel.lineDateMoldes = LineDate;
            return lineHoleDateModel;
        }

        public List<QueryLineHoleMolde>  GetQueryLineHolesDate(string kw)
        {
            List<QueryLineHoleMolde> queryLineHoleMoldes = new List<QueryLineHoleMolde>();
            var holeList = Db.Queryable<pipe_hole>()
                .Where(t=>t.Exp_No.Contains(kw))
                .Take(4)
                .OrderBy(t=>t.id,SqlSugar.OrderByType.Desc)
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 1, eNo = t.Exp_No, id = t.id }).ToList();

            var lineList = Db.Queryable<pipe_line>()
                .Where(t=>t.Lno.Contains(kw))
                .Take(4) 
                .Select(t=> new QueryLineHoleMolde() { addreess = t.Address, dataType = 1, eNo = t.Lno, id = t.id }).ToList();


            return queryLineHoleMoldes;
        }
    }
}
                    