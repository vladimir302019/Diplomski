namespace WebShop.DTO.OrderDTOs
{
    public class OrderItemsDTO
    {
        public long OrderId { get; set; }
        public List<OrderItemDTO> OrderItems { get; set; }
    }
}
