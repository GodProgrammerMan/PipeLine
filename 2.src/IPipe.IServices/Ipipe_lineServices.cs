
using IPipe.IServices.BASE;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IServices
{
    /// <summary>
    /// Ipipe_lineServices
    /// </summary>	
    public interface Ipipe_lineServices : IBaseServices<pipe_line>
    {
        List<QueryLineHoleMolde>  GetQueryLineHolesDate(string kw);
        LineHoleDateModel GetLineHolesDate();
    }
}
                    