import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StatusesModule } from './statuses/statuses.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { LabelsModule } from './labels/labels.module';
import { TeamsModule } from './teams/teams.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ProjectsModule } from './projects/projects.module';
import { UploadsModule } from './uploads/uploads.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { InvitesModule } from './invites/invites.module';
import { PublicModule } from './public/public.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StatusesModule,
    TasksModule,
    CommentsModule,
    LabelsModule,
    TeamsModule,
    WorkspacesModule,
    ProjectsModule,
    UploadsModule,
    AttachmentsModule,
    InvitesModule,
    PublicModule,
  ],
})
export class AppModule {}