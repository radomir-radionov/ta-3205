import { Injectable } from '@nestjs/common';

export type HeadResult =
  { ok: true; httpStatus: number } | { ok: false; error: string };

@Injectable()
export class UrlCheckerService {
  async head(url: string): Promise<HeadResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        signal: controller.signal,
      });
      return { ok: true, httpStatus: response.status };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'HEAD request failed';
      return { ok: false, error: message };
    } finally {
      clearTimeout(timeout);
    }
  }

  /** Artificial delay 0–10 seconds before persisting a result. */
  async artificialDelay(): Promise<void> {
    const ms = Math.floor(Math.random() * 10_001);
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }
}
