import botConfig from "../../config/botConfig";

function isRecruitThread(parentId: string | null): boolean {
  return parentId === botConfig.channel.recruitForumParentId;
}

export { isRecruitThread };
