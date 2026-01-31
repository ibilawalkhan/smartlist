import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthAccountsModule } from './auth_accounts/auth_accounts.module';
import { BillingModule } from './billing/billing.module';
import { CommentsModule } from './comments/comments.module';
import { DeadlinesModule } from './deadlines/deadlines.module';
import { GroupsModule } from './groups/groups.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PasswordResetsModule } from './password_resets/password_resets.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PlanFeesModule } from './plan_fees/plan_fees.module';
import { PlansModule } from './plans/plans.module';
import { SharedTasksModule } from './shared_tasks/shared_tasks.module';
import { TasksModule } from './tasks/tasks.module';
import { UserDevicesModule } from './user_devices/user_devices.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthAccountsModule,
    BillingModule,
    CommentsModule,
    DeadlinesModule,
    GroupsModule,
    NotificationsModule,
    PasswordResetsModule,
    PermissionsModule,
    PlanFeesModule,
    PlansModule,
    SharedTasksModule,
    TasksModule,
    UserDevicesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
