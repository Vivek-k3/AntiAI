import { Header } from '@/components/global/header';
import Link from 'next/link';
import { Fragment } from 'react';

export default function Home() {
  return (
    <Fragment>
      <Header />
      <main>
        <Link href={'/uplaod'}>Upload files</Link>
      </main>
    </Fragment>
  );
}
