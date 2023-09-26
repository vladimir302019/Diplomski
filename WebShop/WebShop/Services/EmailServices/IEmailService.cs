using WebShop.Services.EmailServices;

namespace WebShop.Services.EmailServices
{
    public interface IEmailService
    {
        Task SendEmail(Message message);
    }
}
