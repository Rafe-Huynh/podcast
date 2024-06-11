'use client'
import {SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import Carousel from './Carousel';
import Header from './Header';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
const RightSideBar = () => {
  const {user} = useUser();
  const topPodcast = useQuery(api.users.getTopUserByPodcastCount)

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
    </section>
  )
}

export default RightSideBar