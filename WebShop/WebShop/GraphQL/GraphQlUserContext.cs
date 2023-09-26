using System.Security.Claims;

namespace WebShop.GraphQL
{
    public class GraphQlUserContext : Dictionary<string, object>
    {
        public ClaimsPrincipal User { get; set; }
    }
}
