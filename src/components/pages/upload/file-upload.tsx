'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from 'react';

export function Files() {
  return (
    <div>
      <Tabs defaultValue='images' className='w-[400px] mx-auto bg-background p-3 rounded-2xl shadow-[0px_4px_24px_0px_hsla(0,0%,0%,0.1)]'>
        <TabsList className='w-full h-auto p-1.5 border rounded-xl text-foreground'>
          <TabsTrigger className='w-full px-5 py-3 rounded-lg border border-transparent data-[state=active]:border-primary-color' value='images'>
            Images
          </TabsTrigger>
          <TabsTrigger className='w-full px-5 py-3 rounded-lg border border-transparent data-[state=active]:border-primary-color' value='text'>
            Text
          </TabsTrigger>
          <TabsTrigger className='w-full px-5 py-3 rounded-lg border border-transparent data-[state=active]:border-primary-color' value='audio'>
            Audio
          </TabsTrigger>
          <TabsTrigger className='w-full px-5 py-3 rounded-lg border border-transparent data-[state=active]:border-primary-color' value='video'>
            Video
          </TabsTrigger>
        </TabsList>
        <TabsContent value='images' className='mt-3'>
          <UploadFile type='image' />
        </TabsContent>
        <TabsContent value='text' className='mt-3'>
          <TextInput />
        </TabsContent>
        <TabsContent value='audio' className='mt-3'>
          <UploadFile type='audio' />
        </TabsContent>
        <TabsContent value='video' className='mt-3'>
          <UploadFile type='video' />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface UploadFileProps {
  type: 'image' | 'audio' | 'video';
}

function UploadFile({ type }: UploadFileProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState({ status: true, url: '' });
  const inputRef = useRef<HTMLInputElement>(null);

  function updateFiles(inputFiles: FileList | null) {
    if (!inputFiles) {
      console.log('select file');
      return;
    }

    if (!inputFiles[0].type.startsWith(type)) {
      console.log(`select ${type} file`);
      return;
    }
    console.log(inputFiles);

    const blobUrl = URL.createObjectURL(inputFiles[0]);

    setPreview({ status: true, url: blobUrl });

    setFile(inputFiles[0]);
  }

  function dragPreventDefault(e: DragEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleDrop(e: DragEvent<HTMLFormElement>) {
    dragPreventDefault(e);

    updateFiles(e.dataTransfer.files);
  }
  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const inputFiles = e.target.files;
    updateFiles(inputFiles);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log('Selected file: ', file);
  }

  return (
    <form
      className='mx-3'
      onSubmit={handleSubmit}
      onDragEnter={dragPreventDefault}
      onDragLeave={dragPreventDefault}
      onDragOver={dragPreventDefault}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          'border-2 border-dashed relative z-50 hover:cursor-pointer rounded-xl h-64 flex items-center justify-center gap-4 flex-col duration-300 bg-muted',
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Cloud />
        <p className='text-xs font-medium'>You can drag or upload the image</p>
      </div>
      <input ref={inputRef} className='hidden' type='file' accept={`${type}/*`} multiple={false} onChange={handleChange} />
      <div className='pt-3 flex items-center justify-between gap-3'>
        <Button
          className='size-12 rounded-xl bg-muted border-border text-border'
          variant='outline'
          type='button'
          onClick={() => {
            setFile(null);
            setPreview({ status: false, url: '' });
          }}
        >
          <X />
        </Button>
        <Button className='w-full h-12 rounded-xl capitalize  bg-primary-color text-background' type='submit'>
          Upload {type}
        </Button>
      </div>
    </form>
  );
}

function TextInput() {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log('Selected file: ', text);
  }

  return (
    <form className='mx-3' onSubmit={handleSubmit}>
      <textarea
        className={cn('border-2 relative z-50 hover:cursor-pointer rounded-xl h-64 inline-block w-full resize-none p-4 bg-muted')}
        placeholder='Type your message'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className='pt-1 flex items-center justify-between gap-3'>
        <Button
          className='size-12 rounded-xl bg-muted border-border text-border'
          variant='outline'
          disabled={text.length === 0}
          type='button'
          onClick={() => {
            setText('');
          }}
        >
          <X />
        </Button>
        <Button className='w-full h-12 rounded-xl bg-primary-color text-background' type='submit' disabled={text.length === 0}>
          Vefiry Text
        </Button>
      </div>
    </form>
  );
}

function Cloud() {
  return (
    <svg width='52' height='49' viewBox='0 0 52 49' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <title>Upload file</title>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M24.7422 31.6955C25.0759 31.3622 25.5283 31.1749 26 31.1749C26.4717 31.1749 26.9241 31.3622 27.2579 31.6955L32.0046 36.4422C32.1794 36.6051 32.3197 36.8016 32.417 37.02C32.5143 37.2383 32.5666 37.474 32.5708 37.713C32.575 37.952 32.5311 38.1894 32.4415 38.4111C32.352 38.6327 32.2188 38.8341 32.0497 39.0031C31.8807 39.1721 31.6794 39.3054 31.4577 39.3949C31.2361 39.4844 30.9987 39.5284 30.7597 39.5241C30.5207 39.5199 30.285 39.4676 30.0666 39.3703C29.8483 39.273 29.6518 39.1328 29.4888 38.9579L27.78 37.2491V47.1934C27.78 47.6654 27.5925 48.1182 27.2587 48.452C26.9249 48.7858 26.4721 48.9734 26 48.9734C25.5279 48.9734 25.0752 48.7858 24.7414 48.452C24.4076 48.1182 24.22 47.6654 24.22 47.1934V37.2491L22.5112 38.9579C22.3483 39.1328 22.1518 39.273 21.9334 39.3703C21.7151 39.4676 21.4794 39.5199 21.2404 39.5241C21.0014 39.5284 20.764 39.4844 20.5423 39.3949C20.3207 39.3054 20.1193 39.1721 19.9503 39.0031C19.7813 38.8341 19.648 38.6327 19.5585 38.4111C19.469 38.1894 19.425 37.952 19.4292 37.713C19.4334 37.474 19.4858 37.2383 19.583 37.02C19.6803 36.8016 19.8206 36.6051 19.9955 36.4422L24.7422 31.6955Z'
        fill='black'
      />
      <path
        d='M27.1296 3.87995C20.6029 3.87995 15.3484 9.10128 15.3484 15.5022C15.3484 16.5986 15.5027 17.6595 15.7875 18.6611C16.967 19.0028 18.073 19.5155 19.0698 20.18C19.2748 20.3042 19.4526 20.4685 19.5926 20.6632C19.7326 20.8578 19.8318 21.0787 19.8843 21.3126C19.9368 21.5465 19.9415 21.7886 19.8982 22.0243C19.8548 22.2601 19.7643 22.4847 19.6321 22.6846C19.4998 22.8845 19.3285 23.0557 19.1284 23.1878C18.9284 23.3199 18.7037 23.4102 18.4679 23.4534C18.2321 23.4965 17.99 23.4916 17.7562 23.4389C17.5223 23.3862 17.3015 23.2868 17.107 23.1467C15.7232 22.2297 14.0987 21.7433 12.4387 21.7488C7.78457 21.7488 4.04657 25.4749 4.04657 30.0222C4.04657 34.5695 7.78457 38.2933 12.4387 38.2933C12.9108 38.2933 13.3635 38.4808 13.6973 38.8146C14.0311 39.1484 14.2187 39.6012 14.2187 40.0733C14.2187 40.5454 14.0311 40.9981 13.6973 41.3319C13.3635 41.6657 12.9108 41.8533 12.4387 41.8533C5.85742 41.8533 0.486572 36.575 0.486572 30.0222C0.486572 23.6023 5.6367 18.4095 12.0305 18.1959C11.8694 17.307 11.7884 16.4055 11.7884 15.5022C11.7884 7.09819 18.6758 0.319946 27.1296 0.319946C34.6246 0.319946 40.8854 5.64571 42.2121 12.7111C47.6708 15.0299 51.5132 20.396 51.5132 26.6711C51.5132 33.9667 46.3204 40.0353 39.4258 41.5115C38.9641 41.6103 38.4821 41.5217 38.0858 41.2651C37.6894 41.0085 37.4112 40.605 37.3124 40.1433C37.2136 39.6816 37.3022 39.1995 37.5588 38.8032C37.8154 38.4068 38.2189 38.1287 38.6806 38.0298C43.9969 36.8906 47.9532 32.2247 47.9532 26.6711C47.9532 21.5993 44.6543 17.2679 40.0311 15.6873C38.7888 15.2624 37.4849 15.0459 36.172 15.0465C34.7884 15.0465 33.4664 15.2838 32.237 15.711C31.7941 15.8556 31.3122 15.8208 30.8947 15.6141C30.4772 15.4073 30.1574 15.0451 30.0039 14.6052C29.8504 14.1654 29.8756 13.6828 30.0739 13.2612C30.2722 12.8397 30.6279 12.5126 31.0646 12.3504C33.3664 11.5468 35.8256 11.2988 38.2416 11.6265C37.412 9.34855 35.8996 7.38213 33.9108 5.99569C31.9221 4.60926 29.5539 3.87039 27.1296 3.87995Z'
        fill='black'
      />
    </svg>
  );
}
