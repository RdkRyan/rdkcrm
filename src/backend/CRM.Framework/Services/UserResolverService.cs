using CRM.Domain.Contracts.Services;
using Microsoft.AspNetCore.Http;

namespace CRM.Framework.Services
{
    public class UserResolverService : IUserResolverService
    {
        private readonly IHttpContextAccessor _context;
        public UserResolverService(IHttpContextAccessor context)
        {
            _context = context;
        }

        public string GetUserEmail()
        {
            var userEmail = (from c in _context.HttpContext.User?.Claims
                          where c.Type == "https://rdk.com/claims/email"
                          select c.Value).Single();

            return userEmail;
        }
    }
}
