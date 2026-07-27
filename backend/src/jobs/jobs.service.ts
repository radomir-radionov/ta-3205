import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UrlCheckerService } from '../url-checker/url-checker.service';
import type { Job, JobStatus, JobSummary, UrlResult } from './types/job.types';

const MAX_CONCURRENCY = 5;

const TERMINAL_JOB: ReadonlySet<JobStatus> = new Set([
  'completed',
  'cancelled',
  'failed',
]);

@Injectable()
export class JobsService {
  private readonly jobs = new Map<string, Job>();

  constructor(private readonly urlChecker: UrlCheckerService) {}

  create(urls: string[]): { jobId: string } {
    const id = randomUUID();
    const job: Job = {
      id,
      createdAt: new Date().toISOString(),
      status: 'pending',
      urls: urls.map((url): UrlResult => ({
        url,
        status: 'pending',
      })),
    };

    this.jobs.set(id, job);
    void this.processJob(id);
    return { jobId: id };
  }

  findAll(): JobSummary[] {
    return [...this.jobs.values()]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((job) => this.toSummary(job));
  }

  findOne(id: string): Job {
    const job = this.jobs.get(id);
    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }
    return job;
  }

  cancel(id: string): Job {
    const job = this.findOne(id);

    if (TERMINAL_JOB.has(job.status)) {
      return job;
    }

    job.status = 'cancelled';
    for (const item of job.urls) {
      if (item.status === 'pending') {
        item.status = 'cancelled';
      }
    }

    return job;
  }

  clearAll(): void {
    this.jobs.clear();
  }

  private toSummary(job: Job): JobSummary {
    return {
      id: job.id,
      createdAt: job.createdAt,
      status: job.status,
      urlCount: job.urls.length,
      successCount: job.urls.filter((u) => u.status === 'success').length,
      errorCount: job.urls.filter((u) => u.status === 'error').length,
    };
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      return;
    }

    try {
      job.status = 'in_progress';

      let nextIndex = 0;
      const workerCount = Math.min(MAX_CONCURRENCY, job.urls.length);

      const workers = Array.from({ length: workerCount }, async () => {
        while (true) {
          const index = nextIndex;
          nextIndex += 1;
          if (index >= job.urls.length) {
            return;
          }

          const current = this.jobs.get(jobId);
          if (!current) {
            return;
          }

          const item = current.urls[index];
          if (!item || item.status !== 'pending') {
            continue;
          }

          if (current.status === 'cancelled') {
            item.status = 'cancelled';
            continue;
          }

          item.status = 'in_progress';
          item.startedAt = new Date().toISOString();
          const startedMs = Date.now();

          const headResult = await this.urlChecker.head(item.url);
          await this.urlChecker.artificialDelay();

          item.finishedAt = new Date().toISOString();
          item.durationMs = Date.now() - startedMs;

          if (headResult.ok) {
            item.status = 'success';
            item.httpStatus = headResult.httpStatus;
          } else {
            item.status = 'error';
            item.error = headResult.error;
          }
        }
      });

      await Promise.all(workers);

      const finished = this.jobs.get(jobId);
      if (!finished) {
        return;
      }

      if (finished.status === 'cancelled') {
        return;
      }

      finished.status = 'completed';
    } catch {
      const failed = this.jobs.get(jobId);
      if (failed && failed.status !== 'cancelled') {
        failed.status = 'failed';
      }
    }
  }
}
