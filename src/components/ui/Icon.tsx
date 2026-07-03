import type { SVGProps } from 'react';

export type IconName =
  | 'home'
  | 'deals'
  | 'clients'
  | 'accounting'
  | 'cash'
  | 'expenses'
  | 'income'
  | 'reports'
  | 'settings'
  | 'bell'
  | 'calendar'
  | 'chevron-down'
  | 'chevron-right'
  | 'sun'
  | 'moon'
  | 'wallet'
  | 'building'
  | 'trend-up'
  | 'coins'
  | 'alert'
  | 'plus'
  | 'check'
  | 'external';

/** Единый набор stroke-иконок 24×24 (стиль lucide) */
const PATHS: Record<IconName, ReactPath> = {
  home: ['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5', 'M9 21v-6h6v6'],
  deals: ['M7 16l-4-4 4-4', 'M3 12h13', 'M17 8l4 4-4 4', 'M21 12h-5'],
  clients: [
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
    'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    'M22 21v-2a4 4 0 0 0-3-3.87',
    'M16 3.13a4 4 0 0 1 0 7.75',
  ],
  accounting: [
    'M4 4h16v16H4z',
    'M8 4v16',
    'M12 9h5', 'M12 13h5', 'M12 17h3',
  ],
  cash: ['M2 7h20v10H2z', 'M12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z', 'M5 7v0', 'M19 17v0'],
  expenses: ['M12 4v12', 'M6 12l6 6 6-6', 'M4 21h16'],
  income: ['M12 20V8', 'M6 12l6-6 6 6', 'M4 21h16'],
  reports: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'],
  settings: [
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    'M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z',
  ],
  bell: [
    'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9',
    'M13.7 21a2 2 0 0 1-3.4 0',
  ],
  calendar: ['M8 2v4', 'M16 2v4', 'M3 8h18', 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 6 6 6-6 6'],
  sun: [
    'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z',
    'M12 1v2', 'M12 21v2', 'M4.22 4.22l1.42 1.42', 'M18.36 18.36l1.42 1.42',
    'M1 12h2', 'M21 12h2', 'M4.22 19.78l1.42-1.42', 'M18.36 5.64l1.42-1.42',
  ],
  moon: ['M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z'],
  wallet: ['M20 7H4a2 2 0 0 1 0-4h14v4', 'M4 5v14a2 2 0 0 0 2 2h14V7', 'M16 14h2'],
  building: ['M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18', 'M2 22h20', 'M9 6h2', 'M13 6h2', 'M9 10h2', 'M13 10h2', 'M9 14h2', 'M13 14h2', 'M10 22v-4h4v4'],
  'trend-up': ['M22 7l-8.5 8.5-5-5L2 17', 'M16 7h6v6'],
  coins: ['M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z', 'M18.09 10.37A6 6 0 1 1 10.34 18', 'M7 6h1v4', 'M16.71 13.88l.7.71-2.82 2.82'],
  alert: ['M12 9v4', 'M12 17h.01', 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z'],
  plus: ['M12 5v14', 'M5 12h14'],
  check: ['M20 6 9 17l-5-5'],
  external: ['M15 3h6v6', 'M10 14 21 3', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'],
};

type ReactPath = string[];

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}
