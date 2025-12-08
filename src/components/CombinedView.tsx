import { useState, useEffect } from 'react';
import { Device, devices } from '../data/devices';
import { Loader2, AlertTriangle, ChevronDown } from 'lucide-react';

interface CombinedViewProps {
  url: string;
}

/**
 * CombinedView component displays phone, desktop, and tablet side by side
 * with 3D perspective effect on phone and tablet for realistic showcase
 */
export default function CombinedView({ url }: CombinedViewProps) {
  // Get devices by type for selectors
  const phones = devices.filter(d => d.type === 'phone');
  const tablets = devices.filter(d => d.type === 'tablet');
  const desktops = [...devices.filter(d => d.type === 'desktop'), ...devices.filter(d => d.type === 'laptop')];

  // Selected devices state
  const [selectedPhone, setSelectedPhone] = useState<Device>(phones[0]);
  const [selectedTablet, setSelectedTablet] = useState<Device>(tablets[0]);
  const [selectedDesktop, setSelectedDesktop] = useState<Device>(desktops[0]);

  return (
    <div className="w-full">
      {/* Device Selectors Row */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Phone Selector */}
        <DeviceSelector
          label="Phone"
          devices={phones}
          selected={selectedPhone}
          onChange={setSelectedPhone}
        />
        
        {/* Desktop/Laptop Selector */}
        <DeviceSelector
          label="Desktop / Laptop"
          devices={desktops}
          selected={selectedDesktop}
          onChange={setSelectedDesktop}
        />
        
        {/* Tablet Selector */}
        <DeviceSelector
          label="Tablet"
          devices={tablets}
          selected={selectedTablet}
          onChange={setSelectedTablet}
        />
      </div>

      {/* Combined Device Display with 3D Perspective */}
      <div 
        className="relative flex items-center justify-center gap-4 lg:gap-8 py-8"
        style={{ perspective: '2000px' }}
      >
        {/* Phone - Left side with perspective rotation */}
        <div 
          className="flex-shrink-0 transition-transform duration-500"
          style={{ 
            transform: 'rotateY(25deg) translateZ(-50px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <DevicePreview 
            device={selectedPhone} 
            url={url} 
            maxHeight={400}
            showLabel
          />
        </div>

        {/* Desktop - Center (largest, no rotation) */}
        <div className="flex-shrink-0 z-10">
          <DevicePreview 
            device={selectedDesktop} 
            url={url} 
            maxHeight={450}
            showLabel
          />
        </div>

        {/* Tablet - Right side with perspective rotation */}
        <div 
          className="flex-shrink-0 transition-transform duration-500"
          style={{ 
            transform: 'rotateY(-25deg) translateZ(-50px)',
            transformStyle: 'preserve-3d',
          }}
        >
          <DevicePreview 
            device={selectedTablet} 
            url={url} 
            maxHeight={400}
            showLabel
          />
        </div>
      </div>

      {/* Reflection/Shadow effect */}
      <div className="flex justify-center mt-4">
        <div className="w-3/4 h-8 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-xl" />
      </div>
    </div>
  );
}

/**
 * Device selector dropdown component
 */
interface DeviceSelectorProps {
  label: string;
  devices: Device[];
  selected: Device;
  onChange: (device: Device) => void;
}

function DeviceSelector({ label, devices, selected, onChange }: DeviceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <label className="block text-xs text-slate-400 mb-1 text-center">{label}</label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-slate-800/70 border border-slate-700 rounded-lg hover:bg-slate-700/70 transition-colors min-w-[180px]"
      >
        <span className="flex-1 text-left text-sm text-white truncate">
          {selected.name}
        </span>
        <span className="text-xs text-slate-400">
          {selected.width}×{selected.height}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown list */}
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-auto">
            {devices.map((device) => (
              <button
                key={device.name}
                onClick={() => {
                  onChange(device);
                  setIsOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-slate-700/50 transition-colors
                  ${selected.name === device.name ? 'bg-blue-500/20 text-blue-400' : 'text-white'}
                `}
              >
                <span>{device.name}</span>
                <span className="text-xs text-slate-400">
                  {device.width}×{device.height}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Individual device preview with realistic frame
 */
interface DevicePreviewProps {
  device: Device;
  url: string;
  maxHeight: number;
  showLabel?: boolean;
}

function DevicePreview({ device, url, maxHeight, showLabel }: DevicePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  // Calculate scale to fit within maxHeight
  const totalHeight = device.height + device.bezelWidth * 2;
  const totalWidth = device.width + device.bezelWidth * 2;
  const scale = Math.min(maxHeight / totalHeight, 0.35);
  
  const scaledWidth = totalWidth * scale;
  const scaledHeight = totalHeight * scale;

  // Get bezel color based on device type
  const getBezelColor = () => {
    switch (device.type) {
      case 'phone':
        return 'bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800';
      case 'tablet':
        return 'bg-gradient-to-b from-gray-700 via-gray-800 to-gray-700';
      case 'laptop':
        return 'bg-gradient-to-b from-gray-600 via-gray-700 to-gray-600';
      case 'desktop':
        return 'bg-gradient-to-b from-gray-900 via-black to-gray-900';
      default:
        return 'bg-gray-800';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Device Frame Container */}
      <div
        className="relative flex items-center justify-center"
        style={{ 
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
        }}
      >
        <div
          className={`relative ${getBezelColor()} shadow-2xl`}
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
            borderRadius: `${device.bezelRadius}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            padding: `${device.bezelWidth}px`,
          }}
        >
          {/* Notch for modern iPhones */}
          {device.hasNotch && device.type === 'phone' && (
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-3xl z-10"
              style={{ width: '150px', height: '34px' }}
            />
          )}

          {/* Dynamic Island for iPhone 14 Pro+ */}
          {device.hasDynamicIsland && (
            <div 
              className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-10"
              style={{ width: '126px', height: '37px' }}
            />
          )}

          {/* Home Button for older devices */}
          {device.hasHomeButton && (
            <div 
              className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-gray-700 rounded-full border-2 border-gray-600 z-10"
              style={{ width: '40px', height: '40px' }}
            />
          )}

          {/* Laptop notch (MacBook Pro style) */}
          {device.hasNotch && device.type === 'laptop' && (
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-lg z-10"
              style={{ width: '200px', height: '24px' }}
            />
          )}

          {/* Screen Area */}
          <div 
            className="relative bg-white overflow-hidden"
            style={{
              width: `${device.width}px`,
              height: `${device.height}px`,
              borderRadius: `${Math.max(device.bezelRadius - device.bezelWidth, 4)}px`,
            }}
          >
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-20">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}

            {/* Error Overlay */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-20 p-4">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <p className="text-slate-600 text-xs text-center mt-1">Failed to load</p>
              </div>
            )}

            {/* Iframe Preview */}
            <iframe
              src={url}
              title={`${device.name} preview`}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
              style={{ pointerEvents: 'none' }}
            />
          </div>

          {/* Side buttons for phones */}
          {device.type === 'phone' && (
            <>
              <div 
                className="absolute bg-gray-700 rounded-sm"
                style={{ right: '-3px', top: '120px', width: '3px', height: '60px' }}
              />
              <div 
                className="absolute bg-gray-700 rounded-sm"
                style={{ left: '-3px', top: '100px', width: '3px', height: '35px' }}
              />
              <div 
                className="absolute bg-gray-700 rounded-sm"
                style={{ left: '-3px', top: '145px', width: '3px', height: '35px' }}
              />
            </>
          )}

          {/* Laptop base */}
          {device.type === 'laptop' && (
            <div 
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-lg"
              style={{ width: `${totalWidth * 0.95}px`, height: '8px' }}
            />
          )}

          {/* Monitor stand */}
          {device.type === 'desktop' && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
              <div className="bg-gray-800 w-16 h-4 rounded-sm" />
              <div className="bg-gray-700 w-24 h-2 rounded-b-lg" />
            </div>
          )}
        </div>
      </div>

      {/* Device Label */}
      {showLabel && (
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-white">{device.name}</p>
          <p className="text-xs text-slate-400">{device.width} × {device.height}</p>
        </div>
      )}
    </div>
  );
}
