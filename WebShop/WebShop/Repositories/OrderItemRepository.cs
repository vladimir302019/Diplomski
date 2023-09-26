using Microsoft.EntityFrameworkCore;
using WebShop.DBConfiguration;
using WebShop.Models;
using WebShop.Repositories.IRepositories;

namespace WebShop.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly WebShopDbContext _context;
        public OrderItemRepository(WebShopDbContext webShopDbContext) { _context = webShopDbContext; }
        public void DeleteOrderItem(long id)
        {
            _context.OrderItems.Remove(_context.OrderItems.Find(id));
        }

        public async Task<List<OrderItem>> GetAll()
        {
            return await _context.OrderItems.ToListAsync();
        }

        public async Task<OrderItem> GetById(long id)
        {
            return await _context.OrderItems.FindAsync(id);
        }

        public async Task<OrderItem> InsertOrderItem(OrderItem orderItem)
        {
            await _context.OrderItems.AddAsync(orderItem);
            return orderItem;
        }

        public void UpdateOrderItem(OrderItem orderItem)
        {
            OrderItem newOrderItem = _context.OrderItems.Find(orderItem.Id);
            newOrderItem = orderItem;
            _context.OrderItems.Update(newOrderItem);
        }

        public List<OrderItem> GetOrderItems()
        {
            return  _context.OrderItems.ToList();
        }
    }
}
