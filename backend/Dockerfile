# Define base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

# Define build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["Projectwerk.API/Projectwerk.API.csproj", "Projectwerk.API/"]
COPY ["Projectwerk.Infrastructure/Projectwerk.Infrastructure.csproj", "Projectwerk.Infrastructure/"]
COPY ["Projectwerk.Domain/Projectwerk.Domain.csproj", "Projectwerk.Domain/"]
COPY ["Projectwerk.REST/Projectwerk.REST.csproj", "Projectwerk.REST/"]
RUN dotnet restore "Projectwerk.API/Projectwerk.API.csproj"

# Copy full source code and build the project
COPY . .
WORKDIR "/src/Projectwerk.API"
RUN dotnet build "Projectwerk.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Define publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "Projectwerk.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish

# Define final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Projectwerk.API.dll"]
