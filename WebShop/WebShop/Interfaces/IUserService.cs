using System.Security.Claims;
using WebShop.DTO.UserDTOs;
using WebShop.Models;

namespace WebShop.Interfaces
{
    public interface IUserService
    {
        Task<TokenDTO> Login(UserLoginDTO user);
        Task<UserDTO> Register(UserRegisterDTO user);
        Task<List<UserDTO>> GetSellers();
        Task<List<UserDTO>> GetAllUnactivatedSellers();
        Task<UserDTO> GetUser(long id);
        Task<UserUpdateDTO> UpdateUser(long id, UserUpdateDTO user);
        Task<UserDTO> ActivateUser(long id, bool activate);
        long GetUserIdFromToken(ClaimsPrincipal user);
        Task<TokenDTO> ExternalLogin(string token);
        Task UploadImage(long id, IFormFile file);
        Task<UserImageDTO> GetUserImage(long id);
        Task ChangePassword(long id, string oldPassword, string newPassword);
        long GetIdFromToken(string token);
        #region Non-async
        List<User> GetActiveSellers();
        List<User> GetUnactiveSellers();
        User GetUserById(long id);
        #endregion

    }
}
