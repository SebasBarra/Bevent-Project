using Bevent.Api.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Web.Api.Extensions;

internal static class MigrationExtensions
{
    public static async Task ApplyMigrationsAsync(
        this IApplicationBuilder app,
        string? seedSqlFilePath = null
    )
    {
        using IServiceScope scope = app.ApplicationServices.CreateScope();

        await using ApplicationDbContext dbContext =
            scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.MigrateAsync();

        if (
            !await dbContext.Users.AnyAsync()
            && !string.IsNullOrWhiteSpace(seedSqlFilePath)
            && File.Exists(seedSqlFilePath)
        )
        {
            await ExecuteSqlFileAsync(dbContext, seedSqlFilePath);
        }
    }

    private static async Task ExecuteSqlFileAsync(ApplicationDbContext dbContext, string filePath)
    {
        string sqlScript = await File.ReadAllTextAsync(filePath);

        if (string.IsNullOrWhiteSpace(sqlScript))
        {
            return;
        }

        await dbContext.Database.ExecuteSqlRawAsync(sqlScript);
    }
}
