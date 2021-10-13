FROM mcr.microsoft.com/dotnet/sdk:5.0 as build
WORKDIR /app

COPY CalcWorker.sln .
COPY CalcWorker/CalcWorker.csproj ./CalcWorker/
COPY CalcWorker.Test/CalcWorker.Test.csproj ./CalcWorker.Test/

RUN dotnet restore

COPY . .

RUN dotnet test
RUN dotnet publish CalcWorker -c Release -o out

FROM mcr.microsoft.com/dotnet/runtime:6.0
WORKDIR /app

COPY --from=build /app/out ./

CMD ["dotnet", "CalcWorker.dll"]