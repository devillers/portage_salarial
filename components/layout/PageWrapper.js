import Header from './Header';
import Footer from './Footer';
import { cn } from '../../lib/utils';

export default function PageWrapper({ children, className, mainClassName }) {
  return (
    <div className={cn('flex min-h-screen flex-col bg-neutral-50 text-neutral-900', className)}>
      <Header />
      <main className={cn('flex-1 py-16 md:py-20', mainClassName)}>{children}</main>
      <Footer />
    </div>
  );
}
