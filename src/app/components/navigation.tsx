import { Link } from '@/app/components/link';

export default function Navigation() {
  return (
    <nav className='w-full bg-blue-500 py-3'>
      <ul className='flex justify-center items-center gap-x-2'>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/about'>About</Link>
        </li>
        <li>
          <Link href='/contact'>Contact</Link>
        </li>
      </ul>
    </nav>
  );
}
