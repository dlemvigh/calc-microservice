using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using CalcWorker.Config;
using CalcWorker.Queue;
using CalcWorker.Work;
using Newtonsoft.Json;
using System.Threading;
using System.Threading.Tasks;

namespace CalcWorker
{
    class Program
    {
        static async Task Main(string[] args)
        {
            var services = DependencyInjection.ConfigureServices();

            var workerLoop = services.GetService<IConsoleWorkerLoop>();

            await workerLoop.StartWorkLoop();
        }
    }
}
