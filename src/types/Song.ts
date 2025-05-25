export interface Song {
    name: string;
    source: "spotify" | "youtube";
    url: string;
}