using WebShop.Models.Enums;

namespace WebShop.DTO.UserDTOs
{
    public class UserDTO
    {
        public long Id { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public DateTime BirthDate { get; set; }
        public string Address { get; set; }
        public UserType Type { get; set; }
        public bool Approved { get; set; }
        public bool Denied { get; set; }
    }
}
