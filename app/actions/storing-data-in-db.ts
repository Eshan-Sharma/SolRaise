'use server'

import prisma from "@/prisma/db"

export async function sendCampaignToDb(
    title: string,
    description: string,
    fundsGoal: number,
    duration: number,
    creatorWallet: string,
    imageUrl: string
) {
    try {
        const newCampaign = await prisma.campaign.create({
            data: {
                title,
                description,
                creatorWallet,
                fundsGoal,
                duration,
                imageUrl
            }
        })
        console.log(newCampaign)

    } catch (e) {
        throw new Error(`Error while sending data to db: ${e}`)
    }
}
