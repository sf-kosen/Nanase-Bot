let reactionRoleMessageId = "";

const reactionRoleMessageStore = {
  get: (): string => reactionRoleMessageId,
  set: (id: string): void => {
    reactionRoleMessageId = id;
  },
};

export { reactionRoleMessageStore };
