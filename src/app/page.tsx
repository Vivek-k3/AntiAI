import { Header } from '@/components/global/header';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Page() {
  return (
    <Fragment>
      <Header />
      <main>
        <Link href={'/upload'}>Upload files</Link>
      </main>
    </Fragment>
  );
}
