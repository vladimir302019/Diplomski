using GraphQL.Types;
using WebShop.DTO.ArticleDTOs;

namespace WebShop.GraphQL.Types.ArticleTypes
{
    public class NewArticleType : ObjectGraphType<ArticleDTO>
    {
        public NewArticleType()
        {

        }
    }
}
