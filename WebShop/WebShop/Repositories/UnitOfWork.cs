using WebShop.DBConfiguration;
using WebShop.Repositories.IRepositories;

namespace WebShop.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        public IUserRepository UserRepository { get; }

        public IArticleRepository ArticleRepository { get; }

        public IOrderRepository OrderRepository { get; }

        public IOrderItemRepository OrderItemRepository { get; }

        private readonly WebShopDbContext _context;

        public UnitOfWork(IUserRepository userRepository, IArticleRepository articleRepository, IOrderRepository orderRepository, IOrderItemRepository orderItemRepository, WebShopDbContext context)
        {
            UserRepository = userRepository;
            ArticleRepository = articleRepository;
            OrderRepository = orderRepository;
            OrderItemRepository = orderItemRepository;
            _context = context;
        }

        public async Task Save()
        {
            await _context.SaveChangesAsync();
        }
    }
}
