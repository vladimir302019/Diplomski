using AutoMapper;
using WebShop.DTO.OrderDTOs;
using WebShop.ExceptionHandler.Exceptions;
using WebShop.Interfaces;
using WebShop.Models;
using WebShop.Models.Enums;
using WebShop.Repositories.IRepositories;

namespace WebShop.Services
{
    public class OrderService : IOrderService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public OrderService(IMapper mapper, IUnitOfWork unit)
        {
            _mapper = mapper;
            _unitOfWork = unit;
        }

        public async Task<bool> CancelOrder(long orderId)
        {
            var order = await _unitOfWork.OrderRepository.GetById(orderId);
            if (order == null) { throw new NotFoundException("Order doesn't exist."); }
            order.OrderItems = await GetItemsForOrderId(orderId);

            List<Article> list = await _unitOfWork.ArticleRepository.GetAll();

            foreach (var item in order.OrderItems)
            {
                foreach (var article in list)
                {
                    if (item.ArticleId == article.Id)
                    {
                        article.MaxQuantity = article.MaxQuantity + item.Quantity;
                        _unitOfWork.ArticleRepository.UpdateArticle(article);
                    }
                }
            }

            order.Confirmed = false;
            _unitOfWork.OrderRepository.UpdateOrder(order);

            await _unitOfWork.Save();

            return true;
        }

        public async Task<OrderAllDTO> GetOrder(long orderId)
        {
            Order order = await _unitOfWork.OrderRepository.GetById(orderId);
            order.OrderItems = await GetItemsForOrderId(orderId);
            return _mapper.Map<OrderAllDTO>(order);
        }
        private async Task<List<OrderItem>> GetItemsForOrderId(long id)
        {
            List<OrderItem> lista = await _unitOfWork.OrderItemRepository.GetAll();
            return lista.Where(oi => oi.OrderId == id).ToList();
        }

        public async Task<List<OrderAdminDTO>> GetOrders()
        {
            var orders = await _unitOfWork.OrderRepository.GetAll();
            foreach (var order in orders)
            {
                order.OrderItems = await GetItemsForOrderId(order.Id);
            }
            return _mapper.Map<List<OrderAdminDTO>>(orders);
        }

        public async Task<List<OrderAllDTO>> GetUserOrders(long userId)
        {
            var user = await _unitOfWork.UserRepository.GetById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            List<Order> lista = await _unitOfWork.OrderRepository.GetAll();
            var userOrders = lista.Where(o => o.BuyerId == user.Id).ToList();
            foreach (var order in userOrders)
            {
                order.OrderItems = await GetItemsForOrderId(order.Id);
            }
            user.Orders = userOrders;
            return _mapper.Map<List<OrderAllDTO>>(user.Orders.Where(order => order.DeliveryDate < DateTime.Now && order.Confirmed));
        }

        public async Task<List<OrderAllDTO>> GetNewOrders(long userId)
        {
            var user = await _unitOfWork.UserRepository.GetById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            var sellerOrders = await _unitOfWork.OrderRepository.GetSellerOrders(userId, false);
            foreach (var sellerOrder in sellerOrders)
            {
                sellerOrder.OrderItems = await GetItemsForOrderId(sellerOrder.Id);
            }
            return _mapper.Map<List<OrderAllDTO>>(sellerOrders);
        }

        public async Task<List<OrderAllDTO>> GetUndeliveredOrders(long userId)
        {
            var user = await _unitOfWork.UserRepository.GetById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            List<Order> lista = await _unitOfWork.OrderRepository.GetAll();
            user.Orders = lista.Where(o => o.BuyerId == user.Id).ToList();
            foreach (var order in user.Orders)
            {
                order.OrderItems = await GetItemsForOrderId(order.Id);
            }
            return _mapper.Map<List<OrderAllDTO>>(user.Orders.Where(order => order.DeliveryDate > DateTime.Now && order.Confirmed));
        }

        public async Task<long> NewOrder(OrderDTO orderDTO, long buyerId)
        {
            var user = await _unitOfWork.UserRepository.GetById(buyerId);
            if (user == null) { throw new NotFoundException("User doesn't exist."); }

            bool isPayed = orderDTO.IsPayed;
            Order newOrder = _mapper.Map<Order>(orderDTO);

            newOrder.Confirmed = true;
            if (isPayed)
            {
                newOrder.Approved = false;
                newOrder.Address = user.Address;
                newOrder.DeliveryDate = DateTime.Now.AddMinutes(10);
            }
            else
            {
                newOrder.Approved = true;
                Random random = new Random();
                int minutes = random.Next(65, 180);
                newOrder.DeliveryDate = DateTime.Now.AddMinutes(minutes);
            }
            newOrder.BuyerId = user.Id;

            


            await _unitOfWork.OrderRepository.InsertOrder(newOrder);
            await _unitOfWork.Save();

            var lastOrder = await _unitOfWork.OrderRepository.GetNewestOrderId();


            return lastOrder;
        }

        public async Task<List<OrderAllDTO>> GetOldOrders(long userId)
        {
            var user = await _unitOfWork.UserRepository.GetById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist"); }
            var sellerOrders = await _unitOfWork.OrderRepository.GetSellerOrders(userId, true);
            foreach (var sellerOrder in sellerOrders)
            {
                sellerOrder.OrderItems = await GetItemsForOrderId(sellerOrder.Id);
            }
            return _mapper.Map<List<OrderAllDTO>>(sellerOrders);
        }

