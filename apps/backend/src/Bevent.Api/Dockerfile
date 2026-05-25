FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS restore
WORKDIR /src
COPY ["Directory.Build.props", "."]
COPY ["Directory.Packages.props", "."]
COPY ["src/Bevent.Api/Bevent.Api.csproj", "src/Bevent.Api/"]
RUN dotnet restore "src/Bevent.Api/Bevent.Api.csproj"

FROM restore AS publish
ARG BUILD_CONFIGURATION=Release
COPY [".editorconfig", "."]
COPY ["src/Bevent.Api/", "src/Bevent.Api/"]
WORKDIR "/src/src/Bevent.Api"
RUN dotnet publish "Bevent.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish --no-restore /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Bevent.Api.dll"]
