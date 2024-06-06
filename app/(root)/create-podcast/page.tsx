
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import GeneratePodcast from "@/components/GeneratePodcast"
import GenerateThumbnail from "@/components/GenerateThumbnail"
import { Loader, Podcast } from "lucide-react"
import { Id } from "@/convex/_generated/dataModel"

const formSchema = z.object({
    podcastTitle: z.string().min(2),
    podcastDescription: z.string().min(2),
})
const VoiceCategories = ['Alloy', 'shimmer', 'nova', 'echo', 'fable', 'onyx']
const CreatePodcast = () => {
    const[imagePrompt, setImagePrompt] = useState('')
    const[imageStorageId, setImageStorageId] = useState<Id<"_storage">| null>(null)
    const[imageUrl, setImageUrl] = useState('')

    const[audioStorageId, setAudioStorageId] = useState<Id<"_storage">| null>(null)
    const[audioUrl, setAudioUrl] = useState('')
    const[AudioDuration, setAudioDuration] = useState(0)

    const[voiceType,setVoiceType] = useState<string | null >(null)
    const[voicePromp, setVoicePrompt] = useState('')

    const[isSubmit, setIsSubmit] = useState(false)
    // ...
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            podcastTitle: "",
            podcastDescription: "",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <section className="mt-10 flex flex-col">
            <h1 className='text-20 font-bold text-white-1'>
                Create podcast
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="mt-12 flex w-full flex-col">
                    <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
                        <FormField
                            control={form.control}
                            name="podcastTitle"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2.5 ">
                                    <FormLabel className="text-16 font-bold text-white-1">Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Podcast Title" {...field} className="input-class focus-visible:ring-orange-1" />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage className="text-white-1" />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col gap-2.5">
                            <Label className="text-16 font-bold text-white-1">
                                Select AI Voice
                            </Label>
                            <Select onValueChange={(value) => setVoiceType(value)}>
                                <SelectTrigger className={cn('text-16 w-full border-none bg-black-1 text-gray-1')}>
                                    <SelectValue placeholder="Select AI Voice" className="placeholder:text-gray-1"/>
                                </SelectTrigger>
                                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                                    {
                                    VoiceCategories.map((voice) =>(
                                        <SelectItem key={voice} value={voice} className="capitalize focus:bg-orange-1">
                                            {voice}
                                        </SelectItem>
                                    ))
                                    }
                                </SelectContent>
                                {voiceType && (
                                    <audio src={`/${voiceType}.mp3`}
                                    autoPlay
                                    className="hidden"
                                    />
                                )}
                            </Select>   
                        </div>
                        <FormField
                            control={form.control}
                            name="podcastDescription"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-2.5 ">
                                    <FormLabel className="text-16 font-bold text-white-1">Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter Description" {...field} className="input-class focus-visible:ring-orange-1" />
                                    </FormControl>
                                    <FormMessage className="text-white-1" />
                                </FormItem>
                            )}
                        />
                    </div>
                        <div className="flex flex-col pt-10">
                            <GeneratePodcast />
                            <GenerateThumbnail />
                        </div>
                        <div className="mt-10 w-full">
                        <Button type="submit" className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-white-1 hover:text-black-1 ">
                            {isSubmit ? (
                                <>
                                <Loader size={20} className="animate-spin mr-3"/>
                                Submitting...
                                </>
                            ): (
                                'Submit & Publish Podcast'
                            )}
                            </Button>
                        </div>
                </form>
            
            </Form>
        </section>
    )
}

export default CreatePodcast