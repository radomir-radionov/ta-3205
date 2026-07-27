import { useEffect } from 'react';
import { useJobsStore } from '../store/jobsStore';
import { TERMINAL_JOB_STATUSES } from '../types/job';

const POLL_INTERVAL_MS = 1500;

export function useJobPolling(): void {
  const activeJobId = useJobsStore((s) => s.activeJobId);
  const status = useJobsStore((s) => s.details?.status);
  const refreshActiveJob = useJobsStore((s) => s.refreshActiveJob);

  useEffect(() => {
    if (!activeJobId) {
      return;
    }
    if (status && TERMINAL_JOB_STATUSES.has(status)) {
      return;
    }

    const timer = window.setInterval(() => {
      void refreshActiveJob();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [activeJobId, status, refreshActiveJob]);
}
