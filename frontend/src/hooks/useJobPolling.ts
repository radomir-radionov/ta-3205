import { useEffect } from 'react';
import { useJobsStore } from '../store/jobsStore';
import { TERMINAL_JOB_STATUSES } from '../types/job';

const POLL_INTERVAL_MS = 1500;

export function useJobPolling(): void {
  const activeJobId = useJobsStore((s) => s.activeJobId);
  const status = useJobsStore((s) => s.details?.status);
  const shouldPollList = useJobsStore((s) =>
    s.jobs.some((job) => !TERMINAL_JOB_STATUSES.has(job.status)),
  );
  const refreshActiveJob = useJobsStore((s) => s.refreshActiveJob);
  const fetchJobs = useJobsStore((s) => s.fetchJobs);

  useEffect(() => {
    if (!activeJobId) {
      return;
    }
    if (status && TERMINAL_JOB_STATUSES.has(status)) {
      return;
    }

    void refreshActiveJob();
    const timer = window.setInterval(() => {
      void refreshActiveJob();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeJobId, status, refreshActiveJob]);

  useEffect(() => {
    if (!shouldPollList) {
      return;
    }

    void fetchJobs({ silent: true });
    const timer = window.setInterval(() => {
      void fetchJobs({ silent: true });
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [shouldPollList, fetchJobs]);
}
