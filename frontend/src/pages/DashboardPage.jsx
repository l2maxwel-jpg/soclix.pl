import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useDevices } from '../context/DevicesContext';
import { useNavigate } from 'react-router-dom';
import {
  User, Monitor, Laptop, Settings, LogOut, Plus, Trash2, Edit2, Save, X,
  Wifi, WifiOff, Globe, Clock, Shield, HardDrive, MoreVertical, Copy, Check, RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const DashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { devices, addDevice, removeDevice, updateDevice, getOnlineDevices, getOfflineDevices } = useDevices();

  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // New device form state
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'desktop',
    os: '',
    browser: '',
    location: '',
  });

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddDevice = () => {
    if (newDevice.name) {
      addDevice({
        ...newDevice,
        ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      });
      setNewDevice({ name: '', type: 'desktop', os: '', browser: '', location: '' });
      setIsAddDeviceOpen(false);
    }
  };

  const handleRemoveDevice = (deviceId) => {
    if (window.confirm(t('dashboard.confirmRemoveDevice'))) {
      removeDevice(deviceId);
    }
  };

  const handleUpdateDevice = (deviceId, updates) => {
    updateDevice(deviceId, updates);
    setEditingDevice(null);
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setIsEditProfileOpen(false);
  };

  const copyDeviceId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getDeviceIcon = (type) => {
    return type === 'laptop' ? Laptop : Monitor;
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('dashboard.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('dashboard.welcome')}, {user.name}!
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>
              <Settings className="w-4 h-4 mr-2" />
              {t('dashboard.settings')}
            </Button>
            <Button variant="outline" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
              <LogOut className="w-4 h-4 mr-2" />
              {t('dashboard.logout')}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1 rounded-xl">
            <TabsTrigger value="devices" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Monitor className="w-4 h-4 mr-2" />
              {t('dashboard.devices')}
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              {t('dashboard.profile')}
            </TabsTrigger>
          </TabsList>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{devices.length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.totalDevices')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{getOnlineDevices().length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.online')}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <WifiOff className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{getOfflineDevices().length}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.offline')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Device Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('dashboard.connectedDevices')}
              </h2>
              <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.addDevice')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.addNewDevice')}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>{t('dashboard.deviceName')}</Label>
                      <Input
                        value={newDevice.name}
                        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                        placeholder={t('dashboard.deviceNamePlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('dashboard.deviceType')}</Label>
                      <Select value={newDevice.type} onValueChange={(v) => setNewDevice({ ...newDevice, type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desktop">{t('dashboard.desktop')}</SelectItem>
                          <SelectItem value="laptop">{t('dashboard.laptop')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('dashboard.os')}</Label>
                        <Input
                          value={newDevice.os}
                          onChange={(e) => setNewDevice({ ...newDevice, os: e.target.value })}
                          placeholder="Windows 11, macOS..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('dashboard.browser')}</Label>
                        <Input
                          value={newDevice.browser}
                          onChange={(e) => setNewDevice({ ...newDevice, browser: e.target.value })}
                          placeholder="Chrome, Firefox..."
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t('dashboard.location')}</Label>
                      <Input
                        value={newDevice.location}
                        onChange={(e) => setNewDevice({ ...newDevice, location: e.target.value })}
                        placeholder="Warsaw, Poland"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button variant="outline" onClick={() => setIsAddDeviceOpen(false)}>
                        {t('dashboard.cancel')}
                      </Button>
                      <Button onClick={handleAddDevice} className="bg-emerald-500 hover:bg-emerald-600">
                        {t('dashboard.addDevice')}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Devices List */}
            {devices.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-100 dark:border-gray-700">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {t('dashboard.noDevices')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {t('dashboard.noDevicesDescription')}
                </p>
                <Button onClick={() => setIsAddDeviceOpen(true)} className="bg-emerald-500 hover:bg-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('dashboard.addFirstDevice')}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {devices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  const isEditing = editingDevice === device.id;

                  return (
                    <div
                      key={device.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            device.status === 'online'
                              ? 'bg-emerald-100 dark:bg-emerald-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <DeviceIcon className={`w-6 h-6 ${
                              device.status === 'online'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-gray-500 dark:text-gray-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {device.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge className={`text-xs ${
                                device.status === 'online'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {device.status === 'online' ? t('dashboard.online') : t('dashboard.offline')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingDevice(device.id)}>
                              <Edit2 className="w-4 h-4 mr-2" />
                              {t('dashboard.edit')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyDeviceId(device.id)}>
                              {copiedId === device.id ? (
                                <><Check className="w-4 h-4 mr-2" />{t('dashboard.copied')}</>
                              ) : (
                                <><Copy className="w-4 h-4 mr-2" />{t('dashboard.copyId')}</>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveDevice(device.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              {t('dashboard.remove')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <HardDrive className="w-4 h-4" />
                          <span>{device.os}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Globe className="w-4 h-4" />
                          <span>{device.browser} • {device.ipAddress}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{t('dashboard.lastActive')}: {formatDate(device.lastActive)}</span>
                        </div>
                        {device.location && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Shield className="w-4 h-4" />
                            <span>{device.location}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-400">
                            {device.id}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateDevice(device.id, {
                              status: device.status === 'online' ? 'offline' : 'online',
                              lastActive: new Date().toISOString(),
                            })}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            {t('dashboard.toggleStatus')}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {user.plan?.toUpperCase()} Plan
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.accountId')}</Label>
                  <p className="text-gray-900 dark:text-white font-mono">{user.id}</p>
                </div>
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.memberSince')}</Label>
                  <p className="text-gray-900 dark:text-white">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.totalDevices')}</Label>
                  <p className="text-gray-900 dark:text-white">{devices.length}</p>
                </div>
                <div>
                  <Label className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.activeDevices')}</Label>
                  <p className="text-gray-900 dark:text-white">{getOnlineDevices().length}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Edit Profile Dialog */}
        <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('dashboard.editProfile')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t('auth.name')}</Label>
                <Input
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>{t('auth.email')}</Label>
                <Input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
                  {t('dashboard.cancel')}
                </Button>
                <Button onClick={handleSaveProfile} className="bg-emerald-500 hover:bg-emerald-600">
                  <Save className="w-4 h-4 mr-2" />
                  {t('dashboard.save')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardPage;
