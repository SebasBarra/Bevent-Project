using Microsoft.EntityFrameworkCore;

namespace Bevent.Api.Application.Abstractions.DataTransfer;

public static class PagedList
{
    public static async Task<PagedList<TItem>> CreateAsync<TItem>(
        IQueryable<TItem> query,
        int page,
        int pageSize,
        CancellationToken cancellationToken
    )
    {
        int totalCount = await query.CountAsync(cancellationToken);

        List<TItem> items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<TItem>(items, page, pageSize, totalCount);
    }
}

public sealed record PagedList<TItem>(List<TItem> Items, int Page, int PageSize, int TotalCount)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page * PageSize < TotalCount;
    public bool HasPreviousPage => Page > 1;
}
