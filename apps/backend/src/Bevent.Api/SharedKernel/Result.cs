using System.Diagnostics.CodeAnalysis;

namespace Bevent.Api.SharedKernel;

[SuppressMessage("ReSharper", "ArrangeMissingParentheses")]
public class Result
{
    protected Result(bool isSuccess, Error error)
    {
        if (isSuccess && error != Error.None || !isSuccess && error == Error.None)
        {
            throw new ArgumentException("El error es invalido", nameof(error));
        }

        IsSuccess = isSuccess;
        Error = error;
    }

    public bool IsSuccess { get; }

    public bool IsFailure => !IsSuccess;

    public Error Error { get; }

    public static Result Success() => new(true, Error.None);

    public static Result<TValue> Success<TValue>(TValue value) => new(value, true, Error.None);

    public static Result Failure(Error error) => new(false, error);

    public static Result<TValue> Failure<TValue>(Error error) => new(default, false, error);
}

public sealed class Result<TValue>(TValue? value, bool isSuccess, Error error)
    : Result(isSuccess, error)
{
    public TValue Value =>
        IsSuccess
            ? value!
            : throw new InvalidOperationException(
                "El resultado no fue exitoso; no se puede acceder al valor."
            );

    public static implicit operator Result<TValue>(TValue? value) =>
        value is not null ? Success(value) : Failure<TValue>(Error.NullValue);
}