        public async Task AddOrderItems(long orderId, List<OrderItemDTO> orderItems)
        {
            Order o = await _unitOfWork.OrderRepository.GetById(orderId);
            if (o == null) { throw new ConflictException("Order doesn't exist!"); }

            List<Article> articleList = await _unitOfWork.ArticleRepository.GetAll();
            List<OrderItem> orders = new List<OrderItem>();

            foreach (var oItem in orderItems)
            {
                orders.Add(_mapper.Map<OrderItem>(oItem));
            }

            foreach (var item in articleList)
            {
                foreach (var oItem in orders)
                {
                    oItem.OrderId = orderId;
                }
            }
            o.OrderItems = orders;


            foreach (var item in orders)
            {
                await _unitOfWork.OrderItemRepository.InsertOrderItem(item);
            }
            List<User> allSellers = await _unitOfWork.UserRepository.GetAll();
            allSellers = allSellers.Where(s => s.Type == UserType.SELLER).ToList();


            foreach (var item in articleList)
            {
                foreach (var oItem in orders)
                {
                    if (oItem.ArticleId == item.Id)
                    {
                        oItem.Name = item.Name;
                        oItem.Price = item.Price;
                        oItem.SellerId = item.SellerId;
                    }
                }
            }
            List<long> ids = new List<long>();
            List<User> sellers = new List<User>();

            foreach (var item in o.OrderItems)
            {
                ids.Add(item.SellerId);
                foreach (var article in articleList)
                {
                    if (item.ArticleId == article.Id)
                    {
                        if (article.MaxQuantity >= item.Quantity)
                        {
                            article.MaxQuantity = article.MaxQuantity - item.Quantity;
                            _unitOfWork.ArticleRepository.UpdateArticle(article);
                        }
                    }
                }
            }
            foreach (var seller in allSellers)
            {
                if (ids.Contains(seller.Id))
                {
                    if (!sellers.Contains(seller))
                    {
                        sellers.Add(seller);
                    }
                }
            }
            o.TotalPrice += 230 * sellers.Count();

            _unitOfWork.OrderRepository.UpdateOrder(o);
            await _unitOfWork.Save();
        }

        public async Task<bool> ApproveOrder(long orderId)
        {
            var order = await _unitOfWork.OrderRepository.GetById(orderId);
            if (order == null) { throw new NotFoundException("Order doesn't exist."); }

            Random random = new Random();
            int minutes = random.Next(65, 180);
            order.DeliveryDate = DateTime.Now.AddMinutes(minutes);
            order.Approved = true;
            _unitOfWork.OrderRepository.UpdateOrder(order);

            await _unitOfWork.Save();

            return true;
        }

        #region Non-async
        private List<OrderItem> GetItemsForOrder(long id)
        {
            List<OrderItem> lista = _unitOfWork.OrderItemRepository.GetOrderItems();
            return lista.Where(oi => oi.OrderId == id).ToList();
        }
        public List<Order> GetAllOrders()
        {
            var orders = _unitOfWork.OrderRepository.GetAllOrders();
            foreach (var order in orders)
            {
                order.OrderItems = GetItemsForOrder(order.Id);
            }
            return _mapper.Map<List<Order>>(orders);
        }
        public List<Order> GetNotDeliveredOrders(long userId)
        {
            var user =  _unitOfWork.UserRepository.GetUserById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            List<Order> lista =  _unitOfWork.OrderRepository.GetAllOrders();
            user.Orders = lista.Where(o => o.BuyerId == user.Id).ToList();
            foreach (var order in user.Orders)
            {
                order.OrderItems = GetItemsForOrder(order.Id);
            }
            return _mapper.Map<List<Order>>(user.Orders.Where(order => order.DeliveryDate > DateTime.Now && order.Confirmed));

        }
        public List<Order> GetUsersOrders(long userId)
        {
            var user =  _unitOfWork.UserRepository.GetUserById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            List<Order> lista = _unitOfWork.OrderRepository.GetAllOrders();
            var userOrders = lista.Where(o => o.BuyerId == user.Id).ToList();
            foreach (var order in userOrders)
            {
                order.OrderItems = GetItemsForOrder(order.Id);
            }
            user.Orders = userOrders;
            return _mapper.Map<List<Order>>(user.Orders.Where(order => order.DeliveryDate < DateTime.Now && order.Confirmed));

        }
        public List<Order> NewOrders(long userId)
        {
            var user =  _unitOfWork.UserRepository.GetUserById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            var sellerOrders = _unitOfWork.OrderRepository.GetSellersOrders(userId, false);
            foreach (var sellerOrder in sellerOrders)
            {
                sellerOrder.OrderItems = GetItemsForOrder(sellerOrder.Id);
            }
            return _mapper.Map<List<Order>>(sellerOrders);
        }
        public List<Order> OldOrders(long userId)
        {
            var user = _unitOfWork.UserRepository.GetUserById(userId);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            var sellerOrders = _unitOfWork.OrderRepository.GetSellersOrders(userId, true);
            foreach (var sellerOrder in sellerOrders)
            {
                sellerOrder.OrderItems = GetItemsForOrder(sellerOrder.Id);
            }
            return _mapper.Map<List<Order>>(sellerOrders);
        }
        public Order GetOrderById(long orderId)
        {
            Order order =  _unitOfWork.OrderRepository.GetOrderById(orderId);
            order.OrderItems =  GetItemsForOrder(orderId);
            return _mapper.Map<Order>(order);
        }
        #endregion
    }
}
