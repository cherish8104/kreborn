import { createBrowserRouter } from 'react-router';
import { MobileLayout } from './components/MobileLayout';
import { Landing }      from './pages/Landing';
import { Registry }     from './pages/Registry';
import { Montage }      from './pages/Montage';
import { Reveal }       from './pages/Reveal';

export const router = createBrowserRouter([
  {
    Component: MobileLayout,
    children: [
      { path: '/',            Component: Landing },
      { path: '/registry',    Component: Registry },
      { path: '/montage',     Component: Montage },
      { path: '/reveal',      Component: Reveal },
      {
        // FullScript는 결제 후에만 진입 — react-router lazy()로 코드 스플리팅
        // 초기 번들에서 분리되어 해당 라우트 접근 시점에만 로드됨
        path: '/full-script',
        lazy: async () => {
          const { FullScript } = await import('./pages/FullScript');
          return { Component: FullScript };
        },
      },
    ],
  },
]);
