namespace Bevent.Api.SharedKernel;

public abstract class Register
{
    public required DateTime CreatedOnUtc { get; init; }
    public DateTime? UpdatedOnUtc { get; set; }
    public bool IsDeleted { get; set; }
}
