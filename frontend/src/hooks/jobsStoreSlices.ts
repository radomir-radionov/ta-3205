import { useShallow } from 'zustand/react/shallow';
import { useJobsStore } from '../store/jobsStore';

export function useCreateJobStore() {
  return useJobsStore(
    useShallow(({ createJob, createLoading, createError }) => ({
      createJob,
      createLoading,
      createError,
    })),
  );
}

export function useJobsListStore() {
  return useJobsStore(
    useShallow(
      ({
        jobs,
        activeJobId,
        listLoading,
        listError,
        selectJob,
        clearJobs,
        clearLoading,
        clearError,
      }) => ({
        jobs,
        activeJobId,
        listLoading,
        listError,
        selectJob,
        clearJobs,
        clearLoading,
        clearError,
      }),
    ),
  );
}

export function useJobDetailsStore() {
  return useJobsStore(
    useShallow(
      ({
        activeJobId,
        details,
        detailLoading,
        detailError,
        cancelLoading,
        cancelError,
        cancelJob,
      }) => ({
        activeJobId,
        details,
        detailLoading,
        detailError,
        cancelLoading,
        cancelError,
        cancelJob,
      }),
    ),
  );
}
