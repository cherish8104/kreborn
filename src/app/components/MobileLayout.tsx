import { Outlet } from 'react-router';

/**
 * Mobile-only shell — constrains all pages to 430px (iPhone-sized)
 * and centers them on larger screens with a subtle side gutter.
 */
export function MobileLayout() {
  return (
    <div
      className="min-h-screen w-full flex justify-center"
      style={{ backgroundColor: '#050505' }}>

      {/* Content area */}
      <div className="relative z-10 w-full"
           style={{ backgroundColor: '#0a0a0a',
                    boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}>
        <Outlet />
      </div>
    </div>
  );
}
