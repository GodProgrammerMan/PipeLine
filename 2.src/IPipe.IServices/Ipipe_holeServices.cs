
using IPipe.IServices.BASE;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IServices
{
    /// <summary>
    /// Ipipe_holeServices
    /// </summary>	
    public interface Ipipe_holeServices : IBaseServices<pipe_hole>
    {
        HoleInfoMolde GetHoleInfoByID(int id);
        void UpdateWgsXY(double X, double Y, int id);
        List<HoleCoorXYMolde> getHoleCoorXY();
        void UpdateMaxDeep(pipe_hole item);
    }
}
                    