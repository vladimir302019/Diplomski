using GraphQL.Types;
using WebShop.Models;

namespace WebShop.GraphQL.Types.OrderTypes
{
    public class OrderItemType : ObjectGraphType<OrderItem>
    {
        public OrderItemType()
        {
            Field(oi => oi.Id);
            Field(oi => oi.Name);
            Field(oi => oi.OrderId);
            Field(oi => oi.ArticleId);
            Field(oi => oi.SellerId);
            Field(oi => oi.Price);
            Field(oi => oi.Quantity);
        }
    }
}
