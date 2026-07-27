import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  urls!: string[];
}
