using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebShop.DTO.ArticleDTOs;
using WebShop.DTO.UserDTOs;
using WebShop.Interfaces;
using WebShop.Repositories.IRepositories;

namespace WebShop.Controllers
{
    [Route("api/article")]
    [ApiController]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleService _articleService;
        private readonly IUserService _userService;

        public ArticleController(IArticleService articleService, IUserService userService)
        {
            _articleService = articleService;
            _userService = userService;
        }

        [HttpGet("get")]
        [Authorize]
        public async Task<IActionResult> Get([FromBody] long id)
        {
            return Ok(await _articleService.GetArticle(id, _userService.GetUserIdFromToken(User)));
        }

        [HttpGet("get-all")]
        [Authorize(Roles = "BUYER, ADMIN")]
        public async Task<IActionResult> GetAll()
        {
            List<ArticleGetDTO> articleDTOs = await _articleService.GetAllArticles();
            return Ok(articleDTOs);
        }

        [HttpPut("new-article")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> NewArticle([FromForm] ArticleDTO articleDTO)
        {
            return Ok(await _articleService.AddNewArticle(articleDTO, _userService.GetUserIdFromToken(User)));
        }

        [HttpPut("update-article")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> UpdateArticle([FromBody] ArticleUpdateDTO articleDTO)
        {
            return Ok(await _articleService.UpdateArticle(articleDTO.Id, articleDTO));
        }

        [HttpPut("delete")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> DeleteArticle([FromForm] long id)
        {
            return Ok(await _articleService.DeleteArticle(id));
        }

        [HttpGet("seller-get")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> GetSellerArticles()
        {
            return Ok(await _articleService.GetSellerArticles(_userService.GetUserIdFromToken(User)));
        }

        [HttpPut("upload-image")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "SELLER")]
        public async Task<IActionResult> UploadImage([FromForm] ArticleUploadImageDTO article)
        {
            await _articleService.UploadImage(article.Id, article.File);
            return Ok();
        }

        [HttpGet("get-image")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> GetImage(long id)
        {
            ArticleImageDTO articleDTO = await _articleService.GetArticleImage(id);
            return Ok(articleDTO);
        }
    }
}
