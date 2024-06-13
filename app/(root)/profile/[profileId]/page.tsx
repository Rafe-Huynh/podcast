'use client'
import LoaderSpinner from '@/components/ui/LoaderSpinner'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'
import ProfileCard from '@/components/ProfileCard'
import PodcastCard from '@/components/PodcastCard'
import EmptyPodcast from '@/components/EmptyPodcast'
import { useUser } from '@clerk/nextjs'
const Profile = ({ params }: { params: { profileId: string } }) => {
  const {user} = useUser()
  const isOwner = user?.id === params.profileId
  const auth = useQuery(api.users.getUserById, { clerkId: params.profileId })
  const podcastData = useQuery(api.podcast.getPodcastByAuthorId, { authorId: params.profileId })
  if (!auth || !podcastData) return <LoaderSpinner />

  return (
    <section className='mt-6 flex flex-col'>
        <h1 className='text-20 font-bold text-white-1'>
          Welcome to {auth.name}&#39;s Profile
        </h1>
        <div className="mt-6 flex flex-col gap-6 max-md:items-center md:flex-row">
          <ProfileCard
            podcastData={podcastData!}
            imageUrl={auth?.imageUrl!}
            userFirstName={auth?.name!}
          />
        </div>
        <section className="mt-9 flex flex-col gap-5">
        <h1 className='text-20 font-bold text-white-2'>
            All Podcasts
        </h1>
        {
          podcastData && podcastData.podcasts.length > 0 ? (
            <div className='podcast_grid'>
              {
                podcastData?.podcasts?.slice(0,4).map((item) => (
                  <PodcastCard 
                  key = {item._id}
                  imgUrl= {item.imageUrl!}
                  title = {item.podcastTitle}
                  description= {item.podcastDescription}
                  podcastId={item._id}
                  />
                ))
              }
            </div>
          ): isOwner ? (
          
          <EmptyPodcast
            title="You have not created any podcasts yet"
            buttonLink="/create-podcast"
            buttonText="Create Podcast"
          /> 
          ) : <div className='flex text-20 font-bold text-white-1 justify-center'>
          {auth.name} doesn&#39;t have any podcast
          
          </div>
        }
          </section>
    </section>
  )
}

export default Profile