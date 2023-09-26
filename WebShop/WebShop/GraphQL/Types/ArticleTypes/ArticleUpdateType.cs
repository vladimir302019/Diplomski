using GraphQL.Types;
using WebShop.DTO.ArticleDTOs;

namespace WebShop.GraphQL.Types.ArticleTypes
{
    public class ArticleUpdateType : ObjectGraphType<ArticleUpdateDTO>
    {
        public ArticleUpdateType()
        {
            Field(a => a.Id);
            Field(a => a.Description);
            Field(a => a.Price, type: typeof(DecimalGraphType));
            Field(a => a.MaxQuantity, type: typeof(IntGraphType));
        }
    }
}
