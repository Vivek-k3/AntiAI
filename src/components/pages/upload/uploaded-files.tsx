'use client';

import { supabase } from '@/lib/utils/db';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type UploadedFileCard = { route: 'image' | 'text' | 'audio' | 'video'; content: string; request_id: string; created_at: number } & (
  
  | {
      status: 'PENDING';
      predict: null;
      probability: null;
    }
  | {
      status: 'APPROVED';
      predict: string;
      probability: number;
    }
);

// const UPLOADED_FILES: UploadedFileCard[] = [
//   {
//     request_id: '123456',
//     route: 'text',
//     content: 'Some random Content',
//     status: 'PENDING',
//     predict: null,
//     probability: null,

//   },
//   {
//     request_id: '123454',
//     route: 'image',
//     content: '/ui/demo-pic.jpg',
//     status: 'PENDING',
//     predict: null,
//     probability: null,
//   },
//   {
//     request_id: '123458',
//     route: 'text',
//     content: '/ui/demo-pic.jpg',
//     status: 'APPROVED',
//     predict: 'AI Generated',
//     probability: 99.31,
//   },
// ];

export function UploadedFiles() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileCard[]>([]);
  const [isModalOpen , setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileCard | null>(null);
  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const { data, error } = await supabase.from('queue').select('*').order('created_at', { ascending: false }).range(0,9) ;
      if (error) {
        console.error('Error fetching uploaded files:', error.message);
        return;
      }
      setUploadedFiles(data);
    };

    // Fetch initial data
    fetchUploadedFiles();

    // Create a function to handle inserts
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const handleInserts = (payload: any) => {
      setUploadedFiles((prevFiles) => [payload.new, ...prevFiles]);
    };

    // Create a function to handle updates
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // const handleUpdates = (payload: any) => {
    //   console.log('File updated:', payload.new);
    //   setUploadedFiles((prevFiles) => {
    //     const updatedFileIndex = prevFiles.findIndex((file) => file.request_id === payload.new.id);
    //     console.log("updatedfileindex",updatedFileIndex)
    //     if (updatedFileIndex !== -1) {
    //       const updatedFiles = [...prevFiles];
    //       updatedFiles[updatedFileIndex] = payload.new;
    //       return updatedFiles;
    //     }
    //     return prevFiles;
    //   });
    // };
    const handleUpdates = (payload: any) => {
      
      setUploadedFiles((prevFiles) => {
        const updatedFiles = prevFiles.map((file) => 
          file.request_id === payload.new.id ? payload.new : file
        );
        return updatedFiles;
      });
    };

    // Listen to inserts and updates
    const subscription = supabase
      .channel('queue')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'queue' }, handleInserts)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'queue' }, handleUpdates)
      .subscribe();

    

    // Cleanup subscription on unmount
    return () => {
      // supabase.unsubscribe(subscription);
    };
  }, [uploadedFiles]);
  const openModal = (file: UploadedFileCard) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedFile(null);
    setIsModalOpen(false);
  };
  return (
    
    <div className='bg-background rounded-2xl my-4 p-5 min-w-[300px]  max-w-[400px] max-h-[900px]  mx-auto divide-y-2 divide-gray-300 space-y-5 shadow-[0px_4px_24px_0px_hsla(0,0%,0%,0.1)]'>
      <p className='text-2xl font-medium'>Request Queue...</p>
      
      {uploadedFiles.slice(-10).map((val, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <div key={index}  className='cursor-pointer pt-2'>
          <UploadedFilePreview {...val} />
        </div>
      ))}
       {isModalOpen  && (
        <Modal onClose={()=> closeModal()}>
          {/* <ModalPreview {...selectedFile} /> */}
          <h1></h1>
        </Modal>
      )}
    </div>
  );
}

// export function UploadedFiles() {
//   return (
//     <div className='bg-background rounded-2xl my-4 p-5 max-w-[400px] mx-auto divide-y-2 divide-gray-300 space-y-5 shadow-[0px_4px_24px_0px_hsla(0,0%,0%,0.1)]'>
//       {uploadedFiles.map((val, index) => (
//         // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
//         <UploadedFilePreview key={index} {...val} />
//       ))}
//     </div>
//   );
// }

function UploadedFilePreview({ route, content, predict, probability, status }: UploadedFileCard) {
  function PreviewFile() {
    if (route === 'image')
      return (
        <div className='overflow-hidden border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={content} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
        </div>
      );
    if (route === 'text')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
        </div>
      );
    if (route === 'audio')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
          {/* <audio src={content} />
            {/* <track kind='captions' />
          </audio>    */} 

        </div>
      );
    if (route === 'video')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          {/* <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized /> */}
          <video src={content} className='w-full inline-block h-12 rounded-lg' width={100} height={100}  />      
        </div>
      );
  }
  
  return (
    <div className='flex items-center justify-start gap-5 first:pt-0 pt-5'>
      <div>
        <PreviewFile />
      </div>
      <div className=''>
        <p className='uppercase text-muted-foreground text-xs font-medium'>{route}</p>
        {route == 'text' &&(
          <div className='text-sm text-muted-foreground font-medium'>
            Content: {content.length > 100 ? content.substring(0, 20) + '...' : content}
          </div>
        )}
        {status === 'PENDING' ? (
          <div>
            <p className='text-primary-color font-medium text-sm'>Loading...</p>
          </div>
        ) : (
          <div className='text-sm text-muted-foreground font-medium'>
            <p>
              Predict: <span className='font-semibold text-foreground'>{predict ? 'AI Generated' : 'Human Generated'}</span>
            </p>
            <p>Probability: {probability}</p>
          </div>
        )}
      </div>
    </div>
  );
}


function ModalPreview({ route, content, predict, probability, status }: UploadedFileCard) {
  function PreviewFile() {
    if (route === 'image')
      return (
        <div className='overflow-hidden border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={content} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
        </div>
      );
    if (route === 'text')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
        </div>
      );
    if (route === 'audio')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized />
          {/* <audio src={content} />
            {/* <track kind='captions' />
          </audio>    */} 

        </div>
      );
    if (route === 'video')
      return (
        <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>
          {/* <Image src={'/ui/test-pic.jpg'} className='w-full inline-block h-12 rounded-lg' width={100} height={100} alt={'preview'} unoptimized /> */}
          <video src={content} className='w-full inline-block h-12 rounded-lg' width={100} height={100}  />      
        </div>
      );
  }

  return(
    <div className='bg-white rounded-2xl my-4 p-5 w-[400px] h-[400px] mx-auto'>
      <h1>{route}</h1>
      <PreviewFile/>

    </div>
  )

}

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ onClose, children }: ModalProps) {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex items-left justify-left bg-black bg-opacity-50'>
      <div >{children}</div>
      <div className='fixed top-0 left-0 w-full h-full cursor-pointer' onClick={onClose}></div>
    </div>
  );
}