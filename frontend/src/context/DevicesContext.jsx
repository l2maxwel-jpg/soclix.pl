import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DevicesContext = createContext(null);

export const useDevices = () => {
  const context = useContext(DevicesContext);
  if (!context) {
    throw new Error('useDevices must be used within a DevicesProvider');
  }
  return context;
};

const generateDeviceId = () => {
  return 'DEV-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

const initialDevices = [
  {
    id: 'DEV-ABC12345',
    name: 'Main Office PC',
    type: 'desktop',
    os: 'Windows 11',
    lastActive: '2025-01-24T10:30:00Z',
    status: 'online',
    ipAddress: '192.168.1.100',
    browser: 'Chrome 120',
    location: 'Warsaw, Poland',
  },
  {
    id: 'DEV-XYZ78901',
    name: 'MacBook Pro',
    type: 'laptop',
    os: 'macOS Sonoma',
    lastActive: '2025-01-24T09:15:00Z',
    status: 'online',
    ipAddress: '192.168.1.105',
    browser: 'Safari 17',
    location: 'Warsaw, Poland',
  },
  {
    id: 'DEV-QWE45678',
    name: 'Home Desktop',
    type: 'desktop',
    os: 'Windows 10',
    lastActive: '2025-01-23T18:45:00Z',
    status: 'offline',
    ipAddress: '10.0.0.50',
    browser: 'Firefox 121',
    location: 'Krakow, Poland',
  },
];

export const DevicesProvider = ({ children }) => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (user) {
      // Load devices from localStorage or use initial mock data
      const savedDevices = localStorage.getItem(`soclix_devices_${user.id}`);
      if (savedDevices) {
        setDevices(JSON.parse(savedDevices));
      } else {
        setDevices(initialDevices);
        localStorage.setItem(`soclix_devices_${user.id}`, JSON.stringify(initialDevices));
      }
    } else {
      setDevices([]);
    }
  }, [user]);

  const saveDevices = (newDevices) => {
    if (user) {
      localStorage.setItem(`soclix_devices_${user.id}`, JSON.stringify(newDevices));
    }
  };

  const addDevice = (deviceData) => {
    const newDevice = {
      id: generateDeviceId(),
      ...deviceData,
      lastActive: new Date().toISOString(),
      status: 'online',
    };
    const updatedDevices = [...devices, newDevice];
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
    return newDevice;
  };

  const removeDevice = (deviceId) => {
    const updatedDevices = devices.filter(d => d.id !== deviceId);
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  };

  const updateDevice = (deviceId, updates) => {
    const updatedDevices = devices.map(d =>
      d.id === deviceId ? { ...d, ...updates } : d
    );
    setDevices(updatedDevices);
    saveDevices(updatedDevices);
  };

  const getOnlineDevices = () => devices.filter(d => d.status === 'online');
  const getOfflineDevices = () => devices.filter(d => d.status === 'offline');

  return (
    <DevicesContext.Provider value={{
      devices,
      addDevice,
      removeDevice,
      updateDevice,
      getOnlineDevices,
      getOfflineDevices,
    }}>
      {children}
    </DevicesContext.Provider>
  );
};
