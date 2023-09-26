using GraphQL;
using GraphQL.Types;
using WebShop.DTO.ArticleDTOs;
using WebShop.GraphQL.Types.ArticleTypes;
using WebShop.Interfaces;

namespace WebShop.GraphQL.Mutations
{
    public class ArticleMutations : ObjectGraphType
    {
        public ArticleMutations(IArticleService articleService) 
        {
            FieldAsync<ArticleUpdateType>(
                name: "updateArticle",
                arguments: new QueryArguments(
                    new QueryArgument<NonNullGraphType<LongGraphType>>() { Name = "id"},
                    new QueryArgument<NonNullGraphType<StringGraphType>>() { Name = "description" },
                    new QueryArgument<NonNullGraphType<DecimalGraphType>>() { Name = "price" },
                    new QueryArgument<NonNullGraphType<IntGraphType>>() { Name = "maxQuantity" }
                    ),
                resolve: async context =>
                {
                    ArticleUpdateDTO articleUpdateDTO = new ArticleUpdateDTO()
                    {
                        Description = context.GetArgument<string>("description"),
                        MaxQuantity = context.GetArgument<int>("maxQuantity"),
                        Price = context.GetArgument<double>("price"),
                        Id = context.GetArgument<long>("id")
                    };

                    articleUpdateDTO = await articleService.UpdateArticle(articleUpdateDTO.Id, articleUpdateDTO);
                    return articleUpdateDTO;
                }
                );

            FieldAsync<BooleanGraphType>(
                name: "deleteArticle",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<LongGraphType>>() { Name = "id" }),
                resolve: async context =>
                {
                    return await articleService.DeleteArticle(context.GetArgument<long>("id"));
                }
                );
        }
    }
}
