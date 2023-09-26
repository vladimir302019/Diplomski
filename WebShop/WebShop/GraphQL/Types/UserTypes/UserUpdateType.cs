using GraphQL.Types;
using WebShop.DTO.UserDTOs;

namespace WebShop.GraphQL.Types.UserTypes
{
    public class UserUpdateType : ObjectGraphType<UserUpdateDTO>
    {
        public UserUpdateType()
        {
            Field(u => u.FullName);
            Field(u => u.Username);
            Field(u => u.Email);
            Field<StringGraphType>("birthDate", resolve: context => context.Source.BirthDate.ToShortDateString());
            Field(u => u.Address);

        }
    }
}
