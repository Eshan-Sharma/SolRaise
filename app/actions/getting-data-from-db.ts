"use server"

import prisma from "@/prisma/db"

export async function getCampaigns() {
    try {
        const campaigns = await prisma.campaign.findMany({});
        console.log("campaigns", campaigns);

        return campaigns;
    } catch (e) {
        throw new Error(`Error while fetching campains ${e}`)
    }
}