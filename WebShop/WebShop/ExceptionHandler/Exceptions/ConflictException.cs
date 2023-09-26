using System.Net;

namespace WebShop.ExceptionHandler.Exceptions
{
    public class ConflictException : CustomException
    {
        public ConflictException(string message) : base(message, null, HttpStatusCode.Conflict)
        {
        }
    }
}
