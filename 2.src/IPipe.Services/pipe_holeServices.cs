
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using IPipe.Services.BASE;
using System.Collections.Generic;

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

        public List<HoleCoorXYMolde> getHoleCoorXY()
        {
            return _dal.GetHoleCoor();
        }

        public HoleInfoMolde GetHoleInfoByID(int id)
        {
            return _dal.GetHoleInfoByID(id);
        }

        public void UpdateMaxDeep(pipe_hole item)
        {
            _dal.UpdateMaxDeep(item);
        }

        public void UpdateWgsXY(double X, double Y, int id)
        {
             _dal.UpdateWgsXY(X,Y,id);
        }
    }
}
                    