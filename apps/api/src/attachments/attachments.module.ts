import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { AttachmentsService } from './attachments.service';
import { ActivityModule } from '../activity/activity.module';

@Module({ imports: [ActivityModule], controllers: [AttachmentsController], providers: [AttachmentsService] })
export class AttachmentsModule {}