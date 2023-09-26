using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop.DTO.ArticleDTOs;
using WebShop.DTO.OrderDTOs;
using WebShop.Interfaces;

namespace WebShop.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IUserService _userService;

        public OrderController(IOrderService orderService, IUserService userService)
        {
            _orderService = orderService;
            _userService = userService;
        }

        [HttpPut("new-order")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> NewOrder([FromBody] OrderDTO orderDTO)
        {
            return Ok(await _orderService.NewOrder(orderDTO, _userService.GetUserIdFromToken(User)));
        }

        [HttpGet("get-order")]
        [Authorize]
        public async Task<IActionResult> GetOrder( long id)
        {
            return Ok(await _orderService.GetOrder(id));
        }

        [HttpGet("get-orders")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetOrders()
        {
            return Ok(await _orderService.GetOrders());
        }

        [HttpGet("get-undelivered-orders")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> GetUndeliveredOrders()
        {
            return Ok(await _orderService.GetUndeliveredOrders(_userService.GetUserIdFromToken(User)));
        }

        [HttpGet("get-seller-new-orders")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> GetSellerNewOrders()
        {
            return Ok(await _orderService.GetNewOrders(_userService.GetUserIdFromToken(User)));
        }

        [HttpGet("get-seller-old-orders")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> GetSellerOldOrders()
        {
            return Ok(await _orderService.GetOldOrders(_userService.GetUserIdFromToken(User)));
        }

        [HttpGet("get-user-orders")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> GetUserOrders()
        {
            return Ok(await _orderService.GetUserOrders(_userService.GetUserIdFromToken(User)));
        }

        [HttpPut("cancel-order")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> CancelOrder([FromForm] long orderId)
        {
            return Ok(await _orderService.CancelOrder(orderId));
        }

        [HttpPut("approve-order")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> ApproveOrder([FromForm] long orderId)
        {
            return Ok(await _orderService.ApproveOrder(orderId));
        }

        [HttpPut("add-order-items")]
        [Authorize(Roles = "BUYER")]
        public async Task<IActionResult> AddItemsToOrder([FromBody] OrderItemsDTO itemsOrderDTO)
        {
            await _orderService.AddOrderItems(itemsOrderDTO.OrderId, itemsOrderDTO.OrderItems);
            return Ok();
        }
    }
}
