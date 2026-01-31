import { Module } from '@nestjs/common';
import { AuthAccountsService } from './auth_accounts.service';
import { AuthAccountsController } from './auth_accounts.controller';

@Module({
  providers: [AuthAccountsService],
  controllers: [AuthAccountsController]
})
export class AuthAccountsModule {}
