import type { Family, Member, NewWalk, Walk } from "./types";

const API_URL = `http://${window.location.hostname}:5080/api`;

async function send<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const message = await res.json().catch(() => null);
    throw new Error(typeof message === "string" ? message : "Något gick fel.");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export type FamilyResponse = { family: Family; member: Member };

export function createFamily(familyName: string, name: string, color: string) {
  return send<FamilyResponse>("/families", {
    method: "POST",
    body: JSON.stringify({ familyName, name, color }),
  });
}

export function getInvite(code: string) {
  return send<{ family: Family; members: Member[] }>(`/invites/${code}`);
}

export function joinFamily(code: string, name: string, color: string) {
  return send<FamilyResponse>(`/invites/${code}/members`, {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export function getMembers(familyId: number) {
  return send<Member[]>(`/families/${familyId}/members`);
}

export function getWalks(familyId: number) {
  return send<Walk[]>(`/families/${familyId}/walks`);
}

export function createWalk(familyId: number, walk: NewWalk) {
  return send<Walk>(`/families/${familyId}/walks`, {
    method: "POST",
    body: JSON.stringify(walk),
  });
}

export function deleteWalk(familyId: number, id: number) {
  return send<void>(`/families/${familyId}/walks/${id}`, { method: "DELETE" });
}