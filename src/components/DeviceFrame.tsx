import { useState, useRef, useEffect } from 'react';
import { Device } from '../data/devices';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';

interface DeviceFrameProps {
  device: Device;
  url: string;
  isFullscreen?: boolean;
  isLandscape?: boolean;
}

/**
 * DeviceFrame component renders a realistic device preview with:
 * - Dynamic scaling to fit container
 * - Realistic bezels, notches, and device features
 * - Loading and error states
 * - Landscape/portrait orientation support
 */
export default function DeviceFrame({ 
  device, 
  url, 
  isFullscreen = false,
  isLandscape = false 
}: DeviceFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState<'load' | 'blocked' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Swap width/height for landscape mode
  const deviceWidth = isLandscape ? device.height : device.width;
  const deviceHeight = isLandscape ? device.width : device.height;

  // Calculate dynamic scale based on container size
  useEffect(() => {
    if (!containerRef.current || isFullscreen) {
      setScale(isFullscreen ? 0.8 : 1);
      return;
    }

    const calculateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      // Target size for preview cards (consistent height)
      const targetHeight = 320;
      const targetWidth = 280;

      // Calculate scale to fit within target dimensions
      const scaleX = targetWidth / (deviceWidth + device.bezelWidth * 2);
      const scaleY = targetHeight / (deviceHeight + device.bezelWidth * 2);
      
      // Use the smaller scale to ensure it fits
      const newScale = Math.min(scaleX, scaleY, 0.4);
      setScale(Math.max(newScale, 0.1)); // Minimum scale of 0.1
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [deviceWidth, deviceHeight, device.bezelWidth, isFullscreen]);

  // Handle iframe load events
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    setErrorType(null);
  };

  // Handle iframe errors (including X-Frame-Options blocks)
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    setErrorType('load');
  };

  // Detect if iframe content was blocked (runs after load)
  const checkIfBlocked = (iframe: HTMLIFrameElement) => {
    try {
      // Try to access iframe content - will throw if blocked
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc || doc.body.innerHTML === '') {
        setHasError(true);
        setErrorType('blocked');
      }
    } catch {
      // Cross-origin or blocked - this is expected for most sites
      // Don't show error unless iframe truly failed to load
    }
  };

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

  // Total frame dimensions including bezel
  const totalWidth = deviceWidth + device.bezelWidth * 2;
  const totalHeight = deviceHeight + device.bezelWidth * 2;

  // Scaled dimensions for container
  const scaledWidth = totalWidth * scale;
  const scaledHeight = totalHeight * scale;

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center"
      style={{ 
        width: isFullscreen ? '100%' : `${scaledWidth}px`,
        height: isFullscreen ? '100%' : `${scaledHeight}px`,
      }}
    >
      {/* Device Frame Container */}
      <div
        className={`relative ${getBezelColor()} shadow-2xl transition-transform duration-300`}
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
        {device.hasNotch && device.type === 'phone' && !isLandscape && (
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-3xl z-10"
            style={{
              width: '150px',
              height: '34px',
            }}
          />
        )}

        {/* Dynamic Island for iPhone 14 Pro+ */}
        {device.hasDynamicIsland && !isLandscape && (
          <div 
            className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-10"
            style={{
              width: '126px',
              height: '37px',
            }}
          />
        )}

        {/* Home Button for older devices */}
        {device.hasHomeButton && !isLandscape && (
          <div 
            className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-gray-700 rounded-full border-2 border-gray-600 z-10"
            style={{
              width: '40px',
              height: '40px',
            }}
          />
        )}

        {/* Laptop notch (MacBook Pro style) */}
        {device.hasNotch && device.type === 'laptop' && (
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-lg z-10"
            style={{
              width: '200px',
              height: '24px',
            }}
          />
        )}

        {/* Screen Area */}
        <div 
          className="relative bg-white overflow-hidden"
          style={{
            width: `${deviceWidth}px`,
            height: `${deviceHeight}px`,
            borderRadius: `${Math.max(device.bezelRadius - device.bezelWidth, 4)}px`,
          }}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
              <span className="text-slate-500 text-sm">Loading preview...</span>
            </div>
          )}

          {/* Error Overlay */}
          {hasError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 z-20 p-4">
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
              <p className="text-slate-700 text-sm font-medium text-center">
                {errorType === 'blocked' 
                  ? 'This site blocks iframe embedding'
                  : 'Failed to load preview'
                }
              </p>
              <p className="text-slate-500 text-xs text-center mt-1">
                {errorType === 'blocked'
                  ? 'Try a different URL or open in new tab'
                  : 'Check the URL and try again'
                }
              </p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setHasError(false);
                  setErrorType(null);
                }}
                className="mt-3 flex items-center gap-1 text-blue-500 text-sm hover:text-blue-600"
              >
                <RotateCcw className="w-3 h-3" />
                Retry
              </button>
            </div>
          )}

          {/* Iframe Preview */}
          <iframe
            src={url}
            title={`${device.name} preview`}
            className="w-full h-full border-0 bg-white"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            onLoad={(e) => {
              handleLoad();
              checkIfBlocked(e.target as HTMLIFrameElement);
            }}
            onError={handleError}
            style={{ 
              pointerEvents: isFullscreen ? 'auto' : 'none',
            }}
          />
        </div>

        {/* Side buttons for phones */}
        {device.type === 'phone' && (
          <>
            {/* Power button */}
            <div 
              className="absolute bg-gray-700 rounded-sm"
              style={{
                right: '-3px',
                top: '120px',
                width: '3px',
                height: '60px',
              }}
            />
            {/* Volume buttons */}
            <div 
              className="absolute bg-gray-700 rounded-sm"
              style={{
                left: '-3px',
                top: '100px',
                width: '3px',
                height: '35px',
              }}
            />
            <div 
              className="absolute bg-gray-700 rounded-sm"
              style={{
                left: '-3px',
                top: '145px',
                width: '3px',
                height: '35px',
              }}
            />
          </>
        )}

        {/* Laptop base/keyboard hint */}
        {device.type === 'laptop' && (
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-600 to-gray-700 rounded-b-lg"
            style={{
              width: `${totalWidth * 0.95}px`,
              height: '8px',
            }}
          />
        )}

        {/* Monitor stand hint */}
        {device.type === 'desktop' && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="bg-gray-800 w-16 h-4 rounded-sm" />
            <div className="bg-gray-700 w-24 h-2 rounded-b-lg" />
          </div>
        )}
      </div>
    </div>
  );
}