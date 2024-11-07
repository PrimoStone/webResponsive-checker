import React, { useState } from 'react';
import { MonitorSmartphone, ArrowRight } from 'lucide-react';
import DeviceFrame from './components/DeviceFrame';
import Header from './components/Header';
import { Device, devices } from './data/devices';

function App() {
  const [inputUrl, setInputUrl] = useState('https://stackblitz.com');
  const [currentUrl, setCurrentUrl] = useState('https://stackblitz.com');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsFullscreen(true);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleLoadUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateUrl(inputUrl)) {
      setIsValidUrl(true);
      setCurrentUrl(inputUrl);
    } else {
      setIsValidUrl(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleLoadUrl} className="max-w-2xl mx-auto mb-12">
          <div className="flex flex-col gap-2">
            <div className="relative flex-1">
              <MonitorSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="url"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setIsValidUrl(true);
                }}
                placeholder="Enter website URL (e.g., https://stackblitz.com)"
                className={`w-full pl-12 pr-4 py-3 bg-slate-800/50 border ${
                  isValidUrl ? 'border-slate-700' : 'border-red-500'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400`}
              />
            </div>
            {!isValidUrl && (
              <p className="text-red-400 text-sm">Please enter a valid URL (e.g., https://stackblitz.com)</p>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg flex items-center gap-2 font-medium transition-colors justify-center"
            >
              Load Website
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {isFullscreen && selectedDevice ? (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 px-4 py-2 bg-slate-800 rounded-lg text-white/60 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Close Preview
            </button>
            <DeviceFrame device={selectedDevice} url={currentUrl} isFullscreen />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {devices.map((device) => (
              <div
                key={device.name}
                onClick={() => handleDeviceClick(device)}
                className="group cursor-pointer bg-slate-800/30 rounded-xl p-6 hover:bg-slate-800/50 transition-colors"
              >
                <DeviceFrame device={device} url={currentUrl} />
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors">
                    {device.name}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {device.width} × {device.height}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;