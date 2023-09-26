using WebShop.Models;

namespace WebShop.Repositories.IRepositories
{
    public interface IOrderRepository
    {
        Task<List<Order>> GetAll();
        Task<Order> GetById(long id);
        Task<Order> InsertOrder(Order order);
        void DeleteOrder(long id);
        void UpdateOrder(Order order);
        Task<List<Order>> GetSellerOrders(long sellerId, bool old);
        Task<long> GetNewestOrderId();
        List<Order> GetAllOrders();
        List<Order> GetSellersOrders(long sellerId, bool old);
        Order GetOrderById(long id);
    }
}
