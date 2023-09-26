using System.ComponentModel.DataAnnotations;

namespace WebShop.DTO.ArticleDTOs
{
    public class ArticleDTO
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        public double Price { get; set; }
        [Required]
        public int MaxQuantity { get; set; }
        [Required]
        public IFormFile FormFile { get; set; }
    }
}
