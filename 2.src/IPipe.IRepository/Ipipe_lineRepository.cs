
                using IPipe.IRepository.Base;
                using IPipe.Model.Models;
using IPipe.Model.ViewModels;

namespace IPipe.IRepository
                {
    /// <summary>
    /// Ipipe_lineRepository
    /// </summary>	
    public interface Ipipe_lineRepository : IBaseRepository<pipe_line>
    {
        LineHoleDateModel GetQueryLineHolesDate(string kw);
        LineHoleDateModel GetLineHolesDate();
    }
}
                                    