
                using IPipe.IRepository.Base;
                using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IRepository
                {
    /// <summary>
    /// Ihidden_dangerRepository
    /// </summary>	
    public interface Ihidden_dangerRepository : IBaseRepository<hidden_danger>
    {
        List<YhDataMolde> GetYhData(int areid);
    }
}
                                    