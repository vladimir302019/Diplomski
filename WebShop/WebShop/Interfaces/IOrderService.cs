using WebShop.DTO.OrderDTOs;
using WebShop.Models;

namespace WebShop.Interfaces
{
    public interface IOrderService
    {
        Task<long> NewOrder(OrderDTO orderDTO, long buyerId);
        Task<OrderAllDTO> GetOrder(long orderId);
        Task<List<OrderAdminDTO>> GetOrders();
        Task<List<OrderAllDTO>> GetUndeliveredOrders(long userId);
        Task<List<OrderAllDTO>> GetNewOrders(long userId);
        Task<List<OrderAllDTO>> GetOldOrders(long userId);
        Task<List<OrderAllDTO>> GetUserOrders(long userId);
        Task<bool> CancelOrder(long orderId);
        Task<bool> ApproveOrder(long orderId);
        Task AddOrderItems(long orderId, List<OrderItemDTO> orderItems);

        #region Non-async
        List<Order> GetAllOrders();
        List<Order> GetNotDeliveredOrders(long userId);
        List<Order> GetUsersOrders(long userId);
        List<Order> NewOrders(long userId);
        List<Order> OldOrders(long userId);
        Order GetOrderById(long orderId);
        #endregion
    }
}
