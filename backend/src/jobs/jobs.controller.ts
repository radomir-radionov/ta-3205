import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() dto: CreateJobDto): { jobId: string } {
    return this.jobsService.create(dto.urls);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Delete()
  @HttpCode(204)
  clearAll(): void {
    this.jobsService.clearAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string) {
    return this.jobsService.cancel(id);
  }
}
