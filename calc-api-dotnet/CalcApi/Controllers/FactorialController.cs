using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CalcApi.Models;
using CalcApi.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace CalcApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FactorialController : ControllerBase
    {
        private readonly ILogger<FactorialController> logger;
        private readonly IJobRepo repo;

        public FactorialController(ILogger<FactorialController> logger, IJobRepo repo)
        {
            this.logger = logger;
            this.repo = repo;
        }

        [HttpGet]
        public IEnumerable<Job> Get()
        {
            return repo.All();
        }

        [HttpPost]
        public Job Post(Job job)
        {
            return repo.Create(job);
        }

        [HttpPut]
        public Job Post(int id, Job job)
        {
            return repo.Patch(id, job);
        }

        [HttpDelete]
        public Job Delete(int id)
        {
            return repo.Delete(id);
        }
    }
}
