using System;

namespace CalcApi.Models
{
    public class Job
    {
        public int Id { get; set; }
        public int Input { get; set; }
        public string Output { get; set; }
        public DateTime? CalcStartedAt { get; set; }
        public DateTime? FinishedAt { get; set; }
    }
}