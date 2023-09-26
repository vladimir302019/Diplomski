using AutoMapper;
using WebShop.DTO.ArticleDTOs;
using WebShop.DTO.UserDTOs;
using WebShop.ExceptionHandler.Exceptions;
using WebShop.Interfaces;
using WebShop.Models;
using WebShop.Models.Enums;
using WebShop.Repositories.IRepositories;

namespace WebShop.Services
{
    public class ArticleService : IArticleService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ArticleService(IMapper mapper, IUnitOfWork unit)
        {
            _mapper = mapper;
            _unitOfWork = unit;
        }

        public async Task<ArticleDTO> AddNewArticle(ArticleDTO newArticle, long sellerId)
        {
            List<Article> list = await _unitOfWork.ArticleRepository.GetAll();
            var article = list.Find(a => a.Name == newArticle.Name);
            if (article != null) { throw new ConflictException($"Article with Name: {newArticle.Name} already exists."); }

            var seller = await _unitOfWork.UserRepository.GetById(sellerId);
            if (seller == null) { throw new NotFoundException("User doesn't exist."); }

            if (!seller.Approved)
            {
                throw new ConflictException("SELLER isn't approved. Wait for admin approval!");
            }

            article = _mapper.Map<Article>(newArticle);
            using (var ms = new MemoryStream())
            {
                newArticle.FormFile.CopyTo(ms);
                var fileBytes = ms.ToArray();

                article.PhotoUrl = fileBytes;
                _unitOfWork.ArticleRepository.UpdateArticle(article);
            }
            article.SellerId = sellerId;
            await _unitOfWork.ArticleRepository.InsertArticle(article);
            await _unitOfWork.Save();
            return _mapper.Map<ArticleDTO>(article);
        }
        public async Task<bool> DeleteArticle(long id)
        {
            var article = await _unitOfWork.ArticleRepository.GetById(id);
            if (article == null) { return false; }
            else
            {
                _unitOfWork.ArticleRepository.DeleteArticle(article.Id);
                await _unitOfWork.Save();
                return true;
            }
        }
        public async Task<List<ArticleGetDTO>> GetAllArticles()
        {
            return _mapper.Map<List<ArticleGetDTO>>(await _unitOfWork.ArticleRepository.GetAll());
        }
        public async Task<ArticleDTO> GetArticle(long id, long userId)
        {
            var article = await _unitOfWork.ArticleRepository.GetById(id);
            if (article == null) { throw new NotFoundException("Article doesn't exist."); }

            User user = await _unitOfWork.UserRepository.GetById(userId);
            if(user.Type == UserType.BUYER)
            {
                return _mapper.Map<ArticleDTO>(article);
            }
            if(user.Type == UserType.SELLER && user.Id == article.SellerId) 
            {
                return _mapper.Map<ArticleDTO>(article);
            }
            else
            {
                throw new ConflictException("Article not available.");
            }
        }
        public async Task<ArticleImageDTO> GetArticleImage(long id)
        {
            var article = await _unitOfWork.ArticleRepository.GetById(id) ?? throw new NotFoundException("Article doesn't exist.");

            byte[] imageBytes = await _unitOfWork.ArticleRepository.GetArticleImage(article.Id);

            ArticleImageDTO articleImage = new ArticleImageDTO()
            {
                ImageBytes = imageBytes
            };
            return articleImage;
        }
        public async Task<List<ArticleGetDTO>> GetSellerArticles(long id)
        {
            var seller = await _unitOfWork.UserRepository.GetById(id);
            if (seller == null) { throw new NotFoundException("User doesn't exist."); }
            if (!seller.Approved)
            {
                throw new ConflictException("SELLER isn't approved. Wait for admin approval!");
            }
            else return _mapper.Map<List<ArticleGetDTO>>(await _unitOfWork.ArticleRepository.GetSellerArticles(id));
        }
        public async Task<ArticleUpdateDTO> UpdateArticle(long id, ArticleUpdateDTO newArticle)
        {
            var article = await _unitOfWork.ArticleRepository.GetById(id);
            if (article == null) { throw new NotFoundException("Article doesn't exist."); }

            string name = article.Name;
            long ids = article.SellerId;

            var photo = article.PhotoUrl;
            article = _mapper.Map<Article>(newArticle);
            article.Name = name;
            article.SellerId = ids;
            article.PhotoUrl = photo;

            _unitOfWork.ArticleRepository.UpdateArticle(article);
            await _unitOfWork.Save();
            return _mapper.Map<ArticleUpdateDTO>(article);
        }
        public async Task UploadImage(long id, IFormFile file)
        {
            var article = await _unitOfWork.ArticleRepository.GetById(id);
            if (article == null) { throw new NotFoundException("Article doesn't exist."); }

            using(var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();

                article.PhotoUrl = fileBytes;
                _unitOfWork.ArticleRepository.UpdateArticle(article);
            }
            await _unitOfWork.Save();
        }

        #region Non-async
        public List<Article> GetSellersArticles(long id)
        {
            var seller = _unitOfWork.UserRepository.GetUserById(id);
            if (seller == null) { throw new NotFoundException("User doesn't exist."); }
            if (!seller.Approved)
            {
                throw new ConflictException("SELLER isn't approved. Wait for admin approval!");
            }
            else return _mapper.Map<List<Article>>(_unitOfWork.ArticleRepository.GetSellersArticles(id));

        }

        public List<Article> GetArticles()
        {
            return _mapper.Map<List<Article>>(_unitOfWork.ArticleRepository.GetArticles());
        }

        public Article InsertArticles(ArticleDTO newArticle, long sellerId)
        {
            List<Article> list = _unitOfWork.ArticleRepository.GetArticles();
            var article = list.Find(a => a.Name == newArticle.Name);
            if (article != null) { throw new ConflictException($"Article with Name: {newArticle.Name} already exists."); }

            var seller = _unitOfWork.UserRepository.GetUserById(sellerId);
            if (seller == null) { throw new NotFoundException("User doesn't exist."); }

            if (!seller.Approved)
            {
                throw new ConflictException("SELLER isn't approved. Wait for admin approval!");
            }

            article = _mapper.Map<Article>(newArticle);
            using (var ms = new MemoryStream())
            {
                newArticle.FormFile.CopyTo(ms);
                var fileBytes = ms.ToArray();

                article.PhotoUrl = fileBytes;
                _unitOfWork.ArticleRepository.UpdateArticle(article);
            }
            article.SellerId = sellerId;
            _unitOfWork.ArticleRepository.InsertArticles(article);
            _unitOfWork.Save();
            return _mapper.Map<Article>(article);
        }

        public Article GetArticleById(long id, long userId)
        {
            var article = _unitOfWork.ArticleRepository.GetArticleById(id);
            if (article == null) { throw new NotFoundException("Article doesn't exist."); }

            User user = _unitOfWork.UserRepository.GetUserById(userId);
            if (user.Type == UserType.BUYER)
            {
                return _mapper.Map<Article>(article);
            }
            if (user.Type == UserType.SELLER && user.Id == article.SellerId)
            {
                return _mapper.Map<Article>(article);
            }
            else
            {
                throw new ConflictException("Article not available.");
            }
        }
        #endregion
    }
}
