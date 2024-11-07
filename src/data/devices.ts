export interface Device {
  name: string;
  width: number;
  height: number;
  icon: string;
}

export const devices: Device[] = [
  {
    name: 'iPhone 13',
    width: 390,
    height: 844,
    icon: 'smartphone',
  },
  {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    icon: 'tablet',
  },
  {
    name: 'MacBook Air',
    width: 1280,
    height: 832,
    icon: 'laptop',
  },
  {
    name: 'Desktop HD',
    width: 1920,
    height: 1080,
    icon: 'monitor',
  },
  {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    icon: 'smartphone',
  },
  {
    name: 'iPad Pro',
    width: 1024,
    height: 1366,
    icon: 'tablet',
  },
];