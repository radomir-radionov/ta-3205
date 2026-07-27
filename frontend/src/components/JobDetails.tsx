import { useJobDetailsStore } from '../hooks/jobsStoreSlices';
import {
  errorTextClass,
  mutedTextClass,
  panelClass,
  panelTitleClass,
  statusClass,
} from '../styles/ui';
import { TERMINAL_JOB_STATUSES } from '../types/job';
import { Button } from './Button';

export function JobDetails() {
  const {
    activeJobId,
    details,
    detailLoading,
    detailError,
    cancelLoading,
    cancelError,
    cancelJob,
  } = useJobDetailsStore();

  const activeDetails = details && details.id === activeJobId ? details : null;

  if (!activeDetails && (detailLoading || activeJobId)) {
    return (
      <section className={panelClass}>
        <h2 className={`${panelTitleClass} mb-[0.85rem]`}>Детали задания</h2>
        <p className={mutedTextClass}>Загрузка…</p>
      </section>
    );
  }

  if (!activeDetails) {
    return (
      <section className={panelClass}>
        <h2 className={`${panelTitleClass} mb-[0.85rem]`}>Детали задания</h2>
        <p className={mutedTextClass}>Выберите задание или создайте новое</p>
        {detailError && <p className={errorTextClass}>{detailError}</p>}
      </section>
    );
  }

  const processed = activeDetails.urls.filter(
    (u) =>
      u.status === 'success' ||
      u.status === 'error' ||
      u.status === 'cancelled',
  ).length;
  const total = activeDetails.urls.length;
  const canCancel = !TERMINAL_JOB_STATUSES.has(activeDetails.status);

  return (
    <section className={panelClass}>
      <div className="mb-4 flex shrink-0 items-start justify-between gap-4 border-b border-border pb-[0.85rem]">
        <div>
          <h2 className={`${panelTitleClass} mb-[0.55rem]`}>Детали задания</h2>
          <p className="m-0 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9rem] text-muted">
            <span className={statusClass(activeDetails.status)}>
              {activeDetails.status}
            </span>
            <span>
              <strong className="font-medium text-ink">
                {processed} из {total}
              </strong>{' '}
              обработано
            </span>
          </p>
        </div>
        {canCancel && (
          <Button
            variant="danger"
            disabled={cancelLoading}
            onClick={() => void cancelJob()}
          >
            {cancelLoading ? 'Отмена…' : 'Отменить задание'}
          </Button>
        )}
      </div>
      {detailError && <p className={errorTextClass}>{detailError}</p>}
      {cancelError && <p className={errorTextClass}>{cancelError}</p>}
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse text-[0.88rem]">
          <thead>
            <tr>
              <th className="w-[22%] border-b border-border px-[0.4rem] py-[0.45rem] text-left text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-muted">
                URL
              </th>
              <th className="w-25 border-b border-border px-1 py-[0.45rem] text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-muted">
                Статус
              </th>
              <th className="w-14 border-b border-border px-1 py-[0.45rem] text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-muted">
                HTTP
              </th>
              <th className="w-[34%] border-b border-border px-[0.4rem] py-[0.45rem] text-left text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-muted">
                Ошибка
              </th>
              <th className="w-38 whitespace-nowrap border-b border-border px-[0.4rem] py-[0.45rem] text-center text-[0.72rem] font-semibold uppercase tracking-[0.04em] text-muted">
                Длительность
              </th>
            </tr>
          </thead>
          <tbody>
            {activeDetails.urls.map((item) => (
              <tr
                key={`${activeDetails.id}-${item.url}`}
                className="transition-colors duration-120 ease-in-out hover:bg-accent-row group"
              >
                <td className="overflow-hidden text-ellipsis whitespace-nowrap border-b border-border px-2 py-[0.65rem] align-top font-mono text-[0.82rem] hover:whitespace-normal hover:break-all hover:text-clip">
                  {item.url}
                </td>
                <td className="border-b border-border px-1 py-[0.65rem] text-center align-top">
                  <span className={statusClass(item.status)}>
                    {item.status}
                  </span>
                </td>
                <td className="whitespace-nowrap border-b border-border px-1 py-[0.65rem] text-center align-top font-mono text-[0.82rem] text-muted">
                  {item.httpStatus ?? '—'}
                </td>
                <td className="border-b border-border px-2 py-[0.65rem] align-top text-muted">
                  {item.error ? (
                    <span
                      className="block max-h-[1.35em] overflow-hidden text-ellipsis whitespace-nowrap text-[0.82rem] leading-[1.35] transition-[max-height] duration-320 ease-in-out group-hover:max-h-32 group-hover:whitespace-normal group-hover:wrap-break-word group-hover:text-clip"
                      title={item.error}
                    >
                      {item.error}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="whitespace-nowrap border-b border-border px-2 py-[0.65rem] text-center align-top font-mono text-[0.82rem] text-muted">
                  {item.durationMs !== undefined
                    ? `${item.durationMs} ms`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
