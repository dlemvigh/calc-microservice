using System;

namespace CalcApi.Models
{
    public class WeatherForecast
    {
        public DateTime Date { get; set; }

        public int TemperatureC { get; set; }

        public int TemperatureF => 32 + TemperatureC * 5 / 9;

        public string Summary { get; set; }
    }
}
