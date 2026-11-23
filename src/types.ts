export type Family = { id: number; name: string; inviteCode: string };

export type Member = { id: number; familyId: number; name: string; color: string };

export type Walk = { id: number; familyId: number; memberId: number; date: string; time: string };

export type NewWalk = { memberId: number; date: string; time: string };