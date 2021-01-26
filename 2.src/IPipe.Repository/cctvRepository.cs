
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Repository.Base;

namespace IPipe.Repository
{
	/// <summary>
	/// cctvRepository
	/// </summary>
    public class cctvRepository : BaseRepository<cctv>, IcctvRepository
    {
        public cctvRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
                    