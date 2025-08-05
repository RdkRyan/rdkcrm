using CRM.Domain.Contracts.Configuration;
using CRM.Domain.Contracts.Integrations;
using CRM.Framework.Services.Integrations;
using Microsoft.Extensions.DependencyInjection;

namespace CRM.Framework
{
    public static class FrameworkServiceCollectionExtensions
    {
        public static IServiceCollection AddFrameworkServices(this IServiceCollection services)
        {
            services.AddScoped<IExcedeCustomerService, ExcedeCustomerService>();

            return services;
        }
    }
}
