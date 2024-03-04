import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';

@Controller('tran')
export class TransactionController {
  constructor(private readonly tranService: TransactionService) {}

  @Get()
  getHello(): string {
    return 'Hello transaction!';
  }

  @Post('/init/:planId')
  Init(@Param('planId') id_plan: string): any {
    return this.tranService.init(id_plan);
  }

  @Put('/next/:tranId')
  NextStep(@Param('tranId') tranId: string): any {
    return this.tranService.transitionToNextState(tranId);
  }
}
