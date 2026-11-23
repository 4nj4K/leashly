import type { Walk } from "./data/mockData";

const API_URL = `http://${window.location.hostname}:5080/api`;

export async function getWalks(): Promise<Walk[]> {
  const res = await fetch(`${API_URL}/walks`);
  if (!res.ok) throw new Error("Kunde inte hämta promenader");
  return res.json();
}

export async function createWalk(walk: Walk): Promise<Walk> {
  const res = await fetch(`${API_URL}/walks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(walk),
  });
  if (!res.ok) throw new Error("Kunde inte spara promenaden");
  return res.json();
}

export async function deleteWalk(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/walks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Kunde inte ta bort promenaden");
}