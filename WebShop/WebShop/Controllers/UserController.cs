using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using WebShop.DTO.UserDTOs;
using WebShop.Interfaces;

namespace WebShop.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO registerDTO)
        {
            UserDTO user = await _userService.Register(registerDTO);
            return Ok(user);
        }
        [HttpPost("login")]

        public async Task<IActionResult> Login([FromBody] UserLoginDTO loginDTO)
        {
            TokenDTO token = await _userService.Login(loginDTO);
            return Ok(token);
        }

        [HttpPost("external-login")]
        public async Task<IActionResult> ExternalLogin([FromForm] string googleToken)
        {
            TokenDTO token = await _userService.ExternalLogin(googleToken);
            return Ok(token);
        }

        [HttpGet("user")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> GetUser()
        {
            UserDTO userDTO = await _userService.GetUser(_userService.GetUserIdFromToken(User));
            return Ok(userDTO);

        }

        [HttpGet("activated-sellers")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetActivatedSellers()
        {
            return Ok(await _userService.GetSellers());

        }

        [HttpGet("unactivated-sellers")]
        [Authorize(Roles = "ADMIN")]

        public async Task<IActionResult> GetUnactivatedSellers()
        {
            return Ok(await _userService.GetAllUnactivatedSellers());

        }
        
        [HttpPut("update-profile")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserUpdateDTO user)
        {
            return Ok(await _userService.UpdateUser(_userService.GetUserIdFromToken(User), user));

        }
        
        [HttpPut("activate-user")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> ActivateUser([FromBody] ActivateUserDTO user)
        {
            return Ok(await _userService.ActivateUser(user.Id, user.IsActive));

        }

        [HttpPut("upload-image")]
        [Consumes("multipart/form-data")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            await _userService.UploadImage(_userService.GetUserIdFromToken(User), file);
            return Ok();
        }

        [HttpGet("get-image")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> GetImage()
        {
            UserImageDTO userDTO = await _userService.GetUserImage(_userService.GetUserIdFromToken(User));
            return Ok(userDTO);
        }

        [HttpPost("change-password")]
        [Authorize(Roles = "ADMIN, BUYER, SELLER")]
        public async Task<IActionResult> ChangePassword([FromForm] UserPasswordDTO userPasswordDTO)
        {
            await _userService.ChangePassword(_userService.GetUserIdFromToken(User), userPasswordDTO.OldPassword, userPasswordDTO.NewPassword);
            return Ok();
        }
    }
}
