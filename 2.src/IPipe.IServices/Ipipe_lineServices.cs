
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
        LineHoleDateModel GetLineHolesDate(int type=1);
        LineInfoMolde GetLineInfoByID(int id);
        List<TreeLineMolde> getLineListBytree();
        void UpdateParentsIDSChildrsIDS(string parentsIDS, string ChildrsIDS,int id);
        void UpdateFlowToData(pipe_line item);
    }
}
                    