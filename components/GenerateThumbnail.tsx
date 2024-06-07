import React, { useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { Label } from '@radix-ui/react-label'
import { Textarea } from './ui/textarea'
import { GenerateThumbnailProps } from '@/types'
import { Loader } from 'lucide-react'
import { Input } from './ui/input'
import Image from 'next/image'
import { useToast } from './ui/use-toast'
import { title } from 'process'
import { generateUploadUrl } from '@/convex/files'
import { useUploadFiles } from '@xixixao/uploadstuff/react'
import { useAction, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid';
const GenerateThumbnail = (props: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)
  const imageRef = useRef<HTMLInputElement>(null)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const getImageUrl = useMutation(api.podcast.getUrl)
  const { startUpload } = useUploadFiles(generateUploadUrl)
  const { toast } = useToast()
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction)
  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true)
    props.setImage('')
    try {
      const file = new File([blob], fileName, { type: 'image/png' })
      const uploaded = await startUpload([file])
      const storageId = (uploaded[0].response as any).storageId;
      props.setImageStorageId(storageId)
      const imageUrl = await getImageUrl({ storageId })
      props.setImage(imageUrl!)
      setIsImageLoading(false)
      //show the success message 
      toast({
        title: "Generate Successfully",
      })
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive' })
    }
  }

  const generateImage = async () => {
    try {
      const respone = await handleGenerateThumbnail({ prompt: props.imagePrompt })
      const blob = new Blob([respone], { type: 'image/png' })
      handleImage(blob, `thumbnail-${uuidv4()}`)
    } catch (error) {
      console.log(error)
      toast({ title: 'Error generating thumbnail', variant: 'destructive' })
    }

  }
  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    try {
      const files = e.target.files
      if (!files) return
      const file = files[0]
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]))
      handleImage(blob, file.name)
    } catch (error) {
      console.log(error)
      toast({ title: 'Error uploading image', variant: 'destructive' })
    }
  }
  return (
    <>
      <div className='generate_thumbnail'>
        <Button type="button" variant="plain" className={cn('', { 'bg-black-6': isAiThumbnail })} onClick={() => setIsAiThumbnail(true)}>
          Generate Thumbnail
        </Button>
        <Button type="button" variant="plain" className={cn('', { 'bg-black-6': !isAiThumbnail })} onClick={() => setIsAiThumbnail(false)}>
          Upload Image
        </Button>
      </div>
      {
        isAiThumbnail ? (
          <div className='flex flex-col gap-5 mt-5'>
            <div className='flex flex-col gap-2.5'>
              <Label className='text-16 font-bold text-white-1'>
                AI Prompt to generate Thumbnail
              </Label>
              <Textarea className='input-class font-light focus-visible:ring-offset-orange-1' placeholder='Please provide text...' rows={5}
                value={props.imagePrompt}
                onChange={(e) => props.setImagePrompt(e.target.value)}
              />
            </div>
            <div className='w-full max-w-[200px]'>
              <Button type="submit" className="text-16 bg-orange-1 py-4 font-bold text-white-1" onClick={generateImage}>
                {isImageLoading ? (
                  <>
                    Generating...
                    <Loader size={20} className="animate-spin ml-3" />
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className='image_div' onClick={() => imageRef?.current?.click()}>
            <Input type='file' className='hidden' ref={imageRef} onChange={(e) => uploadImage(e)} />
            {!isImageLoading ? (
              <Image src="/icons/upload-image.svg" width={40} height={40} alt="loading" />
            ) : (
              <div className='text-16 flex-center font-medium text-white-1'>
                Uploading...
                <Loader size={20} className="animate-spin ml-3" />
              </div>
            )}
            <div className='flex flex-col items-center gap-1'>
              <h2 className='text-12 font-bold text-orange-1'>Upload</h2>
              <p className='text-12 font-normal text-gray-1'>svg, png, jpg, gif</p>
            </div>
          </div>
        )
      }
      {props.image && (
        <div className='flex-center w-full'>
          <Image src={props.image} width={200} height={200} className='mt-5' alt='thumbnail' />
        </div>
      )}
    </>
  )
}

export default GenerateThumbnail