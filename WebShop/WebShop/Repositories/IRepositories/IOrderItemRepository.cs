using WebShop.Models;

namespace WebShop.Repositories.IRepositories
{
    public interface IOrderItemRepository
    {
        Task<List<OrderItem>> GetAll();
        Task<OrderItem> GetById(long id);
        Task<OrderItem> InsertOrderItem(OrderItem orderItem);
        void DeleteOrderItem(long id);
        void UpdateOrderItem(OrderItem orderItem);
        List<OrderItem> GetOrderItems();
    }
}
