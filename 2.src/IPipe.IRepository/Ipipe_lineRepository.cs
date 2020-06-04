
using IPipe.IRepository.Base;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IRepository
                {
    /// <summary>
    /// Ipipe_lineRepository
    /// </summary>	
    public interface Ipipe_lineRepository : IBaseRepository<pipe_line>
    {
        List<QueryLineHoleMolde> GetQueryLineHolesDate(string kw);
        LineHoleDateModel GetLineHolesDate();
    }
}
                                    