using GraphQL.Types;
using WebShop.DTO.OrderDTOs;

namespace WebShop.GraphQL.Types.OrderTypes
{
    public class OrderAdminType : ObjectGraphType<OrderAdminDTO>
    {
        public OrderAdminType() 
        {
            Field(o => o.Id);
            Field(o => o.Comment);
            Field(o => o.Address);
            Field(o => o.TotalPrice);
            Field(o => o.Confirmed);
            Field(o => o.Approved);
            Field<StringGraphType>("DeliveryDate", resolve: context => context.Source.DeliveryDate.ToShortDateString());
            Field<ListGraphType<OrderItemType>>("OrderItems", resolve: context => context.Source.OrderItems.ToList());
            Field(o => o.BuyerId);
        }
    }
}
