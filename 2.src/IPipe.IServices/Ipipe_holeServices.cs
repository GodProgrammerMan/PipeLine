
using IPipe.IServices.BASE;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;

namespace IPipe.IServices
{
    /// <summary>
    /// Ipipe_holeServices
    /// </summary>	
    public interface Ipipe_holeServices : IBaseServices<pipe_hole>
    {
        HoleInfoMolde GetHoleInfoByID(int id);
    }
}
                    