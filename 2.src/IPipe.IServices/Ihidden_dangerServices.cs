
using IPipe.IServices.BASE;
using IPipe.Model.Models;
using IPipe.Model.ViewModels;
using System.Collections.Generic;

namespace IPipe.IServices
{
    /// <summary>
    /// Ihidden_dangerServices
    /// </summary>	
    public interface Ihidden_dangerServices : IBaseServices<hidden_danger>
    {
        List<YhDataMolde> GetYhData(int areid);
    }
}
                    