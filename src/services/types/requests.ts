export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'inProgress' | 'done';

export type SkillRequest = {
  id: string;
  skillId: string;
  fromUserId: string;
  toUserId: string;
  status: RequestStatus;
  createdAt: string;
};
