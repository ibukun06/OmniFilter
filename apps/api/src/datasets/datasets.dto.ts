import { IsArray, IsObject, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
export class CreateDatasetDto {
  @IsString() @MinLength(2) @MaxLength(80) name!: string;
  @IsOptional() @IsString() @MaxLength(300) description?: string;
}
export class ImportRecordsDto {
  @IsArray() records!: Record<string, unknown>[];
}
export class SearchDatasetDto {
  @IsOptional() @IsString() query?: string;
  @IsObject() rules!: Record<string, unknown>;
}
