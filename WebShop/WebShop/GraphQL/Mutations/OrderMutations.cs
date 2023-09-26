using GraphQL;
using GraphQL.Types;
using WebShop.DTO.OrderDTOs;
using WebShop.Interfaces;
using WebShop.Services;

namespace WebShop.GraphQL.Mutations
{
    public class OrderMutations : ObjectGraphType
    {
        public OrderMutations(IOrderService orderService)
        {
            FieldAsync<BooleanGraphType>(
                name: "cancelOrder",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<LongGraphType>>() { Name = "orderId" }),
                resolve: async context =>
                {
                    return await orderService.CancelOrder(context.GetArgument<long>("orderId"));
                }
                );

            FieldAsync<BooleanGraphType>(
                name: "approveOrder",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<LongGraphType>>() { Name = "orderId" }),
                resolve: async context =>
                {
                    return await orderService.ApproveOrder(context.GetArgument<long>("orderId"));
                }
                );

            FieldAsync<LongGraphType>(
                name: "newOrder",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<LongGraphType>>() { Name = "buyerId" },
                    new QueryArgument<NonNullGraphType<StringGraphType>>() { Name = "comment" },
                    new QueryArgument<NonNullGraphType<StringGraphType>>() { Name = "address" },
                    new QueryArgument<NonNullGraphType<DecimalGraphType>>() { Name = "totalPrice" },
                    new QueryArgument<NonNullGraphType<BooleanGraphType>>() { Name = "isPayed" }
                    ),
                resolve: async context =>
                {
                    OrderDTO orderDTO = new OrderDTO()
                    {
                        Address = context.GetArgument<string>("address"),
                        Comment = context.GetArgument<string>("comment"),
                        TotalPrice = context.GetArgument<double>("totalPrice"),
                        IsPayed = context.GetArgument<bool>("isPayed")
                    };
                    long buyerId = context.GetArgument<long>("buyerId");

                    return await orderService.NewOrder(orderDTO, buyerId);
                }
                );

        }
    }
}
