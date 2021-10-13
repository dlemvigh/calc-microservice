FROM mcr.microsoft.com/dotnet/sdk:5.0 as build
WORKDIR /app

COPY CalcApi.sln .
COPY CalcApi/CalcApi.csproj ./CalcApi/
COPY CalcApi.Test/CalcApi.Test.csproj ./CalcApi.Test/

RUN dotnet restore

COPY . .

RUN dotnet test
RUN dotnet publish CalcApi -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app

COPY --from=build /app/out ./

CMD ["dotnet", "CalcApi.dll"]