
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
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

        public List<YhDataMolde> GetYhData()
        {
            return Db.Queryable<hidden_danger>().Select(t => new YhDataMolde { tableType = t.tableType, CoorWgsX = t.CoorWgsX, CoorWgsY = t.CoorWgsY,id= t.id,testMsg = t.hd_name }).ToList();
        }
    }
}
                    