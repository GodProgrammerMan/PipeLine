
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;
using NPOI.SS.Formula.Functions;
using SqlSugar;
using System.Collections.Generic;

namespace IPipe.Repository
{
	/// <summary>
	/// hidden_dangerRepository
	/// </summary>
    public class hidden_dangerRepository : BaseRepository<hidden_danger>, Ihidden_dangerRepository
    {
        public hidden_dangerRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<YhDataMolde> GetYhData(int areid)
        {
            var mode = Db.Queryable<hidden_danger>().Where(t=>t.areid == areid).Select(t => new YhDataMolde { objID =  t.objID,tableType = t.tableType, CoorWgsX = t.CoorWgsX, CoorWgsY = t.CoorWgsY, id = t.id, testMsg = t.hd_name }).ToList();
            foreach (var item in mode)
            {
                if (item.tableType == "pipe_hole") {
                    var height = Db.Queryable<pipe_hole>().Where(t=>t.id == item.objID).Select(t=>t.hight).First();
                    item.height = height == 0 ?5: height;
                } else if (item.tableType == "pipe_line") {
                    var heights = Db.Queryable<pipe_line>()
                        .Where(t => t.id == item.objID)
                        .Select(t => new pipe_line { E_Deep = SqlFunc.Subqueryable<pipe_hole>().Where(e => e.id == t.E_holeID).Select(e => e.hight), S_Deep = SqlFunc.Subqueryable<pipe_hole>().Where(s => s.id == t.S_holeID).Select(s => s.hight) }).First();
                    item.height = heights.S_Deep;
                    item.eheight = heights.E_Deep;
                }
            }

            return mode;
        }
    }
}
                    