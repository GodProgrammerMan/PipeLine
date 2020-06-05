
using IPipe.IRepository;
using IPipe.IServices;
using IPipe.Model.Models;
using IPipe.Services.BASE;

namespace IPipe.Services
{
    public partial class pipe_line_imgServices : BaseServices<pipe_line_img>, Ipipe_line_imgServices
    {
        Ipipe_line_imgRepository _dal;
        public pipe_line_imgServices(Ipipe_line_imgRepository dal)
        {
            this._dal = dal;
            base.BaseDal = dal;
        }

    }
}
                    