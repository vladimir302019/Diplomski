using WebShop.Models;

namespace WebShop.Repositories.IRepositories
{
    public interface IUserRepository
    {
        Task<List<User>> GetAll();
        Task<User> GetById(long id);
        Task<User> InsertUser(User user);
        void DeleteUser(long id);
        void UpdateUser(User user);
        Task<byte[]> GetUserImage(long id);
        Task ChangePassword(long id, string password);
        #region Non-async
        List<User> GetAllUsers();
        User GetUserById(long id);
        User InsertNewUser(User user);
        #endregion
    }
}
