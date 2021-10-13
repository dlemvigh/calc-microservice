using System;
using Microsoft.Extensions.Logging;

namespace CalcWorker.Work
{
    public interface IDateTimeProvider
    {
        DateTime Now { get; }
    }

  public class DateTimeProvider : IDateTimeProvider
  {
    public DateTime Now => DateTime.Now;
  }
}