import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateDatasetDto, ImportRecordsDto, SearchDatasetDto } from './datasets.dto';
import { DatasetsService } from './datasets.service';
@UseGuards(AuthGuard)
@Controller('datasets')
export class DatasetsController {
  constructor(private service: DatasetsService) {}
  @Get() list(@Req() req: any) { return this.service.list(req.user.sub); }
  @Post() create(@Req() req: any, @Body() dto: CreateDatasetDto) { return this.service.create(req.user.sub, dto); }
  @Get(':id') get(@Req() req: any, @Param('id') id: string) { return this.service.get(req.user.sub, id); }
  @Post(':id/records') import(@Req() req: any, @Param('id') id: string, @Body() dto: ImportRecordsDto) { return this.service.import(req.user.sub, id, dto.records); }
  @Post(':id/search') search(@Req() req: any, @Param('id') id: string, @Body() dto: SearchDatasetDto) { return this.service.search(req.user.sub, id, dto); }
  @Get(':id/history') history(@Req() req: any, @Param('id') id: string) { return this.service.history(req.user.sub, id); }
  @Delete(':id') remove(@Req() req: any, @Param('id') id: string) { return this.service.remove(req.user.sub, id); }
}
