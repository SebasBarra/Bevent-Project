namespace Bevent.Api.Application.Abstractions.DataTransfer;

public sealed record FileUpload(Stream Content, string Name, long Length);
