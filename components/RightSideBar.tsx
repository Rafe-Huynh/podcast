'use client'
import {SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import Carousel from './Carousel';
import Header from './Header';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpinner from './ui/LoaderSpinner';
const RightSideBar = () => {
  const {user} = useUser();
  const topPodcast = useQuery(api.users.getTopUserByPodcastCount)
  const router = useRouter()
  if (!topPodcast) return <LoaderSpinner />
  return (
    <section className='right_sidebar text-white-1'>
        <SignedIn>
          <Link href={`/profile/${user?.id}`} className='flex w-full items-center justify-between gap-4 pb-12'>
          <UserButton />
          <div className='flex w-full items-center justify-between'> 
          <h1 className='text-16 truncate font-semibold text-white-1'>{user?.firstName} {user?.lastName}</h1>
          <Image src="/icons/right-arrow.svg" alt="arrow" height={24} width={24}/>
          </div>
          </Link>
        
        </SignedIn>
        <section>
          <Header headerTitle = "Fans Like You" 
          
          />
          <Carousel topPodcast = {topPodcast!}/>
        </section>
        <section className='flex flex-col gap-8 pt-12'>
      <Header headerTitle='Top Podcasters'/>
        <div className='flex flex-col gap-6'>
        {topPodcast?.slice(0,4).map((item) => (
          <div key={item._id} className='flex cursor-pointer justify-between' onClick={() => router.push(`/profile/${item.clerkId}`) }>
            <figure className='flex items-center gap-2'>
              <Image src={item.imageUrl} alt={item.name} width={44} height={44} className='aspect-square rounded-lg'/>
              <h2 className='text-14 font-semibold text-white-1'>{item.name} </h2>
            </figure>
            <div className='flex items-center'>
              <p className='text-12 font-normal'>{item.totalPodcasts} podcasts</p>
              </div>
            </div>
        ))
        }
        </div>
        </section>
    </section>
  )
}

export default RightSideBar