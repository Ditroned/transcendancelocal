import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
//import { ChatService } from './chat.service';

@Module({
  providers: [MyGateway],
})
export class GatewayModule {}
