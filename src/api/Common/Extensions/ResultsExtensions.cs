namespace TicketSystem.Api.Common.Extensions;

public static class ResultsExtensions
{
    public static IResult FriendlyProblem(this IResultExtensions _, Error error)
    {
        return Results.Problem(
            title: AppConstants.BusinessErrorTitle,
            detail: error.Description,
            statusCode: error.StatusCode,
            type: error.Code
        );
    }
}
