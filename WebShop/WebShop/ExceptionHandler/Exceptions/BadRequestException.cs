using System.Net;

namespace WebShop.ExceptionHandler.Exceptions
{
    public class BadRequestException : CustomException
    {
        public BadRequestException(string message) : base(message, null, HttpStatusCode.BadRequest)
        {
        }
    }
}
