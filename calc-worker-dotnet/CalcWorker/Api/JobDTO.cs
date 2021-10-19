using System;
using System.Numerics;

namespace CalcWorker.Api
{
    public record JobDTO
    {
        public string Version { get; init; }
        public int Id { get; init; }
        public int? Input { get; init; }
        public string Output { get; init; }
        public DateTime? CalcStartedAt { get; init; }
        public DateTime? FinishedAt { get; init; }
        public string Status { get; init; }
    }
}