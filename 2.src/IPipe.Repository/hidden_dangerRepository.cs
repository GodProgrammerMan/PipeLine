
using IPipe.IRepository;
using IPipe.IRepository.UnitOfWork;
using IPipe.Model.Models;
using IPipe.Repository.Base;

namespace IPipe.Repository
{
	/// <summary>
	/// hidden_dangerRepository
	/// </summary>
    public class hidden_dangerRepository : BaseRepository<hidden_danger>, Ihidden_dangerRepository
    {
        public hidden_dangerRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
                    