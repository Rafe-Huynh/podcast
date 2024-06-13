import { GeneratePodcastProps } from '@/types'
import React, { useState } from 'react'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Loader } from 'lucide-react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
import {useUploadFiles} from '@xixixao/uploadstuff/react'
import { useToast } from "@/components/ui/use-toast"

const useGeneratePodcast = (props: GeneratePodcastProps) =>{
    //logic for podcast
    const[isGenerating, setIsGenerating] = useState(false)
    const { toast } = useToast()
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)
    const {startUpload} = useUploadFiles(generateUploadUrl)
    const getPodcastAudio = useAction(api.openai.generateAudioAction)
    const getAudioUrl = useMutation(api.podcast.getUrl)
    const generatePodcast = async () => {
        setIsGenerating(true)
        props.setAudio('')
        if(!props.voicePrompt){
            toast({
                title: "Please Provide a voiceType",
              })
            return setIsGenerating(false)
        }
        //calling from above useaction // get from generateAudioaction convex
        try {
            const response = await getPodcastAudio({
                voice: props.voiceType,
                input: props.voicePrompt
            })
            const blob = new Blob([response], {type:'/audio/mpeg'})
            const fileName = `podcast-${uuidv4()}.mp3`
            const file = new File([blob], fileName, {type: 'audio/mpeg'})
            const uploaded = await startUpload([file])
            const storageId = (uploaded[0].response as any).storageId;
            props.setAudioStorageId(storageId)
            const audioUrl = await getAudioUrl({storageId})
            props.setAudio(audioUrl!)
            setIsGenerating(false)
            //show the success message 
            toast({
                title: "Generate Successfully",
              })
        } catch (error) {
            console.log('Error generating podcast', error)
            setIsGenerating(false)
        }
    }
    return {
        isGenerating,
        generatePodcast
    }
}
const GeneratePodcast = (props: GeneratePodcastProps) => {
    const {isGenerating, generatePodcast} = useGeneratePodcast(props)
    return (
        <div>
            <div className='flex flex-col gap-2.5'>
                <Label className='text-16 font-bold text-white-1'>
                    AI Prompt to generate podcast
                </Label>
                <Textarea className='input-class font-light focus-visible:ring-offset-orange-1' placeholder='Please provide text...' rows={5}
                    value={props.voicePrompt}
                    onChange={(e) => props.setVoicePrompt(e.target.value)}
                />
            </div>
            <div className='mt-5 w-full max-w-[200px]'>
                <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generatePodcast}>
                    {isGenerating ? (
                        <>    
                            Generating...
                            <Loader size={20} className="animate-spin ml-3" />
                        </>
                    ) : (
                        'Generate'
                    )}
                </Button>
            </div>
            {props.audio && (
                <audio controls src={props.audio} autoPlay className='mt-5' onLoadedMetadata={(e) => props.setAudioDuration(e.currentTarget.duration)}/>
            )}
        </div>
    )
}

export default GeneratePodcast