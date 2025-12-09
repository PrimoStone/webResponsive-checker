import { useState, FormEvent } from 'react';
import { 
  MonitorSmartphone, 
  ArrowRight, 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor,
  RotateCw,
  X,
  Maximize2,
  ExternalLink,
  LayoutGrid,
  Layers
} from 'lucide-react';
import DeviceFrame from './components/DeviceFrame';
import CombinedView from './components/CombinedView';
import Header from './components/Header';
import { Device, devices, DeviceType, deviceTypeLabels } from './data/devices';

// View mode type for switching between grid and combined view
type ViewMode = 'grid' | 'combined';

function App() {
  // URL state
  const [inputUrl, setInputUrl] = useState('https://example.com');
  const [currentUrl, setCurrentUrl] = useState('https://example.com');
  const [isValidUrl, setIsValidUrl] = useState(true);
  
  // Device selection and view state
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  
  // Filter state - null means show all devices
  const [activeFilter, setActiveFilter] = useState<DeviceType | null>(null);

  // View mode state - grid shows all devices, combined shows phone/desktop/tablet side by side
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Get icon component for device type
  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'phone': return Smartphone;
      case 'tablet': return Tablet;
      case 'laptop': return Laptop;
      case 'desktop': return Monitor;
    }
  };

  // Filter devices based on active filter
  const filteredDevices = activeFilter 
    ? devices.filter(d => d.type === activeFilter)
    : devices;

  // Handle device card click - open fullscreen preview
  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsFullscreen(true);
  };

  // Normalize URL - auto-add https:// if protocol is missing
  const normalizeUrl = (url: string): string => {
    let normalized = url.trim();
    // If no protocol, add https://
    if (normalized && !normalized.match(/^https?:\/\//i)) {
      normalized = 'https://' + normalized;
    }
    return normalized;
  };

  // Validate URL format
  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission to load new URL
  const handleLoadUrl = (e: FormEvent) => {
    e.preventDefault();
    const normalizedUrl = normalizeUrl(inputUrl);
    
    if (validateUrl(normalizedUrl)) {
      setIsValidUrl(true);
      setInputUrl(normalizedUrl); // Update input to show full URL
      setCurrentUrl(normalizedUrl);
    } else {
      setIsValidUrl(false);
    }
  };

  // Toggle landscape/portrait orientation
  const toggleOrientation = () => {
    setIsLandscape(!isLandscape);
  };

  // Filter button component for device types
  const FilterButton = ({ type, label }: { type: DeviceType | null; label: string }) => {
    const isActive = activeFilter === type;
    const Icon = type ? getDeviceIcon(type) : null;
    
    return (
      <button
        onClick={() => setActiveFilter(type)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
          ${isActive 
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25' 
            : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }
        `}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* URL Input Form */}
        <form onSubmit={handleLoadUrl} className="max-w-3xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MonitorSmartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => {
                  setInputUrl(e.target.value);
                  setIsValidUrl(true);
                }}
                placeholder="Enter website URL (e.g., example.com)"
                className={`
                  w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  text-white placeholder-slate-400 transition-all
                  ${isValidUrl ? 'border-slate-700' : 'border-red-500'}
                `}
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center gap-2 font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 justify-center"
            >
              Load
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {!isValidUrl && (
            <p className="text-red-400 text-sm mt-2 ml-1">
              Please enter a valid URL including https://
            </p>
          )}
        </form>

        {/* View Mode Toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
              ${viewMode === 'grid'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700'
              }
            `}
          >
            <LayoutGrid className="w-4 h-4" />
            Grid View
          </button>
          <button
            onClick={() => setViewMode('combined')}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all
              ${viewMode === 'combined'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border border-slate-700'
              }
            `}
          >
            <Layers className="w-4 h-4" />
            Combined View
          </button>
        </div>

        {/* Device Type Filter Tabs - only show in grid view */}
        {viewMode === 'grid' && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <FilterButton type={null} label="All Devices" />
            <FilterButton type="phone" label={deviceTypeLabels.phone} />
            <FilterButton type="tablet" label={deviceTypeLabels.tablet} />
            <FilterButton type="laptop" label={deviceTypeLabels.laptop} />
            <FilterButton type="desktop" label={deviceTypeLabels.desktop} />
          </div>
        )}

        {/* Orientation Toggle (for phones/tablets) - only show in grid view */}
        {viewMode === 'grid' && (activeFilter === 'phone' || activeFilter === 'tablet') && (
          <div className="flex justify-center mb-6">
            <button
              onClick={toggleOrientation}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all
                ${isLandscape 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'bg-slate-800/50 text-slate-400 hover:text-white'
                }
              `}
            >
              <RotateCw className={`w-4 h-4 transition-transform ${isLandscape ? 'rotate-90' : ''}`} />
              {isLandscape ? 'Landscape Mode' : 'Portrait Mode'}
            </button>
          </div>
        )}

        {/* Fullscreen Preview Modal */}
        {isFullscreen && selectedDevice ? (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center gap-4">
                {(() => {
                  const Icon = getDeviceIcon(selectedDevice.type);
                  return <Icon className="w-5 h-5 text-blue-400" />;
                })()}
                <div>
                  <h2 className="font-semibold text-white">{selectedDevice.name}</h2>
                  <p className="text-slate-400 text-sm">
                    {isLandscape ? selectedDevice.height : selectedDevice.width} × {isLandscape ? selectedDevice.width : selectedDevice.height}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Orientation toggle in fullscreen */}
                {(selectedDevice.type === 'phone' || selectedDevice.type === 'tablet') && (
                  <button
                    onClick={toggleOrientation}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Toggle orientation"
                  >
                    <RotateCw className={`w-5 h-5 transition-transform ${isLandscape ? 'rotate-90' : ''}`} />
                  </button>
                )}
                
                {/* Open in new tab */}
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
                
                {/* Close button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Fullscreen Device Frame */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
              <DeviceFrame 
                device={selectedDevice} 
                url={currentUrl} 
                isFullscreen 
                isLandscape={isLandscape}
              />
            </div>
          </div>
        ) : viewMode === 'combined' ? (
          /* Combined View - Phone, Desktop, Tablet side by side with 3D perspective */
          <CombinedView url={currentUrl} />
        ) : (
          /* Device Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDevices.map((device) => {
              const Icon = getDeviceIcon(device.type);
              // Only apply landscape to phones and tablets in grid view
              const showLandscape = isLandscape && (device.type === 'phone' || device.type === 'tablet');
              
              return (
                <div
                  key={device.name}
                  onClick={() => handleDeviceClick(device)}
                  className="group cursor-pointer bg-slate-800/30 rounded-2xl p-5 hover:bg-slate-800/50 transition-all hover:shadow-xl hover:shadow-black/20 border border-slate-700/50 hover:border-blue-500/30"
                >
                  {/* Device Preview */}
                  <div className="flex justify-center items-center min-h-[280px]">
                    <DeviceFrame 
                      device={device} 
                      url={currentUrl} 
                      isLandscape={showLandscape}
                    />
                  </div>
                  
                  {/* Device Info */}
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {device.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {showLandscape ? device.height : device.width} × {showLandscape ? device.width : device.height}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-slate-500" />
                      <Maximize2 className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state when no devices match filter - only in grid view */}
        {viewMode === 'grid' && filteredDevices.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">No devices found for this filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;