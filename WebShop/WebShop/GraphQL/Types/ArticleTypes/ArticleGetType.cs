using GraphQL.Types;
using WebShop.DTO.ArticleDTOs;

namespace WebShop.GraphQL.Types.ArticleTypes
{
    public class ArticleGetType : ObjectGraphType<ArticleGetDTO>
    {
        public ArticleGetType()
        {
            Field(a => a.Id);
            Field(a => a.Name);
            Field(a => a.Description);
            Field(a => a.Price, type: typeof(DecimalGraphType));
            Field(a => a.MaxQuantity, type: typeof(IntGraphType));
            Field<StringGraphType>("photoUrl", resolve: context => ConvertByteArrToString(context.Source.PhotoUrl));

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
