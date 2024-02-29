import { Injectable } from '@nestjs/common';
// import { Prisma, pwaTest } from '@prisma/client';
import { PrismaService } from '../prisma.service';
// import { Public } from '@prisma/client/runtime/library';

class TransactionContext {
  private state: TransactionState;

  constructor(state: TransactionState) {
    this.transitionTo(state);
  }

  public async transitionToNextState(id: string): Promise<void> {
    const nextStateName = 'Submitting';
    const nextState = this.createStateInstance(nextStateName);
    this.transitionTo(nextState);
    await this.performAction(id);
  }

  private createStateInstance(stateName: string): TransactionState {
    const stateMap = {
      Submitting,
      SubmitHistory,
      MapSubmit,
      CommunityMeeting,
      OpinionsAgencies,
      MeetingComittee,
      ProvinceSend,
      DepartmentLandsSend,
      CabinetPresent,
      CouncilOfStatePresent,
      Announcement,
      DepartmentLandsSendProvince,
    };
    const StateClass = stateMap[stateName];
    if (!StateClass) {
      throw new Error(`Invalid state name: ${stateName}`);
    }
    return new StateClass();
  }

  public transitionTo(state: TransactionState): void {
    this.state = state;
    this.state.setContext(this);
  }

  public async performAction(id: string): Promise<void> {
    await this.state.handleAction(id);
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
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// การสอบสวนประวัติความเป็นมา
class SubmitHistory extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// การจัดทำแผนที่ท้ายพรฎ
class MapSubmit extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// การประชุมประชาคมรับฟังความเห็น
class CommunityMeeting extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// ความเห็นหน่วยงานเกี่ยวข้อง
class OpinionsAgencies extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// การประชุมคณะกรรมการกำกับการใช้ประ โยชน์ฯของจังหวัด
class MeetingComittee extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// จังหวัดส่งเรื่องให้กรมที่ดิน
class ProvinceSend extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// กรมที่ดินเสนอกระทรวงมหาดไทย
class DepartmentLandsSend extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// นำเสนอคณะรัฐมนตรี
class CabinetPresent extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// นำเสนอคณะกรรมการกฤษฎีกา
class CouncilOfStatePresent extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// ประกาศราชกิจจานุเบกษา
class Announcement extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

// กรมที่ดินแจ้งจังหวัด
class DepartmentLandsSendProvince extends TransactionState {
  public async handleAction(id: string): Promise<void> {
    await this.context.transitionToNextState(id);
  }
}

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async init(): Promise<string> {
    const initialTransactionState = new Submitting();
    const transactionContext = new TransactionContext(initialTransactionState);

    const tarn = await this.prisma.tRANSACTION.create({
      data: {
        user_id: '1ef439f5-46d3-4c9c-ae58-328162241f9e',
        id_plan: 'clt6r595p000dskk679d7w3xf',
      },
    });

    await transactionContext.performAction(tarn.id_transaction);
    return tarn.id_transaction;
  }

  async transitionToNextState(transactionId: string): Promise<any> {
    const transaction = await this.prisma.tRANSACTION.findUnique({
      where: {
        id_transaction: transactionId,
      },
    });

    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }
  }
}
