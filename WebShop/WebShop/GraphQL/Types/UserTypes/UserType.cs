using GraphQL.Types;
using WebShop.DTO.UserDTOs;
using WebShop.Models;
using WebShop.Models.Enums;

namespace WebShop.GraphQL.Types.UserTypes
{
    public class UserType : ObjectGraphType<UserDTO>
    {
        public UserType()
        {
            Field(u => u.Id);
            Field(u => u.FullName);
            Field(u => u.Username);
            Field(u => u.Email);
            Field<StringGraphType>("birthDate", resolve: context => context.Source.BirthDate.ToShortDateString());
            Field(u => u.Address);
            Field<StringGraphType>("type", resolve: context => context.Source.Type.ToString());
            Field(u => u.Approved);
            Field(u => u.Denied);
        }

        private string ConvertByteArrToString(byte[] byteArr)
        {
            if (byteArr == null || byteArr.Length == 0)
            {
                return null; // Handle the case where the byte array is null or empty.
            }

            // Convert the byte array to a Base64-encoded string.
            string base64String = Convert.ToBase64String(byteArr);

            return base64String;
        }
    }
}
