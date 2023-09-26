using GraphQL;
using GraphQL.Types;
using GraphQL.Upload.AspNetCore;
using WebShop.DTO.UserDTOs;
using WebShop.GraphQL.Types.UserTypes;
using WebShop.Interfaces;

namespace WebShop.GraphQL.Mutations
{
    public class UserMutations : ObjectGraphType
    {
        public UserMutations(IUserService userService)
        {
            FieldAsync<UserUpdateType>(
                name: "update",
                arguments: new QueryArguments(
                    new QueryArgument<LongGraphType>() { Name = "id" },
                    new QueryArgument<StringGraphType>() { Name= "fullname" },
                    new QueryArgument<StringGraphType>() { Name = "username" },
                    new QueryArgument<StringGraphType>() { Name = "address" },
                    new QueryArgument<StringGraphType>() { Name = "email" },
                    new QueryArgument<DateGraphType>() { Name = "birthDate" }
                    ),
                resolve: async context =>
                {
                    long id = context.GetArgument<long>("id");
                    UserUpdateDTO userUpdateDTO = new UserUpdateDTO()
                    {
                        FullName = context.GetArgument<string>("fullname"),
                        Username = context.GetArgument<string>("username"),
                        Address = context.GetArgument<string>("address"),
                        Email = context.GetArgument<string>("email"),
                        BirthDate = context.GetArgument<DateTime>("birthDate")
                    };

                    userUpdateDTO = await userService.UpdateUser(id, userUpdateDTO);
                    return userUpdateDTO;
                }
                );

            //FieldAsync<LongGraphType>(
            //    name: "uploadImg",
            //    arguments: new QueryArguments(
            //        new QueryArgument<NonNullGraphType<LongGraphType>> { Name = "id" },
            //        new QueryArgument<NonNullGraphType<UploadGraphType>> { Name = "file" }),
            //    resolve: async context =>
            //    {
            //        await userService.UploadImage(context.GetArgument<long>("id"),
            //            context.GetArgument<IFormFile>("file"));
            //        return context.GetArgument<long>("id");
            //    });
        }
    }
}
