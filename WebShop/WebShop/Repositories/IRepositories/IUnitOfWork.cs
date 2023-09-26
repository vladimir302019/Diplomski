namespace WebShop.Repositories.IRepositories
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IArticleRepository ArticleRepository { get; }
        IOrderRepository OrderRepository { get; }
        IOrderItemRepository OrderItemRepository { get; }
        Task Save();
    }
}
