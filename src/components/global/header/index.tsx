import { Button } from '@/components/ui/button';
import { APP } from '@/constants/header';
import Link from 'next/link';

export function Header() {
  return (
    <header>
      <div className='h-16 flex items-center justify-between border-b px-5'>
        <div className='flex items-center justify-center'>
          <Link href={'/'} className='font-semibold'>
            {APP.name}
          </Link>
        </div>
        <nav className='flex items-center justify-center sm:gap-5 gap-3'>
          <Button type='button' size='lg'>
            <Link href={'/auth/signin'}>Signin</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
