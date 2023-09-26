using System.Net;

namespace WebShop.ExceptionHandler.Exceptions
{
    public class InternalServerException : CustomException
    {
        public InternalServerException(string message, List<string>? errorMessages = default) : base(message, errorMessages, HttpStatusCode.InternalServerError)
        {
        }
    }
}
