import { Header } from '@/components/global/header';
import { Files } from '@/components/pages/upload/file-upload';
import { UploadedFiles } from '@/components/pages/upload/uploaded-files';
import { Fragment } from 'react';

export default function Page() {
  return (
    <Fragment>
      <Header />
      <main>
        <section>
          <div className='text-center py-4'>
            <h3>Detect AI-Generated or Real Content</h3>
            <p className='text-muted-foreground text-sm py-2'>Advanced AI Verification for Video, Text, Image, and Audio Files</p>
          </div>
          <Files />
          <UploadedFiles />
        </section>
      </main>
    </Fragment>
  );
}
