import { useState, useEffect, useCallback } from 'react';
import { Device, devices } from '../data/devices';
import { Loader2, AlertTriangle, ChevronDown, X, Play, Pause, ChevronRight } from 'lucide-react';

interface CombinedViewProps {
  url: string;
}

/**
 * CombinedView component displays phone, desktop, and tablet in a 3D carousel
 * with smooth animations, lightbox on click, and auto-play functionality
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
  
  // Lightbox state - which device is shown fullscreen
  const [lightboxDevice, setLightboxDevice] = useState<Device | null>(null);
  
  // Carousel rotation angle (0, 120, 240 degrees for 3 positions)
  const [rotationAngle, setRotationAngle] = useState(0);
  
  // Carousel play state
  const [isCarouselPlaying, setIsCarouselPlaying] = useState(false);

  // Rotate carousel by 120 degrees (moves to next device)
  const rotateCarousel = useCallback(() => {
    setRotationAngle(prev => prev + 120);
  }, []);

  // Auto-rotate carousel when playing
  useEffect(() => {
    if (!isCarouselPlaying) return;
    
    const interval = setInterval(rotateCarousel, 3000);
    return () => clearInterval(interval);
  }, [isCarouselPlaying, rotateCarousel]);

  // Calculate position for each device based on rotation angle
  // Each device is 120 degrees apart on a circular path
  const getDeviceStyle = (deviceIndex: number) => {
    // Device positions: 0 = phone, 1 = desktop, 2 = tablet
    // Each starts at different angle: phone=0°, desktop=120°, tablet=240°
    const baseAngle = deviceIndex * 120;
    const currentAngle = baseAngle - rotationAngle;
    
    // Normalize angle to 0-360
    const normalizedAngle = ((currentAngle % 360) + 360) % 360;
    
    // Convert angle to radians for calculations
    const radians = (normalizedAngle * Math.PI) / 180;
    
    // Carousel radius (how far devices are from center)
    const radius = 280;
    
    // Calculate X position on circular path
    const translateX = Math.sin(radians) * radius;
    
    // Calculate Z position (depth) - front is 0, back is negative
    const translateZ = Math.cos(radians) * 150 - 150;
    
    // Calculate Y rotation (devices face center)
    const rotateY = -normalizedAngle * 0.3;
    
    // Scale based on Z position (closer = bigger)
    const scale = 0.7 + (Math.cos(radians) + 1) * 0.2;
    
    // Opacity based on position (front is fully visible)
    const opacity = 0.5 + (Math.cos(radians) + 1) * 0.25;
    
    // Z-index based on Z position
    const zIndex = Math.round((Math.cos(radians) + 1) * 10);
    
    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex,
    };
  };

  // Get device by index (0=phone, 1=desktop, 2=tablet)
  const getDeviceByIndex = (index: number): Device => {
    switch (index) {
      case 0: return selectedPhone;
      case 1: return selectedDesktop;
      case 2: return selectedTablet;
      default: return selectedDesktop;
    }
  };

  // Get device label by index
  const getDeviceLabel = (index: number): string => {
    switch (index) {
      case 0: return 'Phone';
      case 1: return 'Desktop';
      case 2: return 'Tablet';
      default: return '';
    }
  };

  // Handle device click - open lightbox
  const handleDeviceClick = (device: Device) => {
    setLightboxDevice(device);
    setIsCarouselPlaying(false); // Pause carousel when opening lightbox
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxDevice(null);
  };

  return (
    <div className="w-full">
      {/* Device Selectors Row */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
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

      {/* Carousel Controls */}
      <div className="flex justify-center gap-3 mb-6">
        {/* Play/Pause Button */}
        <button
          onClick={() => setIsCarouselPlaying(!isCarouselPlaying)}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
            ${isCarouselPlaying
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
              : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700'
            }
          `}
        >
          {isCarouselPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Auto-Rotate
            </>
          )}
        </button>
        
        {/* Manual Next Button */}
        <button
          onClick={rotateCarousel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3D Carousel with smooth animation */}
      <div 
        className="relative flex items-center justify-center py-8 min-h-[520px] overflow-hidden"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center' }}
      >
        {/* Render all 3 devices with calculated 3D positions */}
        {[0, 1, 2].map((deviceIndex) => {
          const device = getDeviceByIndex(deviceIndex);
          const style = getDeviceStyle(deviceIndex);
          const label = getDeviceLabel(deviceIndex);
          
          return (
            <div
              key={`device-${deviceIndex}-${device.name}`}
              className="absolute cursor-pointer"
              style={{
                ...style,
                transformStyle: 'preserve-3d',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={() => handleDeviceClick(device)}
            >
              <DevicePreview 
                device={device} 
                url={url} 
                maxHeight={420}
                showLabel
              />
              {/* Device type label */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-center">
                <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reflection/Shadow effect */}
      <div className="flex justify-center mt-4">
        <div className="w-3/4 h-8 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-xl" />
      </div>

      {/* Click hint */}
      <p className="text-center text-slate-500 text-sm mt-2">
        Click any device to view fullscreen
      </p>

      {/* Lightbox Modal */}
      {lightboxDevice && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Blurred background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Device info */}
          <div className="absolute top-4 left-4 z-50 text-white">
            <h2 className="text-xl font-semibold">{lightboxDevice.name}</h2>
            <p className="text-slate-400">{lightboxDevice.width} × {lightboxDevice.height}</p>
          </div>
          
          {/* Fullscreen device preview */}
          <div 
            className="relative z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <DevicePreview 
              device={lightboxDevice} 
              url={url} 
              maxHeight={window.innerHeight * 0.8}
              isLightbox
            />
          </div>
        </div>
      )}
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
  isLightbox?: boolean; // When true, allows larger scale and pointer events
}

function DevicePreview({ device, url, maxHeight, showLabel, isLightbox = false }: DevicePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [url]);

  // Calculate scale to fit within maxHeight
  // For lightbox, allow larger scale; for normal view, cap at 0.35
  const totalHeight = device.height + device.bezelWidth * 2;
  const totalWidth = device.width + device.bezelWidth * 2;
  const maxScale = isLightbox ? 0.8 : 0.35;
  const scale = Math.min(maxHeight / totalHeight, maxScale);
  
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

            {/* Iframe Preview - allow interaction in lightbox mode */}
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
              style={{ pointerEvents: isLightbox ? 'auto' : 'none' }}
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
