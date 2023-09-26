using GraphQL.Types;

namespace WebShop.GraphQL.Mutations
{
    public class RootMutation : ObjectGraphType
    {
        public RootMutation()
        {
            Field<UserMutations>("userMutation", resolve: context => new { });
            Field<ArticleMutations>("articleMutation", resolve: context => new { });
            Field<OrderMutations>("orderMutation", resolve: context => new { });
        }
    }
}
