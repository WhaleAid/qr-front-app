import { Campaign } from "./campaign";

export type Generation = {
    _id: string,
    text: string,
    panelId: string,
    valid: boolean,
    isModerated: boolean,
    campaign: string,
    createdAt: string,
    updatedAt: string,
} | {
    _id: string,
    text: string,
    panelId: string,
    valid: boolean,
    isModerated: boolean,
    campaign: Campaign,
    createdAt: string,
    updatedAt: string,
}

export type GenerationWithScans = Generation & {
    scanCount: number,
}