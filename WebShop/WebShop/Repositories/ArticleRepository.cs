using Microsoft.EntityFrameworkCore;
using WebShop.DBConfiguration;
using WebShop.Models;
using WebShop.Repositories.IRepositories;

namespace WebShop.Repositories
{
    public class ArticleRepository : IArticleRepository
    {
        private readonly WebShopDbContext _context;
        public ArticleRepository(WebShopDbContext webShopDbContext) { _context = webShopDbContext; }
        public void DeleteArticle(long id)
        {
            _context.Articles.Remove(_context.Articles.Find(id));
        }

        public async Task<byte[]> GetArticleImage(long id)
        {
            Article article = await _context.Articles.FindAsync(id);
            return article.PhotoUrl;
        }

        public async Task<List<Article>> GetAll()
        {
            return await _context.Articles.ToListAsync();
        }

        public async Task<Article> GetById(long id)
        {
            return await _context.Articles.FindAsync(id);
        }

        public async Task<List<Article>> GetSellerArticles(long id)
        {
            return await _context.Articles.Where(a => a.SellerId == id).ToListAsync();
        }

        public async Task<Article> InsertArticle(Article article)
        {
            await _context.Articles.AddAsync(article);
            return article;
        }

        public void UpdateArticle(Article article)
        {
            Article newArticle = _context.Articles.Find(article.Id);
            newArticle = article;
            _context.Articles.Update(newArticle);
        }
        #region Non-async
        public List<Article> GetArticles()
        {
            return _context.Articles.ToList();
        }
        public List<Article> GetSellersArticles(long id)
        {
            return  _context.Articles.Where(a => a.SellerId == id).ToList();
        }

        public Article GetArticleById(long id)
        {
            return _context.Articles.Find(id);
        }

        public Article InsertArticles(Article article)
        {
            _context.Articles.Add(article);
            return article;
        }
        #endregion
    }
}
