using WebShop.DTO.ArticleDTOs;
using WebShop.DTO.OrderDTOs;
using WebShop.DTO.UserDTOs;
using WebShop.Models;
using AutoMapper;

namespace WebShop.Mapping 
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDTO>().ReverseMap();
            CreateMap<User, UserLoginDTO>().ReverseMap();
            CreateMap<User, UserRegisterDTO>().ReverseMap();
            CreateMap<User, ActivateUserDTO>().ReverseMap();
            CreateMap<User, UserUpdateDTO>().ReverseMap();
            CreateMap<User, ExternalUserDTO>().ReverseMap();
            CreateMap<User, UserImageDTO>().ReverseMap();
            CreateMap<User, UserPasswordDTO>().ReverseMap();

            CreateMap<Order, OrderDTO>().ReverseMap();
            CreateMap<Order, OrderAllDTO>().ReverseMap();
            CreateMap<Order, OrderAdminDTO>().ReverseMap();

            CreateMap<OrderItem, OrderItemsDTO>().ReverseMap();
            CreateMap<OrderItem, OrderItemDTO>().ReverseMap();

            CreateMap<Article, ArticleDTO>().ReverseMap();
            CreateMap<Article, ArticleUpdateDTO>().ReverseMap();
            CreateMap<Article, ArticleImageDTO>().ReverseMap();
            CreateMap<Article, ArticleGetDTO>().ReverseMap();
            CreateMap<Article, ArticleUploadImageDTO>().ReverseMap();
        }
    }
}
