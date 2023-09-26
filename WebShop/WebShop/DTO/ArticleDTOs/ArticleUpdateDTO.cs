using System.ComponentModel.DataAnnotations;

namespace WebShop.DTO.ArticleDTOs
{
    public class ArticleUpdateDTO
    {
        public long Id { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int MaxQuantity { get; set; }
    }
}
