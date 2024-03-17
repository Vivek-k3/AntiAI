type UploadedFileCard = { route: 'image' | 'text' | 'audio' | 'video'; content: string } & (
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
    route: 'text',
    content: 'Some random Content',
    status: 'PENDING',
    predict: null,
    probability: null,
  },
  {
    route: 'image',
    content: '/ui/demo-pic.jpg',
    status: 'PENDING',
    predict: null,
    probability: null,
  },
  {
    route: 'text',
    content: '/ui/demo-pic.jpg',
    status: 'APPROVED',
    predict: 'AI Generated',
    probability: 99.31,
  },
];

export function UploadedFiles() {
  return (
    <div className='bg-background rounded-2xl my-4 p-5 max-w-[400px] mx-auto divide-y-2 divide-gray-300 space-y-5 shadow-[0px_4px_24px_0px_hsla(0,0%,0%,0.1)]'>
      {UPLOADED_FILES.map((val, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <UploadedFilePreview key={index} {...val} />
      ))}
    </div>
  );
}

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
