namespace WebShop.Models
{
    public class OrderItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Quantity { get; set; }
        public long SellerId { get; set; }
        public long ArticleId { get; set; }
        public long OrderId { get; set; }
        public Order Order { get; set; }
    }
}
