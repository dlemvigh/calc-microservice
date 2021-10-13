using System;
using System.Threading;
using System.Threading.Tasks;
using CalcWorker.Api;
using CalcWorker.Config;
using CalcWorker.Queue;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace CalcWorker.Work
{
    public enum WorkStatus
    {
        NoWorkToDo,
        WorkInProgress,
        Finished
    };
}