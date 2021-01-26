
                using IPipe.IRepository.Base;
                using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IRepository
                {
    /// <summary>
    /// Ipipe_holeRepository
    /// </summary>	
    public interface Ipipe_holeRepository : IBaseRepository<pipe_hole>
    {
        HoleInfoMolde GetHoleInfoByID(int id);
        void UpdateWgsXY(double x, double y, int id);
        List<HoleCoorXYMolde> GetHoleCoor();
        void UpdateMaxDeep(pipe_hole item);
    }
}
                                    