using GraphQL.Types;
using WebShop.GraphQL.Queries.ArticleQueries;
using WebShop.GraphQL.Queries.OrderQueries;
using WebShop.GraphQL.Queries.UserQueries;

namespace WebShop.GraphQL.Queries
{
    public class RootQuery : ObjectGraphType
    {
        public RootQuery()
        {
            Field<UserQuery>("userQuery", resolve: context => new { });
            Field<ArticleQuery>("articleQuery", resolve: context => new { });
            Field<OrderQuery>("orderQuery", resolve: context => new { });
        }
    }
}
