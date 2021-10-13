using System.Linq;
using NUnit.Framework;
using CalcApi.Controllers;
using System;
using Microsoft.Extensions.Logging;

namespace CalcApi.Test.Controllers
{
    public class WeatherForecaseControllerTests
    {
        private ILogger<WeatherForecastController> logger;
        private WeatherForecastController controller;
        [SetUp]
        public void Setup()
        {
            logger = new TestLogger<WeatherForecastController>();
        }

        [Test]
        public void GetTest_ReturnsFiveElements()
        {
            // arrange
            var controller = new WeatherForecastController(logger);

            // act
            var result = controller.Get();

            // assert
            Assert.That(result, Has.Length.EqualTo(5));
        }

        [Test]
        public void GetTest_ForecastTemperaturesAreWithinRange()
        {
            // arrange
            var controller = new WeatherForecastController(logger);

            // act
            var result = controller.Get();

            // assert
            Assert.That(result.Select(x => x.TemperatureC), Is.All.InRange(-20, 55));
        }

        [Test]
        public void GetTest_ForecastDatesAreWithinTheNextFiveDays()
        {
            // arrange
            var controller = new WeatherForecastController(logger);

            // act
            var result = controller.Get();

            // assert
            var from = DateTime.Now.Date.AddDays(1);
            var to = DateTime.Now.Date.AddDays(5);
            Assert.That(result.Select(x => x.Date.Date), Is.All.InRange(from, to));
        }

        [Test]
        public void GetTest_ForecastsHaveSummaries()
        {
            // arrange
            var controller = new WeatherForecastController(logger);

            // act
            var result = controller.Get();

            // assert
            Assert.That(result.Select(x => x.Summary), Is.All.Not.Empty);
        }

    }
}