import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUrl = mutation({
    args: {
        storageId: v.id("_storage"),
    },
    handler: async(ctx, args) => {
        //get the file from the storage 
        return await ctx.storage.getUrl(args.storageId)
    }
})
export const createPodcast = mutation({
    args: {
        podcastTitle: v.string(),
        podcastDescription: v.string(),
        audioUrl: v.string(),
        imageUrl: v.string(),
        voiceType: v.string(),
        imagePrompt: v.string(),
        voicePrompt: v.string(),
        views: v.number(),
        AudioDuration: v.number(),
        audioStorageId: v.id('_storage')!,
        imageStorageId: v.id('_storage')!, 
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity()
        if(!identity){
            throw new ConvexError('Not Authenticated')
        }
        //if the email matches the identity then collect the record 
        const user = await ctx.db.query('users').filter((q) => q.eq(q.field('email'), identity.email)).collect()
        if(user.length === 0){
            throw new ConvexError('user not found')
        }
        const podcast = await ctx.db.insert('podcasts', {
            audioStorageId: args.audioStorageId,
            user: user[0]._id,
            podcastTitle: args.podcastTitle,
            podcastDescription: args.podcastDescription,
            audioUrl: args.audioUrl,
            imageUrl: args.imageUrl,
            imageStorageId: args.imageStorageId,
            author: user[0].name,
            authorId: user[0].clerkId,
            voicePrompt: args.voicePrompt,
            imagePrompt: args.imagePrompt,
            voiceType: args.voiceType,
            views: args.views,
            authorImageUrl: user[0].imageUrl,
            audioDuration: args.AudioDuration,
        })
        return podcast
    }
})
export const getTrendingPodcasts = query({
    handler:async(ctx) =>{
        const podcast = await ctx.db.query('podcasts').collect() //go to database and collect all the podcast
        return podcast
    }
})