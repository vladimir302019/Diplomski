using GraphQL.Types;
using WebShop.GraphQL.Mutations;
using WebShop.GraphQL.Queries;

namespace WebShop.GraphQL.Schemas
{
    public class RootSchema : Schema
    {
        public RootSchema(IServiceProvider serviceProvider) : base(serviceProvider) 
        {
            Query = serviceProvider.GetRequiredService<RootQuery>();
            Mutation = serviceProvider.GetRequiredService<RootMutation>();
        }
    }
}
