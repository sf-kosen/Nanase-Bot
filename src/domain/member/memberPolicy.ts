import botConfig from "../../config/botConfig";

const STUDENT_ROLE_ID = botConfig.role.memberId;

function memberCountLabel(count: number): string {
  return `学生数: ${count}`;
}

function isStudentRoleChanged(oldHasRole: boolean, newHasRole: boolean): boolean {
  return oldHasRole !== newHasRole;
}

export { isStudentRoleChanged, memberCountLabel, STUDENT_ROLE_ID };
