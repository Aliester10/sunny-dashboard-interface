
import React from 'react';
import { Home, BarChart2, Settings, Bell, Menu, X } from 'lucide-react';

interface SolarSidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const SolarSidebar: React.FC<SolarSidebarProps> = ({ 
  isOpen, 
  toggleSidebar, 
  activeSection, 
  setActiveSection 
}) => {
  const navItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Historical Graphs', icon: BarChart2 },
    { name: 'System Settings', icon: Settings },
    { name: 'Notifications', icon: Bell }
  ];
  
  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-gray-700" />
          ) : (
            <Menu className="h-5 w-5 text-gray-700" />
          )}
        </button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-20 w-64 bg-sidebar border-r shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out lg:static lg:block`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center mb-8 p-4">
            <div className="h-10 w-10 bg-solar-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold">ST</span>
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-bold text-gray-800">Solar Tracker</h2>
              <p className="text-xs text-gray-500">Monitoring System</p>
            </div>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => setActiveSection(item.name)}
                    className={`sidebar-link w-full ${activeSection === item.name ? 'active' : ''}`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto p-4 bg-sidebar-accent rounded-lg">
            <div className="text-xs text-sidebar-foreground">System Status</div>
            <div className="flex items-center mt-1">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse-slow"></div>
              <span className="text-sm font-medium ml-2 text-sidebar-foreground">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolarSidebar;
