using WebShop.Models;

namespace WebShop.DTO.OrderDTOs
{
    public class OrderItemDTO
    {
        public int Quantity { get; set; }
        public long ArticleId { get; set; }
    }
}
