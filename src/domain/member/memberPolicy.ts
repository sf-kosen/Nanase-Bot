import botConfig from "../../config/botConfig";

export const STUDENT_ROLE_ID = botConfig.role.memberId;

export function memberCountLabel(count: number): string {
  return `学生数: ${count}`;
}

export function isStudentRoleChanged(oldHasRole: boolean, newHasRole: boolean): boolean {
  return oldHasRole !== newHasRole;
}
