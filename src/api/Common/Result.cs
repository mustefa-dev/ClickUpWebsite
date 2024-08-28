namespace TicketSystem.Api.Common;   

// using this for convenience as the built-in `StatusCodes` is static, and can't be used in our case here.
public enum StatusCode
{
    Ok = 200,
    Created = 201,
    Accepted = 202,
    NoContent = 204,
    AlreadyReported = 208,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Conflict = 409,
    UnprocessableEntity = 422,
    InternalServerError = 500,
    ServiceUnavailable = 503,
}

public record Error(string Code, string? Description = null, int StatusCode = (int)StatusCode.BadRequest)
{
    public static readonly Error None = new(string.Empty);
    public static Error CodeIsUsed => new(nameof(CodeIsUsed), "Code is used");

    public static implicit operator Result(Error error) => Result.Failure(error);

    public IResult Problem() =>
        Results.Problem(title: AppConstants.BusinessErrorTitle, detail: Description, statusCode: StatusCode, type: Code);

    public static IResult Forbidden() =>
        Results.Problem(title: AppConstants.BusinessErrorTitle, detail: "Forbidden operation.", statusCode: StatusCodes.Status403Forbidden, type: "Forbidden");
}

public sealed record Error<T>(string Code, string? Description = null, int StatusCode = (int)StatusCode.BadRequest) : Error(Code, Description, StatusCode) where T : notnull
{
    public static implicit operator Result<T>(Error<T> error) => Result<T>.Failure(error);
}

public class ErrorType<T> where T : notnull
{
    public static readonly Error<T> Unauthorized = new(nameof(Unauthorized), "Unauthorized", (int)StatusCode.Unauthorized);

    public static readonly Error<T> BadRequest = new(nameof(BadRequest), "Bad Request");

    public static readonly Error<T> InternalServerError = new("InternalServerError", "Internal server error");


    public static Error EmptyFieldError(string fieldName) => new($"{fieldName}IsRequired", $"{fieldName} is required");
}

public class Result
{
    protected Result(StatusCode statusCode, Error error)
    {
        StatusCode = statusCode;
        if ((IsSuccess && error != Error.None) || (!IsSuccess && error == Error.None)) throw new ArgumentException("Success result can't have error", nameof(error));
        Error = error;
    }

    public StatusCode StatusCode { get; }
    public bool IsSuccess => (int)StatusCode < 300;
    public bool IsFailure => !IsSuccess;
    public Error Error { get; }

    public static Result Success(StatusCode statusCode = StatusCode.Ok) => new(statusCode, Error.None);

    public static Result Failure(Error error, StatusCode statusCode = StatusCode.BadRequest) => new(statusCode, error);
}

public sealed class Result<T> : Result where T : notnull
{
    private Result(StatusCode statusCode, Error error, T data = default!) : base(statusCode, error) => Data = data;

    public T Data { get; }

    public static Result<T> Success(T data = default!, StatusCode statusCode = StatusCode.Ok) => new(statusCode, Error.None, data);

    public new static Result<T> Failure(Error error, StatusCode statusCode = StatusCode.BadRequest) => new(statusCode, error);

    public override string ToString() => IsSuccess ? $"Success: {Data}" : $"Failure: {Error.Description}";

    public class CommonErrors
    {
    }
}

public record ValidationProblemDetails(string Title, int Status, ValidationError[] Errors);

public record ValidationError(string PropertyName, string Code, string? Message);