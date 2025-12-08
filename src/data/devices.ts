// Device type categories for filtering
export type DeviceType = 'phone' | 'tablet' | 'laptop' | 'desktop';

// Device interface with extended properties for realistic rendering
export interface Device {
  name: string;
  width: number;
  height: number;
  type: DeviceType;
  // Frame styling properties
  bezelRadius: number;      // Corner radius of the device bezel
  bezelWidth: number;       // Width of the bezel around the screen
  hasNotch?: boolean;       // Whether device has a notch (modern iPhones)
  hasDynamicIsland?: boolean; // iPhone 14 Pro+ style
  hasHomeButton?: boolean;  // Older devices with physical home button
}

// Comprehensive device presets with realistic dimensions
export const devices: Device[] = [
  // === PHONES ===
  {
    name: 'iPhone 15 Pro',
    width: 393,
    height: 852,
    type: 'phone',
    bezelRadius: 47,
    bezelWidth: 12,
    hasDynamicIsland: true,
  },
  {
    name: 'iPhone 14',
    width: 390,
    height: 844,
    type: 'phone',
    bezelRadius: 47,
    bezelWidth: 12,
    hasNotch: true,
  },
  {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    type: 'phone',
    bezelRadius: 20,
    bezelWidth: 16,
    hasHomeButton: true,
  },
  {
    name: 'Samsung Galaxy S24',
    width: 360,
    height: 780,
    type: 'phone',
    bezelRadius: 38,
    bezelWidth: 10,
  },
  {
    name: 'Google Pixel 8',
    width: 412,
    height: 915,
    type: 'phone',
    bezelRadius: 40,
    bezelWidth: 10,
  },
  // === TABLETS ===
  {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    type: 'tablet',
    bezelRadius: 18,
    bezelWidth: 20,
  },
  {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    type: 'tablet',
    bezelRadius: 18,
    bezelWidth: 20,
  },
  {
    name: 'iPad Mini',
    width: 744,
    height: 1133,
    type: 'tablet',
    bezelRadius: 18,
    bezelWidth: 18,
  },
  {
    name: 'Samsung Galaxy Tab S9',
    width: 800,
    height: 1280,
    type: 'tablet',
    bezelRadius: 14,
    bezelWidth: 16,
  },
  // === LAPTOPS ===
  {
    name: 'MacBook Air 13"',
    width: 1280,
    height: 832,
    type: 'laptop',
    bezelRadius: 10,
    bezelWidth: 24,
  },
  {
    name: 'MacBook Pro 14"',
    width: 1512,
    height: 982,
    type: 'laptop',
    bezelRadius: 10,
    bezelWidth: 24,
    hasNotch: true,
  },
  {
    name: 'Laptop HD',
    width: 1366,
    height: 768,
    type: 'laptop',
    bezelRadius: 8,
    bezelWidth: 20,
  },
  // === DESKTOPS ===
  {
    name: 'Desktop HD',
    width: 1920,
    height: 1080,
    type: 'desktop',
    bezelRadius: 4,
    bezelWidth: 16,
  },
  {
    name: 'Desktop 2K',
    width: 2560,
    height: 1440,
    type: 'desktop',
    bezelRadius: 4,
    bezelWidth: 16,
  },
  {
    name: 'Ultrawide',
    width: 2560,
    height: 1080,
    type: 'desktop',
    bezelRadius: 4,
    bezelWidth: 16,
  },
];

// Helper to get devices by type
export const getDevicesByType = (type: DeviceType): Device[] => {
  return devices.filter(device => device.type === type);
};

// Device type labels for UI
export const deviceTypeLabels: Record<DeviceType, string> = {
  phone: 'Phones',
  tablet: 'Tablets',
  laptop: 'Laptops',
  desktop: 'Desktops',
};