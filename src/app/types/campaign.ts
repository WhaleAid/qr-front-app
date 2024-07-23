import { User } from "./user";

export type CampaignBase = {
    _id: string,
    name: string,
    description: string,
    owner: string,
    createdAt: string,
    updatedAt: string,
} | {
    _id: string,
    name: string,
    description: string,
    owner: User,
    createdAt: string,
    updatedAt: string,
    generation: string,
} | {
    _id: string,
    name: string,
    description: string,
    createdAt: string,
}

export type CampaignWithOwner = CampaignBase & {
    owner: User,
    generation: string,
};

export type createCampaignArgs = {
    name: string,
    description: string,
    clientId: string,
}

export type Campaign = CampaignBase | CampaignWithOwner;

export function hasOwner(campaign: Campaign): campaign is CampaignWithOwner {
    return 'owner' in campaign;
}