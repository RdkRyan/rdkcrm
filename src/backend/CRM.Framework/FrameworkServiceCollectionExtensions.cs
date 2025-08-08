using CRM.Domain.Contracts.Integrations;
using CRM.Domain.Contracts.Services;
using CRM.Framework.Services;
using CRM.Framework.Services.Integrations;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace CRM.Framework
{
    public static class FrameworkServiceCollectionExtensions
    {
        public static IServiceCollection AddFrameworkServices(this IServiceCollection services)
        {
            services.AddScoped<IExcedeCustomerService, ExcedeCustomerService>();
            services.AddScoped<IExcedeNoteService, ExcedeNoteService>();
            services.AddHttpContextAccessor(); //needed for UserResolverService
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>(); //needed for UserResolverService
            services.AddScoped<IUserResolverService, UserResolverService>();
            services.AddScoped<IExcedeEmployeeService, ExcedeEmployeeService>();

            return services;
        }
    }
}
