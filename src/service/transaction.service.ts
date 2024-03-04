import { Injectable } from '@nestjs/common';
// import { Prisma, pwaTest } from '@prisma/client';
import { PrismaService } from '../prisma.service';
// import { Public } from '@prisma/client/runtime/library';

class TransactionContext {
  public tran_id: string;
  private prisma: PrismaService;
  private currentState: TransactionState;

  constructor() {
    this.prisma = new PrismaService();
  }

  private getInitialState(): TransactionState {
    const initialStateName = 'Submitting';
    return this.createStateInstance(initialStateName);
  }

  async initialize(id_plan: string): Promise<string> {
    const stateInit = await this.prisma.mST_STATE_PLAN.findFirst({
      where: {
        id_plan: id_plan,
        sequence: 1,
      },
    });
    const stateName = await this.prisma.mST_STATE.findFirst({
      where: {
        id_state: stateInit.id_state,
      },
    });
    const tarn = await this.prisma.tRANSACTION.create({
      data: {
        user_id: '1ef439f5-46d3-4c9c-ae58-328162241f9e',
        id_plan: id_plan,
        id_state: stateInit.id_state,
      },
    });
    this.currentState = this.createStateInstance(stateName.name_function);
    return tarn.id_transaction;
  }

  public async transitionToNextState(id: string): Promise<any> {
    const tran = await this.prisma.tRANSACTION.findFirst({
      where: {
        id_transaction: id,
      },
    });
    const stateInit = await this.prisma.mST_STATE_PLAN.findMany({
      where: {
        id_plan: tran.id_plan,
      },
    });
    const currentState = stateInit.find(
      (result) => result.id_state === tran.id_state,
    );
    const nextState = stateInit.find(
      (result) => result.sequence === currentState.sequence + 1,
    );
    if (!nextState) {
      throw new Error('invalid state');
    }
    const stateName = await this.prisma.mST_STATE.findFirst({
      where: {
        id_state: nextState.id_state,
      },
    });
    this.currentState = this.createStateInstance(stateName.name_function);
    await this.prisma.tRANSACTION.update({
      where: { id_transaction: id },
      data: { id_state: nextState.id_state },
    });
    return this.currentState;
  }

  private createStateInstance(stateName: string): TransactionState {
    const stateMap = {
      Submitting,
      SubmitHistory,
      MapSubmit,
      CommunityMeeting,
      OpinionsAgencies,
    };
    const StateClass = stateMap[stateName];
    if (!StateClass) {
      throw new Error(`Invalid state name: ${stateName}`);
    }
    return new StateClass();
  }
}

abstract class TransactionState {
  protected context: TransactionContext;

  public setContext(context: TransactionContext): void {
    this.context = context;
  }

  public abstract handleAction(id: string): Promise<void>;
}

// การยื่นคำขอ
class Submitting extends TransactionState {
  constructor() {
    super();
    console.log('Submitting 1');
  }
  public async handleAction(): Promise<void> {}
}

// การสอบสวนประวัติความเป็นมา
class SubmitHistory extends TransactionState {
  constructor() {
    super();
    console.log('SubmitHistory 2');
  }
  public async handleAction(): Promise<void> {}
}

// การจัดทำแผนที่ท้ายพรฎ
class MapSubmit extends TransactionState {
  constructor() {
    super();
    console.log('MapSubmit 3');
  }
  public async handleAction(): Promise<void> {}
}

// การประชุมประชาคมรับฟังความเห็น
class CommunityMeeting extends TransactionState {
  constructor() {
    super();
    console.log('CommunityMeeting 4');
  }
  public async handleAction(): Promise<void> {}
}

// ความเห็นหน่วยงานเกี่ยวข้อง
class OpinionsAgencies extends TransactionState {
  constructor() {
    super();
    console.log('OpinionsAgencies 5');
  }
  public async handleAction(): Promise<void> {}
}

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async init(id_plan: string): Promise<string> {
    const transactionContext = new TransactionContext();
    const transactionId = await transactionContext.initialize(id_plan);
    return transactionId;
  }

  async transitionToNextState(tranId: string): Promise<any> {
    const transactionContext = new TransactionContext();
    const transactionId =
      await transactionContext.transitionToNextState(tranId);
    return transactionId;
  }
}
