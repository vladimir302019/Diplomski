using System.Security.Claims;
using System.Text;
using WebShop.DTO.UserDTOs;
using WebShop.Interfaces;
using WebShop.Models.Enums;
using WebShop.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using AutoMapper;
using WebShop.Repositories.IRepositories;
using WebShop.Services.EmailServices;
using WebShop.ExceptionHandler.Exceptions;
using System.Runtime;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Runtime.Intrinsics.X86;
using Org.BouncyCastle.Crypto.Paddings;

namespace WebShop.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfigurationSection _secretKey;
        private readonly IConfigurationSection _googleClientId;
        private readonly IEmailService _emailService;

        public UserService(IMapper mapper, IUnitOfWork unit, IConfiguration configuration, IEmailService emailService)
        {
            _mapper = mapper;
            _unitOfWork = unit;
            _secretKey = configuration.GetSection("SecretKey");
            _emailService = emailService;
            _googleClientId = configuration.GetSection("GoogleClientId");
        }

        public async Task<UserDTO> ActivateUser(long id, bool activate)
        {
            var user = await _unitOfWork.UserRepository.GetById(id);

            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            if (activate)
            {
                user.Approved = true;

                var emailAddress = user.Email;
                var message = new Message(new string[] { $"{emailAddress}" }, "Profile activation", "Your profile is now active! WebShop App.");
                await _emailService.SendEmail(message);
            }
            else
            {
                user.Denied = true;
                var emailAddress = user.Email;
                var message = new Message(new string[] { $"{emailAddress}" }, "Profile activation", "Your profile activation has been rejected. WebShop App.");
                await _emailService.SendEmail(message);
            }

            _unitOfWork.UserRepository.UpdateUser(user);
            await _unitOfWork.Save();
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<TokenDTO> ExternalLogin(string token)
        {
            ExternalUserDTO externalUser = await VerifyGoogleToken(token);
            if(externalUser == null) { throw new ConflictException("Invalid user google token."); }

            List<User> users = await _unitOfWork.UserRepository.GetAll();
            User user = users.Find(u => u.Email.Equals(externalUser.Email));

            if(user == null)
            {
                user = new User()
                {
                    FullName = externalUser.Name,
                    Username = externalUser.UserName,
                    Email = externalUser.Email,
                    ProfilePictureUrl = new byte[0],
                    Password = "",
                    Address = "",
                    BirthDate = DateTime.Now,
                    Type = UserType.BUYER,
                    Approved = true
                };

                await _unitOfWork.UserRepository.InsertUser(user);
                await _unitOfWork.Save();
            }

            List<Claim> userClaims = new List<Claim>();

            userClaims.Add(new Claim(ClaimTypes.Role, "BUYER"));
            
            userClaims.Add(new Claim(ClaimTypes.Name, user.Id.ToString()));

            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
            var signinCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var tokenOptions = new JwtSecurityToken(
                issuer: "https://localhost:44304",
                claims: userClaims,
                expires: DateTime.Now.AddMinutes(20),
                signingCredentials: signinCredentials
                );
            string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            return new TokenDTO()
            {
                Token = tokenString,
                Role = user.Type.ToString(),
                UserId = user.Id
            };
        }

        public async Task<List<UserDTO>> GetAllUnactivatedSellers()
        {
            List<User> list = await _unitOfWork.UserRepository.GetAll();
            return _mapper.Map<List<UserDTO>>(list.Where(u => u.Approved == false && u.Denied == false && u.Type == UserType.SELLER).ToList());
        }

        public async Task<List<UserDTO>> GetSellers()
        {
            List<User> list = await _unitOfWork.UserRepository.GetAll();
            return _mapper.Map<List<UserDTO>>(list.Where(u => u.Type == UserType.SELLER).ToList());
        }

        public async Task<UserDTO> GetUser(long id)
        {
            var user = await _unitOfWork.UserRepository.GetById(id);
            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            return _mapper.Map<UserDTO>(user);
        }

        public long GetUserIdFromToken(ClaimsPrincipal user)
        {
            long id;
            long.TryParse(user.Identity.Name, out id);
            return id;
        }

        public async Task<TokenDTO> Login(UserLoginDTO user)
        {
            List<User> list = await _unitOfWork.UserRepository.GetAll();
            User user1 = list.Find(u => u.Email == user.Email);

            if (user1 == null) { throw new NotFoundException($"User with Email: {user.Email} doesn't exist."); }

            if (BCrypt.Net.BCrypt.Verify(user.Password, user1.Password))
            {
                List<Claim> userClaims = new List<Claim>();

                if (user1.Type.ToString() == "ADMIN")
                {
                    userClaims.Add(new Claim(ClaimTypes.Role, "ADMIN"));
                }
                if (user1.Type.ToString() == "SELLER")
                {
                    userClaims.Add(new Claim(ClaimTypes.Role, "SELLER"));
                }
                if (user1.Type.ToString() == "BUYER")
                {
                    userClaims.Add(new Claim(ClaimTypes.Role, "BUYER"));
                }
                userClaims.Add(new Claim(ClaimTypes.Name, user1.Id.ToString()));

                SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey.Value));
                var signinCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
                var tokenOptions = new JwtSecurityToken(
                    issuer: "https://localhost:44304",
                    claims: userClaims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                    );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
                return new TokenDTO()
                {
                    Token = tokenString,
                    Role = user1.Type.ToString(),
                    UserId = user1.Id
                };
            }
            else throw new ConflictException("Password doesn't match.");
        }

        public async Task<UserDTO> Register(UserRegisterDTO user)
        {
            List<User> list = await _unitOfWork.UserRepository.GetAll();
            User user1 = list.Find(u => u.Email == user.Email);
            if (user1 != null) { throw new ConflictException($"User with Email: {user.Email} already exists."); }

            User newUser = _mapper.Map<User>(user);
            newUser.Password = BCrypt.Net.BCrypt.HashPassword(newUser.Password);

            if (newUser.Type.ToString() == "SELLER")
            {
                newUser.Approved = false;
            }
            else
            {
                newUser.Approved = true;
            }
            newUser.ProfilePictureUrl = new byte[0];
            newUser.Denied = false;
            await _unitOfWork.UserRepository.InsertUser(newUser);

            await _unitOfWork.Save();

            return _mapper.Map<UserDTO>(newUser);
        }

        public async Task<UserUpdateDTO> UpdateUser(long id, UserUpdateDTO user)
        {
            User u = await _unitOfWork.UserRepository.GetById(id);
            if (u == null) { throw new NotFoundException("User doesn't exist."); }

            var password = u.Password;
            var type = u.Type;
            var profilePicUrl = u.ProfilePictureUrl;
            var approved = u.Approved;
            List<User> list = await _unitOfWork.UserRepository.GetAll();
            User user1 = list.Find(u => u.Email == user.Email && u.Id != id);
            if (user1 != null) { throw new ConflictException($"User with Email: {user.Email} already exists."); }
            
            u = _mapper.Map<User>(user);
            u.Password = password;
            u.Type = type;
            u.ProfilePictureUrl = profilePicUrl;
            u.Id = id;
            u.Approved = approved;

            _unitOfWork.UserRepository.UpdateUser(u);
            await _unitOfWork.Save();
            return _mapper.Map<UserUpdateDTO>(u);
            
        }

        public async Task UploadImage(long id, IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetById(id) ?? throw new NotFoundException("User doesn't exist.");

            using(var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();

                user.ProfilePictureUrl = fileBytes;
                _unitOfWork.UserRepository.UpdateUser(user);
            }
            await _unitOfWork.Save();
        }

        private async Task<ExternalUserDTO> VerifyGoogleToken(string externalLoginToken)
        {
            try
            {
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings()
                {
                    Audience = new List<string>() { _googleClientId.Value }
                };

                var googleUserInfo = await GoogleJsonWebSignature.ValidateAsync(externalLoginToken, validationSettings);

                ExternalUserDTO externalUser = new ExternalUserDTO()
                {
                    UserName = googleUserInfo.Email.Split("@")[0],
                    Name = googleUserInfo.Name,
                    Email = googleUserInfo.Email
                };

                return externalUser;
            }
            catch
            {
                return null;
            }
        }

        public async Task<UserImageDTO> GetUserImage(long id)
        {
            var user = await _unitOfWork.UserRepository.GetById(id) ?? throw new NotFoundException("User doesn't exist.");

            byte[] imageBytes = await _unitOfWork.UserRepository.GetUserImage(user.Id);

            UserImageDTO userImage = new UserImageDTO()
            {
                ImageBytes = imageBytes
            };
            return userImage;
        }

        public async Task ChangePassword(long id, string oldPassword, string newPassword)
        {
            var user = await _unitOfWork.UserRepository.GetById(id) ?? throw new NotFoundException("User doesn't exist.");

            if (BCrypt.Net.BCrypt.Verify(oldPassword, user.Password )) {
                await _unitOfWork.UserRepository.ChangePassword(id, BCrypt.Net.BCrypt.HashPassword(newPassword));
                await _unitOfWork.Save();
            }
            else
            {
                throw new ConflictException("Password doesn't match with the current one!");
            }
        }

        #region Non-async
        public List<User> GetActiveSellers()
        {
            List<User> list = _unitOfWork.UserRepository.GetAllUsers();
            return _mapper.Map<List<User>>(list.Where(u => u.Type == UserType.SELLER).ToList());

        }
        public List<User> GetUnactiveSellers()
        {
            List<User> list = _unitOfWork.UserRepository.GetAllUsers();
            return _mapper.Map<List<User>>(list.Where(u => u.Approved == false && u.Denied == false && u.Type == UserType.SELLER).ToList());

        }
        public User GetUserById(long id)
        {
            var user = _unitOfWork.UserRepository.GetUserById(id);
            if (user == null) { throw new NotFoundException("User doesn't exist."); }
            return _mapper.Map<User>(user);
        }

        #endregion

        public long GetIdFromToken(string token)
        {
            long id;
            long.TryParse(ClaimsPrincipal.Current.Identity.Name, out id);

            return id;
        }
    }
}
