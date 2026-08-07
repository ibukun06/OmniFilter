import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDatasetDto, SearchDatasetDto } from './datasets.dto';
@Injectable()
export class DatasetsService {
  constructor(private db: PrismaService) {}
  list(userId: string) {
    return this.db.dataset.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, include: { _count: { select: { records: true } } } });
  }
  create(userId: string, dto: CreateDatasetDto) {
    return this.db.dataset.create({ data: { userId, name: dto.name, description: dto.description } });
  }
  async get(userId: string, id: string) {
    const dataset = await this.db.dataset.findFirst({ where: { id, userId }, include: { _count: { select: { records: true } } } });
    if (!dataset) throw new NotFoundException('Dataset not found');
    const sample = await this.db.datasetRecord.findMany({ where: { datasetId: id }, take: 20, orderBy: { createdAt: 'asc' } });
    const fields = [...new Set(sample.flatMap((item: any) => Object.keys(item.data as object)))];
    return { ...dataset, sample: sample.map((item: any) => ({ id: item.id, ...item.data as object })), fields };
  }
  async import(userId: string, id: string, records: Record<string, unknown>[]) {
    await this.get(userId, id);
    if (!records.length) throw new BadRequestException('No records supplied');
    if (records.length > 5000) throw new BadRequestException('Import limit is 5,000 records per request');
    const clean = records.filter(r => r && typeof r === 'object' && !Array.isArray(r));
    await this.db.datasetRecord.createMany({ data: clean.map(data => ({ datasetId: id, data: data as any })) });
    return { imported: clean.length };
  }
  async search(userId: string, id: string, dto: SearchDatasetDto) {
    await this.get(userId, id);
    const rows = await this.db.datasetRecord.findMany({ where: { datasetId: id }, take: 10000 });
    const rules: any = dto.rules || {};
    const text = String(rules.text || dto.query || '').toLowerCase();
    const reserved = new Set(['text', 'min', 'max', 'category']);
    const results = rows.filter((row: any) => {
      const data: any = row.data;
      const haystack = Object.values(data).join(' ').toLowerCase();
      if (text && !haystack.includes(text) && !text.split(/\s+/).some((word: string) => word.length > 2 && haystack.includes(word))) return false;
      if (rules.category && !haystack.includes(String(rules.category).toLowerCase())) return false;
      const numeric = Object.values(data).map(Number).filter(Number.isFinite);
      if (rules.min !== undefined && !numeric.some(n => n >= Number(rules.min))) return false;
      if (rules.max !== undefined && !numeric.some(n => n <= Number(rules.max))) return false;
      for (const [key, val] of Object.entries(rules)) {
        if (reserved.has(key) || val === '' || val === undefined) continue;
        if (!(key in data)) return false;
        if (String(data[key]).toLowerCase() !== String(val).toLowerCase()) return false;
      }
      return true;
    }).slice(0, 500).map((row: any) => ({ id: row.id, ...row.data as object }));
    await this.db.searchHistory.create({ data: { userId, datasetId: id, query: dto.query, rules: rules as any, resultCount: results.length } });
    return { results, count: results.length, limited: results.length === 500 };
  }
  async history(userId: string, id: string) {
    await this.get(userId, id);
    return this.db.searchHistory.findMany({ where: { userId, datasetId: id }, take: 20, orderBy: { createdAt: 'desc' } });
  }
  async remove(userId: string, id: string) {
    await this.get(userId, id);
    await this.db.dataset.delete({ where: { id } });
    return { deleted: true };
  }
}
