using Microsoft.EntityFrameworkCore;
using WebShop.DBConfiguration;
using WebShop.Models;
using WebShop.Repositories.IRepositories;

namespace WebShop.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly WebShopDbContext _context;
        public OrderRepository(WebShopDbContext webShopDbContext) { _context = webShopDbContext; }
        public void DeleteOrder(long id)
        {
            _context.Orders.Remove(_context.Orders.Find(id));
        }

        public async Task<List<Order>> GetAll()
        {
            List<Order> orders = await _context.Orders.ToListAsync();
            return orders;
        }

        public async Task<Order> GetById(long id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task<List<Order>> GetSellerOrders(long sellerId, bool old)
        {
            List<Order> orders = await _context.Orders.Where(o => o.Confirmed &&
                                (old ? o.DeliveryDate < DateTime.Now : o.DeliveryDate > DateTime.Now))
                                .ToListAsync();

            return orders;
        }

        public async Task<Order> InsertOrder(Order order)
        {
            await _context.Orders.AddAsync(order);
            return order;
        }

        public void UpdateOrder(Order order)
        {
            Order newOrder = _context.Orders.Find(order.Id);
            newOrder = order;
            _context.Orders.Update(newOrder);
        }

        public async Task<long> GetNewestOrderId()
        {
            var orders = await _context.Orders.OrderByDescending(e => e.Id).ToListAsync();
            return orders.FirstOrDefault().Id;
        }

        public List<Order> GetAllOrders()
        {
            return _context.Orders.ToList();
        }

        public List<Order> GetSellersOrders(long sellerId, bool old)
        {
            List<Order> orders = _context.Orders.Where(o => o.Confirmed &&
                                (old ? o.DeliveryDate < DateTime.Now : o.DeliveryDate > DateTime.Now))
                                .ToList();

            return orders;
        }

        public Order GetOrderById(long id)
        {
            return _context.Orders.Find(id);
        }
    }
}
