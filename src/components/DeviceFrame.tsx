import React, { useState } from 'react';
import { Device } from '../data/devices';
import { Loader2 } from 'lucide-react';

interface DeviceFrameProps {
  device: Device;
  url: string;
  isFullscreen?: boolean;
}

export default function DeviceFrame({ device, url, isFullscreen = false }: DeviceFrameProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const scale = isFullscreen ? 1 : 0.3;
  const frameStyle = {
    width: `${device.width}px`,
    height: `${device.height}px`,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  const containerStyle = {
    width: `${device.width * scale}px`,
    height: `${device.height * scale}px`,
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div
      className="relative bg-slate-800/50 rounded-lg p-4 border border-slate-700 overflow-hidden transition-all hover:border-blue-500/50"
      style={containerStyle}
    >
      <div
        className="bg-white rounded-lg overflow-hidden shadow-2xl"
        style={frameStyle}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
            <p className="text-red-400 text-sm">Failed to load content</p>
          </div>
        )}
        <iframe
          src={url}
          title={`${device.name} preview`}
          className="w-full h-full border-0 bg-white"
          sandbox="allow-same-origin allow-scripts allow-forms"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
}