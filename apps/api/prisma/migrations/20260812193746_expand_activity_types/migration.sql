-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ActivityType" ADD VALUE 'TITLE_CHANGED';
ALTER TYPE "ActivityType" ADD VALUE 'DESCRIPTION_CHANGED';
ALTER TYPE "ActivityType" ADD VALUE 'LABEL_ADDED';
ALTER TYPE "ActivityType" ADD VALUE 'LABEL_REMOVED';
ALTER TYPE "ActivityType" ADD VALUE 'TEAM_ADDED';
ALTER TYPE "ActivityType" ADD VALUE 'TEAM_REMOVED';
ALTER TYPE "ActivityType" ADD VALUE 'LOCKED';
ALTER TYPE "ActivityType" ADD VALUE 'UNLOCKED';
ALTER TYPE "ActivityType" ADD VALUE 'SUBTASK_ADDED';
ALTER TYPE "ActivityType" ADD VALUE 'SUBTASK_DELETED';
ALTER TYPE "ActivityType" ADD VALUE 'ATTACHMENT_ADDED';
