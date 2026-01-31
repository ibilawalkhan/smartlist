import { Module } from '@nestjs/common';
import { UserDevicesService } from './user_devices.service';
import { UserDevicesController } from './user_devices.controller';

@Module({
  providers: [UserDevicesService],
  controllers: [UserDevicesController]
})
export class UserDevicesModule {}
