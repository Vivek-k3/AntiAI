import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header>
      <div className='h-16 flex items-center justify-between px-5'>
        <div className='flex items-center justify-center'>
          <Link href={'/'} className='font-semibold'>
            <Image src={'/ui/logo.png'} width={100} className='h-[30px] w-auto' height={100} alt='Metaphy logo' loading='lazy' unoptimized />
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
