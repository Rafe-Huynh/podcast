"use client";
import { PodcastDetailPlayerProps } from '@/types'
import React from 'react'
import LoaderSpinner from './ui/LoaderSpinner'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { Button } from './ui/button';
const PodcastDetailPlayer = ({ audioUrl,
    podcastTitle,
    author,
    imageUrl,
    podcastId,
    imageStorageId,
    audioStorageId,
    isOwner,
    authorImageUrl,
    authorId,}:PodcastDetailPlayerProps) => {
    const router = useRouter()
    if(!imageUrl || !authorImageUrl){
        return <LoaderSpinner />
    }
  return (
    <div className="mt-6 flex w-full justify-between max-md:justify-center">
    <div className="flex flex-col gap-8 max-md:items-center md:flex-row">
      <Image
        src={imageUrl}
        width={250}
        height={250}
        alt="Podcast image"
        className="aspect-square rounded-lg"
      />
      <div className="flex w-full flex-col gap-5 max-md:items-center md:gap-9">
        <article className="flex flex-col gap-2 max-md:items-center">
          <h1 className="text-32 font-extrabold tracking-[-0.32px] text-white-1">
            {podcastTitle}
          </h1>
          <figure
            className="flex cursor-pointer items-center gap-2"
            onClick={() => {
              router.push(`/profile/${authorId}`);
            }}
          >
            <Image
              src={authorImageUrl}
              width={30}
              height={30}
              alt="Caster icon"
              className="size-[30px] rounded-full object-cover"
            />
            <h2 className="text-16 font-normal text-white-3">{author}</h2>
          </figure>
        </article>
            <Button
            
            className="text-16 w-full max-w-[250px] bg-orange-1 font-extrabold text-white-1"
          >
            <Image
              src="/icons/Play.svg"
              width={20}
              height={20}
              alt="random play"
            />{" "}
            &nbsp; Play podcast
          </Button>
        </div>
     </div>
     {isOwner && (
        <div className="relative mt-2">
          <Image
            src="/icons/three-dots.svg"
            width={20}
            height={30}
            alt="Three dots icon"
            className="cursor-pointer"
            //onClick={() => setIsDeleting((prev) => !prev)}
          />
        </div>
        )}

    </div>
  )
}

export default PodcastDetailPlayer