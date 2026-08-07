import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatasetsController } from './datasets.controller';
import { DatasetsService } from './datasets.service';
@Module({ imports: [AuthModule], controllers: [DatasetsController], providers: [DatasetsService] })
export class DatasetsModule {}
