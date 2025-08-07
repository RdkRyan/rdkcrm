using CRM.Domain.Contracts.Configuration;
using CRM.Framework;
using CRM.Infrastructure;
using CRM.Shared;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Polly;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var auth0Settings = builder.Configuration.GetSection("Auth0");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Authority = auth0Settings["Domain"];
    options.Audience = auth0Settings["Audience"];
});

// Configure Authorization Policies based on permissions
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("ReadContactsPolicy", policy =>
        policy.RequireClaim("permissions", "read:contacts"));

    options.AddPolicy("ReadReportsPolicy", policy =>
        policy.RequireClaim("permissions", "read:reports"));

    // A user must have ALL of these permissions to satisfy this policy
    options.AddPolicy("AdminPolicy", policy =>
        policy.RequireClaim("permissions", "system:admin")
              .RequireClaim("permissions", "read:contacts")
              .RequireClaim("permissions", "read:reports"));
});

// Configure CORS to allow the React app to make requests
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddSingleton<IAppSettings, AppSettings>();
builder.Services.AddTransient(typeof(IPaginatedResult<>), typeof(PaginatedResult<>));
//builder.Services.AddTransient(typeof(IPaginatedList<>), typeof(PaginatedList<>));
builder.Services.AddFrameworkServices();
builder.Services.AddInfrastructureServices();
builder.Services.AddControllers();
builder.Services.AddHttpClient();
builder.Services.AddHttpClient("excedeapi", c =>
{
    c.BaseAddress = new Uri(builder.Configuration["ProcedeApi"]);
}).AddTransientHttpErrorPolicy(p => p.RetryAsync(5));

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "RDK CRM API", Version = "v1" });

    // Define the security scheme for JWT Bearer
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });

    // Add a security requirement to use the Bearer scheme globally
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();

// This middleware logs the Authorization header before authentication runs.
app.Use(async (context, next) =>
{
    var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
    if (authHeader != null)
    {
        app.Logger.LogInformation("Authorization header detected: {AuthHeader}", authHeader);
        // You can set a breakpoint here to inspect the header value
    }
    else
    {
        app.Logger.LogInformation("No Authorization header found for the request.");
    }

    await next.Invoke();
});

app.UseCors();

app.UseAuthentication();

//// Middleware to log all authenticated user claims ---
//app.Use(async (context, next) =>
//{
//    // This middleware runs after UseAuthentication, so the user should be set if the token is valid.
//    if (context.User.Identity?.IsAuthenticated == true)
//    {
//        app.Logger.LogInformation("User is authenticated. Claims:");
//        foreach (var claim in context.User.Claims)
//        {
//            app.Logger.LogInformation("  - {ClaimType}: {ClaimValue}", claim.Type, claim.Value);
//        }
//    }
//    await next.Invoke();
//});

app.UseAuthorization();

app.MapControllers();

app.Run();