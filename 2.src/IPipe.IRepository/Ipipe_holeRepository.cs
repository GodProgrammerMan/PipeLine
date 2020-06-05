
                using IPipe.IRepository.Base;
                using IPipe.Model.Models;
using IPipe.Model.ViewModels;

namespace IPipe.IRepository
                {
    /// <summary>
    /// Ipipe_holeRepository
    /// </summary>	
    public interface Ipipe_holeRepository : IBaseRepository<pipe_hole>
    {
        HoleInfoMolde GetHoleInfoByID(int id);
    }
}
                                    