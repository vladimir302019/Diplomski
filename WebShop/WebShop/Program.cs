using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using WebShop.Interfaces;
using WebShop.Repositories.IRepositories;
using WebShop.Repositories;
using WebShop.Services;
using WebShop.Services.EmailServices;
using AutoMapper;
using WebShop.Mapping;
using WebShop.DBConfiguration;
using Microsoft.EntityFrameworkCore;
using WebShop.ExceptionHandler;
using WebShop.GraphQL.Schemas;
using WebShop.GraphQL.Queries.UserQueries;
using WebShop.GraphQL.Queries.ArticleQueries;
using WebShop.GraphQL.Queries.OrderQueries;
using GraphQL.Types;
using GraphiQl;
using WebShop.GraphQL.Queries;
using GraphQL;
using WebShop.GraphQL.Types.UserTypes;
using WebShop.GraphQL.Types.OrderTypes;
using WebShop.GraphQL.Types.ArticleTypes;
using WebShop.GraphQL.Mutations;
using GraphQL.Upload.AspNetCore;
using WebShop.GraphQL;

string _cors = "cors";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddLogging();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebShop", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });
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
                        new string[]{}
                    }
                });

});

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["SecretKey"]));
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "https://localhost:44370",
            IssuerSigningKey = key
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: _cors, builder =>
    {
        builder.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

//var emailConfig = builder.Configuration.GetSection("EmailConfiguration");
//builder.Services.AddSingleton(emailConfig);
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IArticleService, ArticleService>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderItemRepository, OrderItemRepository>();
builder.Services.AddScoped<IArticleRepository, ArticleRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddTransient<UserType>();
builder.Services.AddTransient<UserUpdateType>();

builder.Services.AddTransient<ArticleType>();
builder.Services.AddTransient<ArticleUpdateType>();
builder.Services.AddTransient<ArticleGetType>();

builder.Services.AddTransient<OrderType>();
builder.Services.AddTransient<OrderAdminType>();
builder.Services.AddTransient<OrderItemType>();

builder.Services.AddTransient<UserQuery>();
builder.Services.AddTransient<ArticleQuery>();
builder.Services.AddTransient<OrderQuery>();
builder.Services.AddTransient<RootQuery>();

builder.Services.AddTransient<UserMutations>();
builder.Services.AddTransient<ArticleMutations>();
builder.Services.AddTransient<OrderMutations>();
builder.Services.AddTransient<RootMutation>();

builder.Services.AddTransient<ISchema, RootSchema>();

builder.Services.AddGraphQLUpload().AddGraphQL(b => b.AddAutoSchema<ISchema>().AddSystemTextJson());

builder.Services.AddScoped<ExceptionHandler>();

builder.Services.AddDbContext<WebShopDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("WebShopContext"));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
    });

var mapperConfig = new MapperConfiguration(mc =>
{
    mc.AddProfile(new MappingProfile());
});
IMapper mapper = mapperConfig.CreateMapper();
builder.Services.AddSingleton(mapper);

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandler>();

app.UseHttpsRedirection();

app.UseGraphQLAltair();
app.UseGraphiQl("/graphql");
app.UseGraphQL<ISchema>();
//app.UseGraphQLUpload<ISchema>("/graphql",
//    new GraphQLUploadOptions
//    {
//        UserContextFactory = (ctx) => new GraphQlUserContext() { User = ctx.User }
//    });

app.UseCors(_cors);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
