import { useState } from 'react';
import { useJobsListStore } from '../hooks/jobsStoreSlices';
import {
  errorTextClass,
  jobItemClass,
  mutedTextClass,
  panelClass,
  panelTitleClass,
  statusClass,
} from '../styles/ui';
import { Button } from './Button';

export function JobsList() {
  const {
    jobs,
    activeJobId,
    listLoading,
    listError,
    selectJob,
    clearJobs,
    clearLoading,
    clearError,
  } = useJobsListStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section className={`${panelClass} pr-[0.45rem]`}>
      <div className="mb-[0.85rem] mr-[0.1rem] flex shrink-0 items-center justify-between gap-3 pr-[0.55rem]">
        <h2 className={`${panelTitleClass} mb-0`}>Список заданий</h2>
        {jobs.length > 0 && (
          <Button
            variant="ghost"
            disabled={clearLoading}
            onClick={() => void clearJobs()}
          >
            {clearLoading ? 'Очистка…' : 'Очистить всё'}
          </Button>
        )}
      </div>
      {listLoading && jobs.length === 0 && <p>Загрузка…</p>}
      {listError && <p className={errorTextClass}>{listError}</p>}
      {clearError && <p className={errorTextClass}>{clearError}</p>}
      {jobs.length === 0 && !listLoading ? (
        <p className={mutedTextClass}>Пока нет заданий</p>
      ) : (
        <div className="mr-[0.1rem] min-h-0 flex-1 overflow-x-hidden overflow-y-auto pr-[0.55rem] scrollbar-gutter-stable">
          <ul className="m-0 flex list-none flex-col gap-[0.4rem] p-0">
            {jobs.map((job) => {
              const showFull = openId === job.id || hoveredId === job.id;
              const isActive = job.id === activeJobId;

              return (
                <li key={job.id}>
                  <div
                    className={jobItemClass(isActive)}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (window.getSelection()?.toString()) {
                        return;
                      }
                      void selectJob(job.id);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        void selectJob(job.id);
                      }
                    }}
                  >
                    <span
                      className={[
                        'col-start-1 block min-w-0 max-w-full cursor-pointer overflow-hidden font-mono text-[0.82rem] font-medium leading-[1.35] break-all text-ink select-text transition-[max-height] duration-320 ease-in-out',
                        showFull ? 'max-h-[4.8em]' : 'max-h-[1.35em]',
                      ].join(' ')}
                      onMouseEnter={() => setHoveredId(job.id)}
                      onMouseLeave={() => {
                        setHoveredId((current) =>
                          current === job.id ? null : current,
                        );
                        if (!window.getSelection()?.toString()) {
                          setOpenId((current) =>
                            current === job.id ? null : current,
                          );
                        }
                      }}
                      onMouseDown={() => {
                        setOpenId(job.id);
                      }}
                    >
                      {job.id}
                    </span>
                    <span
                      className={`${statusClass(job.status)} col-start-2 row-start-1 justify-self-end self-start`}
                    >
                      {job.status}
                    </span>
                    <span className="col-span-full text-[0.78rem] text-muted">
                      {new Date(job.createdAt).toLocaleString('ru-RU', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="col-span-full font-mono text-[0.75rem] text-muted">
                      URLs: {job.urlCount} ·{' '}
                      <span className="text-success">✓ {job.successCount}</span>{' '}
                      · <span className="text-danger">✗ {job.errorCount}</span>
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
