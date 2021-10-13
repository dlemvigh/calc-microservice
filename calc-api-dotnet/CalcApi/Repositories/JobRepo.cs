using System.Collections.Generic;
using CalcApi.Models;
using Microsoft.Extensions.Logging;

namespace CalcApi.Repositories
{
    public interface IJobRepo
    {
        Job Create(Job job);
        Job Read(int id);
        Job Update(int id, Job job);
        Job Patch(int id, Job job);
        Job Delete(int id);
        void Clear();
        IEnumerable<Job> All();

    }

    public class JobRepo : IJobRepo
    {
        private int counter;
        private readonly Dictionary<int, Job> db;
        private readonly ILogger<JobRepo> logger;
        public JobRepo(ILogger<JobRepo> logger)
        {
            counter = 0;
            db = new Dictionary<int, Job>();
            this.logger = logger;

            logger.LogInformation("job database created");
        }
        public IEnumerable<Job> All()
        {
            return db.Values;
        }

        public void Clear()
        {
            db.Clear();
        }

        public Job Create(Job job)
        {
            var id = ++counter;
            job.Id = id;
            logger.LogInformation("create job " + id);
            return db[id] = job;
        }

        public Job Read(int id)
        {
            logger.LogInformation("read job " + id);
            return db[id];
        }
        public Job Update(int id, Job job)
        {
            logger.LogInformation("update job " + id);
            db[id] = job;
            return job;
        }

        public Job Patch(int id, Job job)
        {
            logger.LogInformation("patch job " + id);
            var dbJob = db[id];
            dbJob.Output = job.Output ?? dbJob.Output;
            dbJob.CalcStartedAt = job.CalcStartedAt ?? dbJob.CalcStartedAt;
            dbJob.FinishedAt = job.FinishedAt ?? dbJob.FinishedAt;
            return dbJob;
        }

        public Job Delete(int id)
        {
            logger.LogInformation("delete job " + id);
            var job = db[id];
            db.Remove(id);
            return job;
        }
    }
}