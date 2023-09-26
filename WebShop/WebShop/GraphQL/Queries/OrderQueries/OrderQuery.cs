using GraphQL;
using GraphQL.Types;
using WebShop.GraphQL.Types.OrderTypes;
using WebShop.Interfaces;
using WebShop.Services;

namespace WebShop.GraphQL.Queries.OrderQueries
{
    public class OrderQuery : ObjectGraphType
    {
        public OrderQuery(IOrderService orderService)
        {
            //Field<ListGraphType<OrderType>>("orders").Resolve(context => { return orderService.GetAllOrders(); });
            
            //Field<ListGraphType<OrderType>>("userOrders").
            //    Arguments( new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return orderService.GetUsersOrders(context.GetArgument<long>("userId")); });

            //Field<ListGraphType<OrderType>>("newOrders").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return orderService.NewOrders(context.GetArgument<long>("userId")); });

            //Field<ListGraphType<OrderType>>("undeliveredOrders").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return orderService.GetNotDeliveredOrders(context.GetArgument<long>("userId")); });

            //Field<ListGraphType<OrderType>>("oldOrders").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return orderService.OldOrders(context.GetArgument<long>("userId")); });

            //Field<OrderType>("order").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "orderId" })).
            //    Resolve(context => { return orderService.GetOrderById(context.GetArgument<long>("orderId")); });

            FieldAsync<OrderType>(
                name: "order", 
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "orderId" }),
                resolve: async context =>
                {
                    return await orderService.GetOrder(context.GetArgument<long>("orderId"));
                }
                );


            FieldAsync<ListGraphType<OrderAdminType>>(
                name: "orders",
                resolve: async context =>
                {
                    return await orderService.GetOrders();
                }
                );

            FieldAsync<ListGraphType<OrderType>>(
                name: "undeliveredOrders",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }),
                resolve: async context =>
                {
                    return await orderService.GetUndeliveredOrders(context.GetArgument<long>("userId"));
                }
                );

            FieldAsync<ListGraphType<OrderType>>(
                name: "newOrders",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }),
                resolve: async context =>
                {
                    return await orderService.GetNewOrders(context.GetArgument<long>("userId"));
                }
                );

            FieldAsync<ListGraphType<OrderType>>(
                name: "oldOrders",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }),
                resolve: async context =>
                {
                    return await orderService.GetOldOrders(context.GetArgument<long>("userId"));
                }
                );

            FieldAsync<ListGraphType<OrderType>>(
                name: "userOrders",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }),
                resolve: async context =>
                {
                    return await orderService.GetUserOrders(context.GetArgument<long>("userId"));
                }
                );
        }
    }
}
