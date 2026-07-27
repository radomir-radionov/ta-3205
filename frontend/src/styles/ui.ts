import type { JobStatus, UrlStatus } from '../types/job';

export const panelClass =
  'flex min-h-0 flex-col rounded-panel border border-border bg-surface p-[1rem_1.05rem] shadow-panel animate-panel-in';

export const panelTitleClass =
  'm-0 shrink-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-muted';

export const errorTextClass = 'm-0 mt-2 text-[0.88rem] text-danger';

export const mutedTextClass = 'm-0 text-muted';

const statusBase =
  'inline-block rounded-chip px-[0.45rem] py-[0.12rem] font-mono text-[0.72rem] font-medium tracking-[0.02em]';

const STATUS_CLASS: Record<JobStatus | UrlStatus, string> = {
  pending: `${statusBase} bg-warning-dim text-warning`,
  in_progress: `${statusBase} bg-accent-dim text-accent animate-status-pulse`,
  success: `${statusBase} bg-success-dim text-success`,
  completed: `${statusBase} bg-success-dim text-success`,
  error: `${statusBase} bg-danger-dim text-danger`,
  failed: `${statusBase} bg-danger-dim text-danger`,
  cancelled: `${statusBase} bg-chip text-muted`,
};

export function statusClass(status: JobStatus | UrlStatus): string {
  return STATUS_CLASS[status];
}

export const buttonBaseClass =
  'shrink-0 cursor-pointer whitespace-nowrap rounded-panel border border-transparent bg-accent px-[0.95rem] py-[0.55rem] font-sans text-[0.9rem] font-semibold text-white transition-[background,border-color,color,opacity] duration-[140ms] ease-in-out hover:enabled:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-55';

export const buttonDangerClass =
  'shrink-0 cursor-pointer whitespace-nowrap rounded-panel border border-danger bg-transparent px-[0.95rem] py-[0.55rem] font-sans text-[0.9rem] font-semibold text-danger transition-[background,border-color,color,opacity] duration-[140ms] ease-in-out hover:enabled:bg-danger-dim disabled:cursor-not-allowed disabled:opacity-55';

export const buttonGhostClass =
  'shrink-0 cursor-pointer self-center whitespace-nowrap rounded-panel border border-border-strong bg-transparent px-[0.65rem] py-[0.35rem] font-sans text-[0.78rem] font-medium text-muted transition-[background,border-color,color,opacity] duration-[140ms] ease-in-out hover:enabled:border-muted hover:enabled:bg-surface-raised hover:enabled:text-ink disabled:cursor-not-allowed disabled:opacity-55';

const jobItemBaseClass =
  'grid w-full cursor-pointer grid-cols-[1fr_auto] gap-x-[0.65rem] gap-y-[0.15rem] rounded-panel border border-l-[3px] px-[0.65rem] py-[0.55rem] text-left font-normal text-ink transition-[border-color,background] duration-[140ms] ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

export function jobItemClass(isActive: boolean): string {
  if (isActive) {
    return `${jobItemBaseClass} border-accent border-l-accent bg-accent-dim hover:border-accent hover:bg-accent-dim`;
  }
  return `${jobItemBaseClass} border-border border-l-transparent bg-surface-raised hover:border-border-strong hover:bg-surface-hover`;
}
