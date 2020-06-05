
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Repository.Base;

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

        public HoleInfoMolde GetHoleInfoByID(int id)
        {
            HoleInfoMolde  holeInfoMolde = new HoleInfoMolde();
            var model = Db.Queryable<pipe_hole>().Where(t => t.id == id).First();
            if (model == null || model.id == 0)
                return null;
            holeInfoMolde.model = model;
            //ͼƬ
            holeInfoMolde.imgs = Db.Queryable<pipe_hole_img>().Where(t => t.holeID == id).ToList();
            holeInfoMolde.dangers = Db.Queryable<hidden_danger>().Where(t => t.objID == id && t.tableType == "pipe_hole").ToList();
            return holeInfoMolde;
        }
    }
}
                    