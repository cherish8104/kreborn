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

      {/* Side gutter decoration — visible only on wide screens */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 right-0 items-center justify-center pointer-events-none z-0">
        <div className="w-full max-w-[430px] h-full"
             style={{ boxShadow: '0 0 120px rgba(201,169,110,0.04)', border: '0 none' }} />
        {/* Left & right ambient glow */}
        <div className="absolute inset-0 flex justify-between pointer-events-none">
          <div style={{ width: 'calc((100% - 430px) / 2)',
                        background: 'linear-gradient(to right, transparent, rgba(201,169,110,0.015))' }} />
          <div style={{ width: 'calc((100% - 430px) / 2)',
                        background: 'linear-gradient(to left, transparent, rgba(201,169,110,0.015))' }} />
        </div>
      </div>

      {/* Mobile content area */}
      <div className="relative z-10 w-full max-w-[430px]"
           style={{ backgroundColor: '#0a0a0a',
                    boxShadow: '0 0 60px rgba(0,0,0,0.8)' }}>
        <Outlet />
      </div>
    </div>
  );
}
