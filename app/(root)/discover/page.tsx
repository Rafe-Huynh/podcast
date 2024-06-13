'use client'
import EmptyPodcast from '@/components/EmptyPodcast'
import PodcastCard from '@/components/PodcastCard'
import Searchbar from '@/components/Searchbar'
import LoaderSpinner from '@/components/ui/LoaderSpinner'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({searchParams: {search}} : {searchParams: {search:string}}) => {
    //search param pass proper infomation to api getpodcastsearch
    const podcastData = useQuery(api.podcast.getPodcastBySearch, { search:search || '' })

    return (
        <div className='flex flex-col gap-9'>
            <Searchbar />
            <div className='flex flex-col gap-9'>
                <h1 className='text-20 font-bold text-white-1'>
                    {!search ? 'Discover Podcast' : 'Search result for: '}
                    {search && <span className='text-white-2'>{search}</span>}
                </h1>
                {
                    podcastData ? (<>
                        {
                            podcastData.length > 0 ? (
                                <div className='podcast_grid'>
                                    {podcastData?.map((item) => (
                                        <PodcastCard
                                            key={item._id}
                                            imgUrl={item.imageUrl as string}
                                            title={item.podcastTitle}
                                            description={item.podcastDescription}
                                            podcastId={item._id}
                                        />
                                    ))}
                                </div>

                ) : <EmptyPodcast title="no result found" />
                        }
            </>) : (<LoaderSpinner />)
                }
        </div>
        </div >

    )
}

export default Discover