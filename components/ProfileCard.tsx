import { PodcastProps, ProfileCardProps } from '@/types'
import React, { useEffect, useState } from 'react'
import LoaderSpinner from './ui/LoaderSpinner'
import Image from 'next/image'
import { useAudio } from '@/app/providers/AudioProvider'
import { Button } from './ui/button'
const ProfileCard = ({ podcastData, imageUrl, userFirstName }: ProfileCardProps) => {
    const { setAudio } = useAudio()
    const [randomPodcast, setRandomPodcast] = useState<PodcastProps | null>(null);
    const playRandomPodcast = () => {
        const randomIndex = Math.floor(Math.random() * podcastData.podcasts.length)
        setRandomPodcast(podcastData.podcasts[randomIndex])
    }
    useEffect(() => {
        if (randomPodcast) {
            setAudio({
                title: randomPodcast.podcastTitle,
                audioUrl: randomPodcast.audioUrl || "",
                imageUrl: randomPodcast.imageUrl || "",
                author: randomPodcast.author,
                podcastId: randomPodcast._id,
            })
        }
    }, [randomPodcast, setAudio])
    if (!imageUrl)
        return <LoaderSpinner />
    return (
        <div className='mt-6 flex flex-col max-md:justify-center md:flex-row'>
            <Image src={imageUrl} width={250} height={250} alt="pfp" className='aspect-square rounded-lg' />
            <div className='flex flex-col gap-5 ml-10 max-md:items-center md:gap-9'>
                <div className='text-32 font-extrabold tracking-[-0.32px] text-white-1'>
                    {userFirstName}
                </div>
                <figure className='flex gap-3'>
                    <Image src="/icons/headphone.svg" width={24} height={24} alt="headphone" />
                    <h2 className='text-16 font-bold text-white-1'>
                        {podcastData?.listeners} &nbsp;
                        <span className="font-normal text-white-2">monthly listeners</span>
                    </h2>
                </figure>
                {podcastData.podcasts.length > 0 && (<Button
                    onClick={playRandomPodcast}
                    className="text-16 bg-orange-1 font-extrabold text-white-1"
                >
                    <Image
                        src="/icons/Play.svg"
                        width={20}
                        height={20}
                        alt="random play"
                    />{" "}
                    &nbsp; Play a random podcast
                </Button>
                )}
            </div>
        </div>

    )
}

export default ProfileCard