import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionController } from './controller/transaction.controller';
import { TransactionService } from './service/transaction.service';
import { PrismaService } from './prisma.service';
@Module({
  imports: [],
  controllers: [AppController, TransactionController],
  providers: [AppService, TransactionService, PrismaService],
})
export class AppModule {}
