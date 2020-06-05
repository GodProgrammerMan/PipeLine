
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Services.BASE;

namespace IPipe.Services
{
    public partial class pipe_holeServices : BaseServices<pipe_hole>, Ipipe_holeServices
    {
        Ipipe_holeRepository _dal;
        public pipe_holeServices(Ipipe_holeRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

        public HoleInfoMolde GetHoleInfoByID(int id)
        {
            return _dal.GetHoleInfoByID(id);
        }
    }
}
                    