using Microsoft.EntityFrameworkCore;
using WebShop.DBConfiguration;
using WebShop.Models;
using WebShop.Repositories.IRepositories;

namespace WebShop.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly WebShopDbContext _context;
        public UserRepository(WebShopDbContext webShopDbContext) { _context = webShopDbContext; }

        public async Task ChangePassword(long id, string password)
        {
            User user = await _context.Users.FindAsync(id);
            user.Password = password;
            _context.Users.Update(user);
        }
        public void DeleteUser(long id)
        {
            _context.Users.Remove(_context.Users.Find(id));
        }
        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }
        public async Task<User> GetById(long id)
        {
            return await _context.Users.FirstOrDefaultAsync(x=> x.Id == id);
        }
        public async Task<byte[]> GetUserImage(long id)
        {
            User user = await _context.Users.FindAsync(id);
            return user.ProfilePictureUrl;
        }
        public async Task<User> InsertUser(User user)
        {
            await _context.Users.AddAsync(user);
            return user;
        }
        public void UpdateUser(User user)
        {
            User newUser = _context.Users.Find(user.Id);
            newUser = user;
            _context.Users.Update(newUser);
        }

        #region Non-async
        public List<User> GetAllUsers()
        {
            return _context.Users.ToList();
        }
        public User InsertNewUser(User user)
        {
            _context.Users.Add(user);
            return user;
        }

        public User GetUserById(long id)
        {
            return  _context.Users.FirstOrDefault(x => x.Id == id);
        }
        #endregion
    }
}
