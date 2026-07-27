import { useState, type SubmitEvent } from 'react';
import { useCreateJobStore } from '../hooks/jobsStoreSlices';
import { errorTextClass, panelClass, panelTitleClass } from '../styles/ui';
import { Button } from './Button';

export function CreateJobForm() {
  const [text, setText] = useState('');
  const { createJob, createLoading, createError } = useCreateJobStore();

  const onSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const urls = text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      return;
    }
    void createJob(urls);
  };

  return (
    <section className={`${panelClass} w-full shrink-0`}>
      <form className="flex flex-col gap-[0.65rem]" onSubmit={onSubmit}>
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div>
            <h2 className={`${panelTitleClass} mb-[0.2rem]`}>Новое задание</h2>
            <p className="m-0 text-[0.85rem] text-muted">
              Каждый URL с новой строки
            </p>
          </div>
          <Button
            type="submit"
            disabled={createLoading}
            className="self-center"
          >
            {createLoading ? 'Создание…' : 'Запустить проверку'}
          </Button>
        </div>
        <label htmlFor="urls" className="flex w-full flex-col gap-[0.4rem]">
          <span className="sr-only">Каждый URL с новой строки</span>
          <textarea
            id="urls"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={'https://example.com\nhttps://example.org'}
            className="h-[calc(1.5em*3+1.4rem)] max-h-[calc(1.5em*3+1.4rem)] min-h-[calc(1.5em*3+1.4rem)] w-full resize-none overflow-y-auto rounded-panel border border-border bg-canvas px-3 py-[0.7rem] font-mono text-[0.85rem] leading-normal text-ink placeholder:text-placeholder focus:border-accent focus:shadow-[0_0_0_3px_var(--color-accent-dim)] focus:outline-none"
          />
        </label>
        {createError && <p className={errorTextClass}>{createError}</p>}
      </form>
    </section>
  );
}
