"use client"
import { useEffect, useState } from 'react';
import { supabase } from "@/lib/utils/db";



type UploadedFileCard = { route: 'image' | 'text' | 'audio' | 'video'; content: string; request_id : string } & (
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

const UPLOADED_FILES: UploadedFileCard[] = [
  {
    request_id:'123456',
    route: 'text',
    content: 'Some random Content',
    status: 'PENDING',
    predict: null,
    probability: null,
  },
  {
    request_id:'123454',
    route: 'image',
    content: '/ui/demo-pic.jpg',
    status: 'PENDING',
    predict: null,
    probability: null,
  },
  {
    request_id:'123458',
    route: 'text',
    content: '/ui/demo-pic.jpg',
    status: 'APPROVED',
    predict: 'AI Generated',
    probability: 99.31,
  },
];

export function UploadedFiles(){
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileCard[]>([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      const { data, error } = await supabase.from('queue').select('*');
      if (error) {
        console.error('Error fetching uploaded files:', error.message);
        return;
      }
      setUploadedFiles(data);
    };

    // Fetch initial data
    fetchUploadedFiles();

    // Create a function to handle inserts
    const handleInserts = (payload: any) => {
      console.log('New file inserted:', payload.new)
      setUploadedFiles(prevFiles => [payload.new, ...prevFiles]);
    };

    // Create a function to handle updates
    const handleUpdates = (payload: any) => {
      console.log('File updated:', payload.new)
      setUploadedFiles(prevFiles => {
        const updatedFileIndex = prevFiles.findIndex(file => file.request_id === payload.new.id);
        if (updatedFileIndex !== -1) {
          const updatedFiles = [...prevFiles];
          updatedFiles[updatedFileIndex] = payload.new;
          return updatedFiles;
        }
        return prevFiles;
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
  }, []);
  console.log(uploadedFiles)
  return (
    <div className='bg-background rounded-2xl my-4 p-5 max-w-[400px] mx-auto divide-y-2 divide-gray-300 space-y-5 shadow-[0px_4px_24px_0px_hsla(0,0%,0%,0.1)]'>
      {uploadedFiles.map((val, index) => (
        <UploadedFilePreview key={index} {...val} />
      ))}
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
  return (
    <div className='flex items-center justify-start gap-5 first:pt-0 pt-5'>
      <div className='border border-primary-color rounded-lg w-16 h-12 flex items-center justify-center'>image</div>
      <div className=''>
        <p className='uppercase text-muted-foreground text-xs font-medium'>{route}</p>
        {status === 'PENDING' ? (
          <div>
            <p className='text-primary-color font-medium text-sm'>Loading...</p>
          </div>
        ) : (
          <div className='text-sm text-muted-foreground font-medium'>
            <p>
              Predict: <span className='font-semibold text-foreground'>{predict}</span>
            </p>
            <p>Probability: {probability}</p>
          </div>
        )}
      </div>
    </div>
  );
}
