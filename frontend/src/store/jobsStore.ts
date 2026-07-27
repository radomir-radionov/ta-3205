import { create } from 'zustand';
import * as jobsApi from '../api/jobsApi';
import type { JobDetail, JobSummary } from '../types/job';

type JobsState = {
  jobs: JobSummary[];
  activeJobId: string | null;
  details: JobDetail | null;
  listLoading: boolean;
  createLoading: boolean;
  detailLoading: boolean;
  cancelLoading: boolean;
  clearLoading: boolean;
  listError: string | null;
  createError: string | null;
  detailError: string | null;
  cancelError: string | null;
  clearError: string | null;
  fetchJobs: (options?: { silent?: boolean }) => Promise<void>;
  createJob: (urls: string[]) => Promise<void>;
  selectJob: (jobId: string) => Promise<void>;
  refreshActiveJob: () => Promise<void>;
  cancelJob: () => Promise<void>;
  clearJobs: () => Promise<void>;
};

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function summaryFromDetail(details: JobDetail): JobSummary {
  let successCount = 0;
  let errorCount = 0;
  for (const url of details.urls) {
    if (url.status === 'success') {
      successCount += 1;
    } else if (url.status === 'error') {
      errorCount += 1;
    }
  }
  return {
    id: details.id,
    createdAt: details.createdAt,
    status: details.status,
    urlCount: details.urls.length,
    successCount,
    errorCount,
  };
}

function patchJobInList(jobs: JobSummary[], details: JobDetail): JobSummary[] {
  const summary = summaryFromDetail(details);
  const index = jobs.findIndex((job) => job.id === details.id);
  if (index === -1) {
    return [summary, ...jobs];
  }
  const next = jobs.slice();
  next[index] = summary;
  return next;
}

let refreshInFlight = false;
let listRefreshInFlight = false;

export const useJobsStore = create<JobsState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  details: null,
  listLoading: false,
  createLoading: false,
  detailLoading: false,
  cancelLoading: false,
  clearLoading: false,
  listError: null,
  createError: null,
  detailError: null,
  cancelError: null,
  clearError: null,

  fetchJobs: async (options) => {
    const silent = options?.silent === true;
    if (silent) {
      if (listRefreshInFlight) {
        return;
      }
      listRefreshInFlight = true;
    } else {
      set({ listLoading: true, listError: null });
    }
    try {
      const jobs = await jobsApi.fetchJobs();
      set(silent ? { jobs } : { jobs, listLoading: false });
    } catch (error) {
      set(
        silent
          ? { listError: errorMessage(error, 'Failed to load jobs') }
          : {
              listLoading: false,
              listError: errorMessage(error, 'Failed to load jobs'),
            },
      );
    } finally {
      if (silent) {
        listRefreshInFlight = false;
      }
    }
  },

  createJob: async (urls: string[]) => {
    set({ createLoading: true, createError: null });
    try {
      const { jobId } = await jobsApi.createJob(urls);
      set({
        activeJobId: jobId,
        details: null,
        createLoading: false,
      });
      await get().fetchJobs();
      await get().selectJob(jobId);
    } catch (error) {
      set({
        createLoading: false,
        createError: errorMessage(error, 'Failed to create job'),
      });
    }
  },

  selectJob: async (jobId: string) => {
    set({
      activeJobId: jobId,
      details: null,
      detailLoading: true,
      detailError: null,
      cancelError: null,
    });
    try {
      const details = await jobsApi.fetchJob(jobId);
      if (get().activeJobId !== jobId) {
        return;
      }
      set({
        details,
        detailLoading: false,
        jobs: patchJobInList(get().jobs, details),
      });
    } catch (error) {
      if (get().activeJobId !== jobId) {
        return;
      }
      set({
        detailLoading: false,
        detailError: errorMessage(error, 'Failed to load job'),
      });
    }
  },

  refreshActiveJob: async () => {
    if (refreshInFlight) {
      return;
    }
    const jobId = get().activeJobId;
    if (!jobId) {
      return;
    }
    refreshInFlight = true;
    try {
      const details = await jobsApi.fetchJob(jobId);
      if (get().activeJobId !== jobId) {
        return;
      }
      set({
        details,
        detailError: null,
        jobs: patchJobInList(get().jobs, details),
      });
    } catch (error) {
      if (get().activeJobId !== jobId) {
        return;
      }
      set({
        detailError: errorMessage(error, 'Failed to refresh job'),
      });
    } finally {
      refreshInFlight = false;
    }
  },

  cancelJob: async () => {
    const jobId = get().activeJobId;
    if (!jobId) {
      return;
    }
    set({ cancelLoading: true, cancelError: null });
    try {
      const details = await jobsApi.cancelJob(jobId);
      if (get().activeJobId !== jobId) {
        return;
      }
      set({ details, cancelLoading: false });
      await get().fetchJobs();
    } catch (error) {
      if (get().activeJobId !== jobId) {
        return;
      }
      set({
        cancelLoading: false,
        cancelError: errorMessage(error, 'Failed to cancel job'),
      });
    }
  },

  clearJobs: async () => {
    set({ clearLoading: true, clearError: null });
    try {
      await jobsApi.clearJobs();
      set({
        jobs: [],
        activeJobId: null,
        details: null,
        clearLoading: false,
        detailLoading: false,
        cancelLoading: false,
        detailError: null,
        cancelError: null,
      });
    } catch (error) {
      set({
        clearLoading: false,
        clearError: errorMessage(error, 'Failed to clear jobs'),
      });
    }
  },
}));
