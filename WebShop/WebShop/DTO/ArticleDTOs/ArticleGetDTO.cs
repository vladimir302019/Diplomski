using WebShop.Models;

namespace WebShop.DTO.ArticleDTOs
{
    public class ArticleGetDTO
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public int MaxQuantity { get; set; }
        public byte[] PhotoUrl { get; set; }
    }
}
