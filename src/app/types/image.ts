import { Campaign } from "./campaign";

export type Image = {
    _id: string,
    image: string,
    hash: string,
    progress: number,
    status: string,
    status_reason: string,
    valid: boolean,
    isModerated: boolean,
    campaign: string,
    createdAt: string,
    updatedAt: string,
} | {
    _id: string,
    image: string,
    hash: string,
    progress: number,
    status: string,
    status_reason: string,
    valid: boolean,
    isModerated: boolean,
    campaign: Campaign,
    createdAt: string,
    updatedAt: string,
}

export type ImageWithScans = Image & {
    scanCount: number,
}