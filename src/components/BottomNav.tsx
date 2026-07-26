import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/programm', label: 'Programm', icon: '▦' },
  { to: '/verlauf', label: 'Verlauf', icon: '↗' },
  { to: '/bibliothek', label: 'Übungen', icon: '≡' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-20 border-t border-edge bg-ink/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                isActive ? 'text-accent' : 'text-zinc-500'
              }`
            }
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
