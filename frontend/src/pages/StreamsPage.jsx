import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Download, RefreshCw, Eye, EyeOff, ChevronDown, ChevronUp,
  User, ExternalLink, Check, Square, CheckSquare, Filter, MoreHorizontal,
  Package, Palette, Ruler, Tag, Warehouse, Hash, Calendar, MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { mockProfiles, mockStreamOrders, streamStats } from '../data/streamOrdersData';

const StreamsPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState(mockStreamOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  // Filter orders based on search and profile selection
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profileId.includes(searchQuery);
      
      const matchesProfile = !selectedProfile || order.profileId === selectedProfile;
      const matchesVisibility = showHidden || order.status !== 'hidden';
      
      return matchesSearch && matchesProfile && matchesVisibility;
    });
  }, [orders, searchQuery, selectedProfile, showHidden]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const hidden = orders.filter(o => o.status === 'hidden').length;
    const active = orders.filter(o => o.status === 'active').length;
    const selected = orders.filter(o => o.isSelected).length;
    return { total, hidden, active, selected };
  }, [filteredOrders, orders]);

  // Toggle comment expansion
  const toggleComment = (orderId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, isSelected: !order.isSelected } : order
    ));
  };

  // Select/deselect all
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setOrders(prev => prev.map(order => ({ ...order, isSelected: newSelectAll })));
  };

  // Update order field
  const updateOrderField = (orderId, field, value) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, [field]: value } : order
    ));
  };

  // Handle export
  const handleExport = () => {
    const selectedOrders = orders.filter(o => o.isSelected);
    const dataToExport = selectedOrders.length > 0 ? selectedOrders : filteredOrders;
    
    // Create CSV content
    const headers = ['ID', 'Profile', 'Comment', 'Code', 'Color', 'Size', 'Class', 'Date', 'Qty'];
    const rows = dataToExport.map(o => [
      o.profileId,
      o.profileName,
      o.comment.replace(/,/g, ';'),
      o.code,
      o.color,
      o.size,
      o.classField,
      o.warehouse,
      o.quantity
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Editable cell component
  const EditableCell = ({ value, onChange, placeholder }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleBlur = () => {
      setIsEditing(false);
      onChange(tempValue);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
      } else if (e.key === 'Escape') {
        setTempValue(value);
        setIsEditing(false);
      }
    };

    if (isEditing) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-full px-2 py-1 text-sm border border-emerald-500 rounded bg-white dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      );
    }

    return (
      <div
        onClick={() => setIsEditing(true)}
        className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded min-h-[28px] flex items-center"
      >
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Profiles */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('streams.profiles')}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={t('streams.searchProfile')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              {/* All profiles option */}
              <button
                onClick={() => setSelectedProfile(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 ${
                  !selectedProfile
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t('streams.allProfiles')}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{orders.length} {t('streams.orders')}</p>
                </div>
              </button>

              {/* Profile list */}
              {mockProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 ${
                    selectedProfile === profile.id
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.id}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {profile.ordersCount}
                  </Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Orders Table */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExport}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {t('streams.process')}
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />
                  {t('streams.export')}
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Checkbox
                    checked={showHidden}
                    onCheckedChange={setShowHidden}
                  />
                  {t('streams.showHidden')}
                </label>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('streams.filters')}
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="w-12 px-3 py-3">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="w-10 px-2 py-3"></th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {t('streams.profileId')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {t('streams.profile')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {t('streams.comment')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {t('streams.code')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1">
                      <Palette className="w-3 h-3" />
                      {t('streams.color')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-20">
                    <div className="flex items-center gap-1">
                      <Ruler className="w-3 h-3" />
                      {t('streams.size')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {t('streams.class')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-40">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t('streams.date')}
                    </div>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-16">
                    {t('streams.qty')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr
                      className={`transition-colors ${
                        order.isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-900/20'
                          : order.status === 'hidden'
                          ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <td className="px-3 py-2">
                        <Checkbox
                          checked={order.isSelected || false}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <button
                          onClick={() => toggleComment(order.id)}
                          className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          title={expandedComments.has(order.id) ? t('streams.hideComment') : t('streams.showComment')}
                        >
                          {expandedComments.has(order.id) ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                          {order.profileId}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            {order.profileName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.profileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[250px]">
                            {order.comment}
                          </p>
                          {order.commentUrl && (
                            <a
                              href={order.commentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-500 hover:text-emerald-600 shrink-0"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <EditableCell
                          value={order.code}
                          onChange={(val) => updateOrderField(order.id, 'code', val)}
                          placeholder={t('streams.enter')}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <EditableCell
                          value={order.color}
                          onChange={(val) => updateOrderField(order.id, 'color', val)}
                          placeholder={t('streams.enter')}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <EditableCell
                          value={order.size}
                          onChange={(val) => updateOrderField(order.id, 'size', val)}
                          placeholder={t('streams.enter')}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <EditableCell
                          value={order.classField}
                          onChange={(val) => updateOrderField(order.id, 'classField', val)}
                          placeholder={t('streams.enter')}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {order.warehouse}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <Badge variant="secondary" className="font-mono">
                          {order.quantity}
                        </Badge>
                      </td>
                    </tr>
                    {/* Expanded comment row */}
                    {expandedComments.has(order.id) && (
                      <tr className="bg-emerald-50/50 dark:bg-emerald-900/10">
                        <td colSpan={11} className="px-6 py-4">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-800">
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                              {order.comment}
                            </p>
                            {order.commentUrl && (
                              <a
                                href={order.commentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-500 hover:text-emerald-600"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {order.commentUrl}
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('streams.total')}:</span> {stats.total}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('streams.hiddenCount')}:</span> {stats.hidden}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">{t('streams.activeCount')}:</span> {stats.active}
                </span>
              </div>
              <div className="flex items-center gap-4">
                {stats.selected > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {t('streams.selected')}: {stats.selected}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;
