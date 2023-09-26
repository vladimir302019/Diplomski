using GraphQL;
using GraphQL.Types;
using System.Security.Claims;
using WebShop.Controllers;
using WebShop.DTO.ArticleDTOs;
using WebShop.GraphQL.Types.ArticleTypes;
using WebShop.Interfaces;
using WebShop.Models;
using WebShop.Repositories.IRepositories;

namespace WebShop.GraphQL.Queries.ArticleQueries
{
    public class ArticleQuery : ObjectGraphType
    {
        public ArticleQuery(IArticleService articleService)
        {
            //Field<ListGraphType<ArticleType>>("articles").Resolve(context => articleService.GetArticles());

            //Field<ArticleType>("article").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "articleId" }, new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return articleService.GetArticleById(context.GetArgument<long>("articleId"), context.GetArgument<long>("userId")); });

            //Field<ListGraphType<ArticleType>>("sellerArticles").
            //    Arguments(new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" })).
            //    Resolve(context => { return articleService.GetSellersArticles(context.GetArgument<long>("userId")); });

            FieldAsync<ListGraphType<ArticleGetType>>(
                name: "articles",
                resolve: async context =>
                {
                    return await articleService.GetAllArticles();
                }
                );

            FieldAsync<ListGraphType<ArticleGetType>>(
                name: "sellerArticles",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }),
                resolve: async context =>
                {
                    return await articleService.GetSellerArticles(context.GetArgument<long>("userId"));
                }
                );

            FieldAsync<ArticleType>(
                name: "article",
                arguments: new QueryArguments(new QueryArgument<LongGraphType> { Name = "userId" }, new QueryArgument<LongGraphType> { Name = "articleId" }),
                resolve: async context =>
                {
                    return await articleService.GetArticle(context.GetArgument<long>("articleId"), context.GetArgument<long>("userId"));
                }
                );
        }
    }
}
