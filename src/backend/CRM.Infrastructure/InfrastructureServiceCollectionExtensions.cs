using CRM.Domain.Contracts.Integrations;
using CRM.Infrastructure.Gateways.Integrations;
using Microsoft.Extensions.DependencyInjection;

namespace CRM.Infrastructure
{
    public static class InfrastructureServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
        {
            services.AddScoped<IExcedeCustomerGateway, ExcedeCustomerGateway>();
            services.AddScoped<IExcedeNoteGateway, ExcedeNoteGateway>();
            services.AddScoped<IExcedeEmployeeGateway, ExcedeEmployeeGateway>();

            return services;
        }
    }
}
