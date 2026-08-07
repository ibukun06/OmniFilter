import { Module } from '@nestjs/common'; import { PrismaModule } from './prisma/prisma.module'; import { AuthModule } from './auth/auth.module'; import { FiltersModule } from './filters/filters.module';
@Module({imports:[PrismaModule,AuthModule,FiltersModule]}) export class AppModule {}
