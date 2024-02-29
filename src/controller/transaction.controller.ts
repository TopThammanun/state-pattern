import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';

@Controller('tran')
export class TransactionController {
  constructor(private readonly tranService: TransactionService) {}

  @Get()
  getHello(): string {
    return 'Hello transaction!';
  }

  @Get('/init')
  Init(): any {
    return this.tranService.init();
  }
}
