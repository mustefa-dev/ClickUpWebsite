FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /src

COPY ./src/api/*.csproj .
RUN dotnet restore --verbosity detailed

COPY ./src/api .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime
RUN apk add --no-cache bash
WORKDIR /app
COPY --from=build /app .
