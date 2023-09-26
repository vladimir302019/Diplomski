using GraphQL;
using GraphQL.Types;
using System.Reflection.Metadata.Ecma335;
using WebShop.GraphQL.Types.UserTypes;
using WebShop.Interfaces;

namespace WebShop.GraphQL.Queries.UserQueries
{
    public class UserQuery : ObjectGraphType
    {
        public UserQuery(IUserService userService) 
        {
            //Field<ListGraphType<UserType>>("activesellers").Resolve(context => { return userService.GetActiveSellers(); });

            //Field<ListGraphType<UserType>>("unactivesellers").Resolve(context => { return userService.GetUnactiveSellers(); });

            //Field<UserType>("user").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "id"})).
            //    Resolve(context => { return userService.GetUserById(context.GetArgument<long>("id")); });

            FieldAsync<ListGraphType<UserType>>(
                name: "activesellers",
                resolve: async context =>
                {
                    return await userService.GetSellers();
                }
                );
            FieldAsync<ListGraphType<UserType>>(
                name: "unactivesellers",
                resolve: async context =>
                {
                    return await userService.GetAllUnactivatedSellers();
                }
                );
            FieldAsync<ListGraphType<UserType>>(
                name: "user",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "id" }),
                resolve: async context =>
                {
                    return await userService.GetUser(context.GetArgument<long>("id"));
                }
                );
        }
    }
}
