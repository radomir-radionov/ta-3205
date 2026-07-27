import { useEffect } from 'react';
import { useJobsStore } from '../store/jobsStore';
import { TERMINAL_JOB_STATUSES } from '../types/job';

const POLL_INTERVAL_MS = 2000;

export function useJobPolling(): void {
  const activeJobId = useJobsStore((s) => s.activeJobId);
  // Boolean keeps the effect stable across pending → in_progress (same true).
  const shouldPollActive = useJobsStore((s) => {
    if (!s.activeJobId) {
      return false;
    }
    const status = s.details?.status;
    return !status || !TERMINAL_JOB_STATUSES.has(status);
  });
  // Active job's list row is patched by refreshActiveJob — only poll the list
  // for other non-terminal jobs the user is not currently viewing.
  const shouldPollList = useJobsStore((s) =>
    s.jobs.some(
      (job) =>
        !TERMINAL_JOB_STATUSES.has(job.status) && job.id !== s.activeJobId,
    ),
  );
  const refreshActiveJob = useJobsStore((s) => s.refreshActiveJob);
  const fetchJobs = useJobsStore((s) => s.fetchJobs);

  useEffect(() => {
    if (!activeJobId || !shouldPollActive) {
      return;
    }

    void refreshActiveJob();
    const timer = window.setInterval(() => {
      void refreshActiveJob();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeJobId, shouldPollActive, refreshActiveJob]);

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
