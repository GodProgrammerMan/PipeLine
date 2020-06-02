
using IPipe.IServices.BASE;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;

namespace IPipe.IServices
{
    /// <summary>
    /// Ipipe_lineServices
    /// </summary>	
    public interface Ipipe_lineServices : IBaseServices<pipe_line>
    {
        LineHoleDateModel GetQueryLineHolesDate(string kw);
        LineHoleDateModel GetLineHolesDate();
    }
}
                    