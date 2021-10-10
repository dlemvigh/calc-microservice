using System;

namespace CalcWorker.Api
{
    public class JobDTO
    {
        public string Version { get; set; }
        public int Id { get; set; }
        public int Input { get; set; }
        public int? Output { get; set; }
        public DateTime? CalcStartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
        public string Status { get; set; }
    }
}