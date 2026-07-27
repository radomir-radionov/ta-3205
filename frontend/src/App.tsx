import { useEffect } from 'react';
import { CreateJobForm } from './components/CreateJobForm';
import { JobDetails } from './components/JobDetails';
import { JobsList } from './components/JobsList';
import { useJobPolling } from './hooks/useJobPolling';
import { useJobsStore } from './store/jobsStore';

function App() {
  const fetchJobs = useJobsStore((s) => s.fetchJobs);
  useJobPolling();

  useEffect(() => {
    void fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="mx-auto flex h-full max-h-270 w-full max-w-[1920px] flex-col gap-4 overflow-hidden px-6 py-5 max-desk:h-auto max-desk:max-h-none max-desk:min-h-full max-desk:overflow-visible">
      <header className="shrink-0 border-b border-border pb-[0.85rem]">
        <h1 className="m-0 mb-[0.35rem] text-[clamp(1.75rem,3vw,2.15rem)] font-bold tracking-[-0.02em] text-ink before:mr-[0.55rem] before:inline-block before:h-[0.55rem] before:w-[0.55rem] before:translate-y-[-0.08em] before:rounded-px before:bg-accent before:align-middle before:shadow-[0_0_10px_var(--color-accent)] before:content-['']">
          Проверка URL
        </h1>
        <p className="m-0 max-w-xl text-[0.95rem] text-muted">
          Асинхронная проверка списcка URL через REST API
        </p>
      </header>
      <main className="flex min-h-0 flex-1 flex-col gap-4">
        <CreateJobForm />
        <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 desk:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] max-desk:min-h-88">
          <div className="flex h-full min-h-0 flex-col max-desk:*:min-h-72 *:min-h-0 *:flex-1">
            <JobsList />
          </div>
          <div className="flex h-full min-h-0 flex-col max-desk:*:min-h-72 *:min-h-0 *:flex-1">
            <JobDetails />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
