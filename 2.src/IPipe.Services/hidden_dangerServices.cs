
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Services.BASE;

namespace IPipe.Services
{
    public partial class hidden_dangerServices : BaseServices<hidden_danger>, Ihidden_dangerServices
    {
        Ihidden_dangerRepository _dal;
        public hidden_dangerServices(Ihidden_dangerRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

    }
}
                    