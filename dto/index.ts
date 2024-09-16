import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { EngineType, TransmissionType } from './enums';

export class CreateCarDto {
  @IsString()
  readonly id: string;

  @IsString()
  readonly image: string;

  @IsString()
  readonly brand: string;

  @IsString()
  readonly model: string;

  @IsString()
  readonly color: string;

  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly year: number;

  @IsEnum(EngineType)
  readonly engine: EngineType;

  @IsEnum(TransmissionType)
  @IsOptional()
  readonly transmission?: TransmissionType;

  @IsNumber()
  @IsOptional()
  readonly range?: number;
}
