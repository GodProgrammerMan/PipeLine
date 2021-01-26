
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Repository.Base;
using Microsoft.AspNetCore.Http;

namespace IPipe.Repository
{
	/// <summary>
	/// pipe_line_imgRepository
	/// </summary>
    public class pipe_line_imgRepository : BaseRepository<pipe_line_img>, Ipipe_line_imgRepository
    {
        public pipe_line_imgRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
                    