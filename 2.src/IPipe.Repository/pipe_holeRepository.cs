
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;

namespace IPipe.Repository
{
	/// <summary>
	/// pipe_holeRepository
	/// </summary>
    public class pipe_holeRepository : BaseRepository<pipe_hole>, Ipipe_holeRepository
    {
        public pipe_holeRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public List<HoleCoorXYMolde> GetHoleCoor()
        {
            return Db.Queryable<pipe_hole>().Select(t => new HoleCoorXYMolde() { id = t.id, CoorX = t.szCoorX,CoorY = t.szCoorY, hight = t.hight }).ToList();
        }

        public HoleInfoMolde GetHoleInfoByID(int id)
        {
            HoleInfoMolde  holeInfoMolde = new HoleInfoMolde();
            var model = Db.Queryable<pipe_hole>().Where(t => t.id == id).First();
            if (model == null || model.id == 0)
                return null;
            holeInfoMolde.model = model;
   
            holeInfoMolde.imgs = Db.Queryable<pipe_hole_img>().Where(t => t.holeID == id).ToList();
            holeInfoMolde.dangers = Db.Queryable<hidden_danger>().Where(t => t.objID == id && t.tableType == "pipe_hole").ToList();
            return holeInfoMolde;
        }

        public void UpdateMaxDeep(pipe_hole item)
        {
            var result = Db.Updateable(item).UpdateColumns(it => new { it.maxdeep }).ExecuteCommand();
        }

        public void UpdateWgsXY(double x, double y, int id)
        {
            Db.Updateable<pipe_hole>()
                .SetColumns(it => new pipe_hole() { CoorWgsX = x, CoorWgsY = y })
                .Where(t => t.id == id)
                .ExecuteCommand();
        }
    }
}
                    