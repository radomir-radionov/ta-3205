import { Module } from '@nestjs/common';
import { UrlCheckerService } from '../url-checker/url-checker.service';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsService, UrlCheckerService],
})
export class JobsModule {}
