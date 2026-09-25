import { botConfig } from "../../config/botConfig";

export default function isRecruitThread(parentId: string | null): boolean {
  return parentId === botConfig.channel.recruitForumParentId;
}
