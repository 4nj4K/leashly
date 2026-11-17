export type Member = {
    id: string;
    name: string;
    color: string;
};

export type Walk = {
    id: number;
    memberId: string;
    date: string;
    time: string;
};

export const members: Member[] = [
    { id: "anja", name: "Anja", color: "orchid" },
    { id: "mamma", name: "Mamma", color: "mint" },
    { id: "pappa", name: "Pappa", color: "blue" },
    { id: "lillebror", name: "Lillebror", color: "lime" }, 
];

const times = ["07:15", "12:40", "17:30", "21:10"];

export const walks: Walk[] = [];

let id = 1;
for (let day = 1; day <= 17; day++) {
    const count = (day % 3) + 1;
    for (let i = 0; i < count; i++) {
        walks.push({
            id: id++,
            memberId: members[(day + i) % members.length].id,
            date: `2026-11-${String(day).padStart(2, "0")}`,
            time: times[i],     
        })
    }
}