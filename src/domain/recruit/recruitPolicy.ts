import { botConfig } from "../../config/botConfig";

export function isRecruitThread(parentId: string | null): boolean {
  return parentId === botConfig.channel.recruitForumParentId;
}
