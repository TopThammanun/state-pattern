import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

class TransactionContext {
  private prisma: PrismaService;
  private currentState: TransactionState;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
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
      throw new Error('Invalid state transition');
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
    console.log('1');
    /// here is logic when call new state
  }
  public async handleAction(): Promise<void> {}
}

// การสอบสวิตประวัติความเป็นมา
class SubmitHistory extends TransactionState {
  constructor() {
    super();
    console.log('2');
    /// here is logic when call new state
  }
  public async handleAction(): Promise<void> {}
}

// การจัดทำแผนที่ท้ายพรฎ
class MapSubmit extends TransactionState {
  constructor() {
    super();
    console.log('3');
    /// here is logic when call new state
  }
  public async handleAction(): Promise<void> {}
}

// การประชุมประชาคมรับฟังความเห็น
class CommunityMeeting extends TransactionState {
  constructor() {
    super();
    console.log('4');
    /// here is logic when call new state
  }
  public async handleAction(): Promise<void> {}
}

// ความเห็นหน่วยงานเกี่ยวข้อง
class OpinionsAgencies extends TransactionState {
  constructor() {
    super();
    console.log('5');
    /// here is logic when call new state
  }
  public async handleAction(): Promise<void> {}
}

@Injectable()
export class TransactionService {
  private transactionContext: TransactionContext;

  constructor(private prisma: PrismaService) {
    this.transactionContext = new TransactionContext(this.prisma);
  }

  async init(id_plan: string): Promise<string> {
    const transactionId = await this.transactionContext.initialize(id_plan);
    return transactionId;
  }

  async transitionToNextState(tranId: string): Promise<any> {
    const transactionId =
      await this.transactionContext.transitionToNextState(tranId);
    return transactionId;
  }
}
