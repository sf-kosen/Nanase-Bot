let reactionRoleMessageId = "";

export const reactionRoleMessageStore = {
  get: (): string => reactionRoleMessageId,
  set: (id: string): void => {
    reactionRoleMessageId = id;
  },
};
