import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Search, Download, RefreshCw, Eye, EyeOff, X, Plus, Link2, Sparkles,
  User, ExternalLink, Filter, Loader2, CheckCircle, AlertCircle,
  Package, Palette, Ruler, Tag, Warehouse, Hash, Calendar, MessageSquare
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { mockProfiles, mockStreamOrders } from '../data/streamOrdersData';

const StreamsPage = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState(mockStreamOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [showHidden, setShowHidden] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Stream URL and configuration states
  const [streamUrl, setStreamUrl] = useState('');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState(null); // 'success' | 'error' | null

  // Pre-configuration catalog
  const [catalog, setCatalog] = useState({
    codes: '',
    colors: '',
    sizes: '',
    keywords: '',
  });

  // Filter states
  const [filters, setFilters] = useState({
    code: '',
    color: '',
    size: '',
    quantityMin: '',
    quantityMax: '',
  });

  // Handle stream URL submission
  const handleStreamUrlSubmit = () => {
    if (streamUrl.trim()) {
      setShowConfigModal(true);
    }
  };

  // Handle stream processing with catalog
  const handleProcessStream = async () => {
    setIsProcessing(true);
    setProcessStatus(null);
    
    // Simulate AI processing with the catalog data
    try {
      // Parse catalog into arrays for AI context
      const catalogData = {
        codes: catalog.codes.split(',').map(s => s.trim()).filter(Boolean),
        colors: catalog.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes: catalog.sizes.split(',').map(s => s.trim()).filter(Boolean),
        keywords: catalog.keywords.split(',').map(s => s.trim()).filter(Boolean),
      };

      console.log('Processing stream with catalog:', { url: streamUrl, catalog: catalogData });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here would be the actual API call to process the stream
      // For now, we'll just show success
      setProcessStatus('success');
      
      setTimeout(() => {
        setShowConfigModal(false);
        setProcessStatus(null);
        setStreamUrl('');
      }, 1500);

    } catch (error) {
      setProcessStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update filter value
  const updateFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      code: '',
      color: '',
      size: '',
      quantityMin: '',
      quantityMax: '',
    });
  };

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(v => v !== '');
  }, [filters]);

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = !searchQuery || 
        order.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.profileId.includes(searchQuery);
      
      const matchesProfile = !selectedProfile || order.profileId === selectedProfile;
      const matchesVisibility = showHidden || order.status !== 'hidden';
      const matchesCode = !filters.code || order.code.toLowerCase().includes(filters.code.toLowerCase());
      const matchesColor = !filters.color || order.color.toLowerCase().includes(filters.color.toLowerCase());
      const matchesSize = !filters.size || order.size.toLowerCase().includes(filters.size.toLowerCase());
      
      const minQty = filters.quantityMin ? parseInt(filters.quantityMin) : 0;
      const maxQty = filters.quantityMax ? parseInt(filters.quantityMax) : Infinity;
      const matchesQuantity = order.quantity >= minQty && order.quantity <= maxQty;
      
      return matchesSearch && matchesProfile && matchesVisibility && 
             matchesCode && matchesColor && matchesSize && matchesQuantity;
    });
  }, [orders, searchQuery, selectedProfile, showHidden, filters]);

  // Stats
  const stats = useMemo(() => {
    const total = orders.length;
    const filtered = filteredOrders.length;
    const hidden = orders.filter(o => o.status === 'hidden').length;
    const active = orders.filter(o => o.status === 'active').length;
    const selected = orders.filter(o => o.isSelected).length;
    const uniqueCodes = new Set(filteredOrders.filter(o => o.code).map(o => o.code)).size;
    const uniqueColors = new Set(filteredOrders.filter(o => o.color).map(o => o.color)).size;
    const uniqueSizes = new Set(filteredOrders.filter(o => o.size).map(o => o.size)).size;
    const totalQuantity = filteredOrders.reduce((sum, o) => sum + o.quantity, 0);
    
    return { total, filtered, hidden, active, selected, uniqueCodes, uniqueColors, uniqueSizes, totalQuantity };
  }, [filteredOrders, orders]);

  // Toggle functions
  const toggleComment = (orderId) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  };

  const toggleOrderSelection = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, isSelected: !order.isSelected } : order
    ));
  };

  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const filteredIds = new Set(filteredOrders.map(o => o.id));
    setOrders(prev => prev.map(order => ({
      ...order,
      isSelected: filteredIds.has(order.id) ? newSelectAll : order.isSelected
    })));
  };

  const updateOrderField = (orderId, field, value) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, [field]: value } : order
    ));
  };

  const handleExport = () => {
    const selectedOrders = orders.filter(o => o.isSelected);
    const dataToExport = selectedOrders.length > 0 ? selectedOrders : filteredOrders;
    
    const headers = ['ID', 'Profile', 'Comment', 'Code', 'Color', 'Size', 'Class', 'Date', 'Qty'];
    const rows = dataToExport.map(o => [
      o.profileId, o.profileName, o.comment.replace(/,/g, ';'),
      o.code, o.color, o.size, o.classField, o.warehouse, o.quantity
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

    if (isEditing) {
      return (
        <input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') handleBlur(); }}
          autoFocus
          className="w-full px-2 py-1 text-sm border border-emerald-500 rounded bg-white dark:bg-gray-800 focus:outline-none"
        />
      );
    }

    return (
      <div onClick={() => setIsEditing(true)} className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded min-h-[28px] flex items-center">
        {value || <span className="text-gray-400 italic">{placeholder}</span>}
      </div>
    );
  };

  // Filter input component
  const FilterInput = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <Icon className="w-3 h-3" />{label}
      </label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-9 text-sm" />
    </div>
  );

  // Catalog input component
  const CatalogInput = ({ icon: Icon, label, value, onChange, placeholder, example }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-sm font-medium">
        <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] text-sm resize-none"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Пример: {example}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      {/* Stream Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              Настройка сканирования
            </DialogTitle>
            <DialogDescription>
              Введите известные коды, цвета и размеры товаров для более точного распознавания заказов
            </DialogDescription>
          </DialogHeader>

          {processStatus === 'success' ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Стрим успешно обработан!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Заказы загружены в таблицу</p>
            </div>
          ) : processStatus === 'error' ? (
            <div className="flex flex-col items-center py-8">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ошибка обработки</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Попробуйте ещё раз</p>
              <Button onClick={() => setProcessStatus(null)} className="mt-4">Повторить</Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              {/* Stream URL Display */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">URL стрима:</span>
                </div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 break-all">{streamUrl}</p>
              </div>

              {/* AI Helper Info */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
                      Помогите ИИ лучше распознать заказы
                    </h4>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                      Укажите все коды товаров, цвета и размеры, которые используются в вашем магазине. 
                      Это поможет системе точнее определить заказы из комментариев.
                    </p>
                  </div>
                </div>
              </div>

              {/* Catalog Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CatalogInput
                  icon={Tag}
                  label="Коды товаров"
                  value={catalog.codes}
                  onChange={(v) => setCatalog(prev => ({ ...prev, codes: v }))}
                  placeholder="Введите коды через запятую..."
                  example="SPD-001, SWT-042, BIZ-088, TOR-155"
                />

                <CatalogInput
                  icon={Palette}
                  label="Цвета"
                  value={catalog.colors}
                  onChange={(v) => setCatalog(prev => ({ ...prev, colors: v }))}
                  placeholder="Введите цвета через запятую..."
                  example="Черный, Белый, Красный, Синий, Бежевый"
                />

                <CatalogInput
                  icon={Ruler}
                  label="Размеры"
                  value={catalog.sizes}
                  onChange={(v) => setCatalog(prev => ({ ...prev, sizes: v }))}
                  placeholder="Введите размеры через запятую..."
                  example="XS, S, M, L, XL, 36, 38, 40, 42"
                />

                <CatalogInput
                  icon={Package}
                  label="Ключевые слова (опционально)"
                  value={catalog.keywords}
                  onChange={(v) => setCatalog(prev => ({ ...prev, keywords: v }))}
                  placeholder="Дополнительные слова для распознавания..."
                  example="беру, хочу, заказ, бронь, +1"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setCatalog({ codes: '', colors: '', sizes: '', keywords: '' });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Очистить всё
                </Button>

                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                    Отмена
                  </Button>
                  <Button
                    onClick={handleProcessStream}
                    disabled={isProcessing}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[160px]"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Начать сканирование
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar - Profiles */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Stream URL Input */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-emerald-500" />
              Добавить стрим
            </h2>
            <div className="space-y-2">
              <Input
                placeholder="Вставьте URL стрима..."
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="h-9 text-sm bg-white dark:bg-gray-900"
              />
              <Button
                onClick={handleStreamUrlSubmit}
                disabled={!streamUrl.trim()}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white h-9"
              >
                <Plus className="w-4 h-4 mr-2" />
                Сканировать
              </Button>
            </div>
          </div>

          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Профили</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск профиля..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm bg-gray-50 dark:bg-gray-900"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-2">
              <button
                onClick={() => setSelectedProfile(null)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 ${
                  !selectedProfile ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Все профили</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{orders.length} заказов</p>
                </div>
              </button>

              {mockProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors mb-1 ${
                    selectedProfile === profile.id ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                    {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{profile.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{profile.id}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">{profile.ordersCount}</Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button onClick={handleExport} className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />Обработать
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-2" />Экспорт
                </Button>
              </div>
              
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Checkbox checked={showHidden} onCheckedChange={setShowHidden} />
                  Показать скрытые
                </label>
                <Button 
                  variant={showFilters ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />Фильтры
                  {hasActiveFilters && <Badge className="ml-2 bg-white text-emerald-600 h-5 w-5 p-0 flex items-center justify-center">!</Badge>}
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border-b border-emerald-200 dark:border-emerald-800 p-4">
              <div className="flex items-end gap-4 flex-wrap">
                <FilterInput icon={Tag} label="Код" value={filters.code} onChange={(v) => updateFilter('code', v)} placeholder="SPD-001..." />
                <FilterInput icon={Palette} label="Цвет" value={filters.color} onChange={(v) => updateFilter('color', v)} placeholder="Черный..." />
                <FilterInput icon={Ruler} label="Размер" value={filters.size} onChange={(v) => updateFilter('size', v)} placeholder="M, 38..." />
                <div className="flex gap-2">
                  <FilterInput icon={Package} label="Кол-во от" value={filters.quantityMin} onChange={(v) => updateFilter('quantityMin', v)} placeholder="1" type="number" />
                  <FilterInput icon={Package} label="Кол-во до" value={filters.quantityMax} onChange={(v) => updateFilter('quantityMax', v)} placeholder="10" type="number" />
                </div>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <X className="w-4 h-4 mr-1" />Сбросить
                  </Button>
                )}
              </div>
              
              <div className="mt-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-6 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-emerald-600">{stats.filtered}</span> из {stats.total} записей
                  </span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400"><Tag className="w-3 h-3 inline mr-1" /><span className="font-semibold">{stats.uniqueCodes}</span> кодов</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400"><Palette className="w-3 h-3 inline mr-1" /><span className="font-semibold">{stats.uniqueColors}</span> цветов</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400"><Ruler className="w-3 h-3 inline mr-1" /><span className="font-semibold">{stats.uniqueSizes}</span> размеров</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400"><Package className="w-3 h-3 inline mr-1" /><span className="font-semibold">{stats.totalQuantity}</span> шт.</span>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full min-w-[1200px]">
              <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="w-12 px-3 py-3"><Checkbox checked={selectAll} onCheckedChange={toggleSelectAll} /></th>
                  <th className="w-10 px-2 py-3"></th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1"><Hash className="w-3 h-3" />ID Профиля</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1"><User className="w-3 h-3" />Профиль</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider min-w-[200px]">
                    <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />Комментарий</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1"><Tag className="w-3 h-3" />Код</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1"><Palette className="w-3 h-3" />Цвет</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-20">
                    <div className="flex items-center gap-1"><Ruler className="w-3 h-3" />Размер</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-24">
                    <div className="flex items-center gap-1"><Package className="w-3 h-3" />Класс</div>
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-40">
                    <div className="flex items-center gap-1"><Calendar className="w-3 h-3" />Дата</div>
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-16">Кол-во</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Filter className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Нет результатов</p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Попробуйте изменить параметры фильтрации</p>
                        {hasActiveFilters && (
                          <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
                            <X className="w-4 h-4 mr-1" />Сбросить фильтры
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <React.Fragment key={order.id}>
                      <tr className={`transition-colors ${order.isSelected ? 'bg-emerald-50 dark:bg-emerald-900/20' : order.status === 'hidden' ? 'bg-gray-50 dark:bg-gray-900/50 opacity-60' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                        <td className="px-3 py-2"><Checkbox checked={order.isSelected || false} onCheckedChange={() => toggleOrderSelection(order.id)} /></td>
                        <td className="px-2 py-2">
                          <button onClick={() => toggleComment(order.id)} className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            {expandedComments.has(order.id) ? <EyeOff className="w-4 h-4 text-gray-500" /> : <Eye className="w-4 h-4 text-gray-500" />}
                          </button>
                        </td>
                        <td className="px-3 py-2"><span className="text-xs font-mono text-gray-600 dark:text-gray-400">{order.profileId}</span></td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                              {order.profileName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{order.profileName}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[250px]">{order.comment}</p>
                            {order.commentUrl && (
                              <a href={order.commentUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-600 shrink-0">
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2"><EditableCell value={order.code} onChange={(val) => updateOrderField(order.id, 'code', val)} placeholder="Введите..." /></td>
                        <td className="px-3 py-2"><EditableCell value={order.color} onChange={(val) => updateOrderField(order.id, 'color', val)} placeholder="Введите..." /></td>
                        <td className="px-3 py-2"><EditableCell value={order.size} onChange={(val) => updateOrderField(order.id, 'size', val)} placeholder="Введите..." /></td>
                        <td className="px-3 py-2"><EditableCell value={order.classField} onChange={(val) => updateOrderField(order.id, 'classField', val)} placeholder="Введите..." /></td>
                        <td className="px-3 py-2"><span className="text-xs text-gray-500 dark:text-gray-400">{order.warehouse}</span></td>
                        <td className="px-3 py-2 text-center"><Badge variant="secondary" className="font-mono">{order.quantity}</Badge></td>
                      </tr>
                      {expandedComments.has(order.id) && (
                        <tr className="bg-emerald-50/50 dark:bg-emerald-900/10">
                          <td colSpan={11} className="px-6 py-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-emerald-200 dark:border-emerald-800">
                              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{order.comment}</p>
                              {order.commentUrl && (
                                <a href={order.commentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-emerald-500 hover:text-emerald-600">
                                  <ExternalLink className="w-3 h-3" />{order.commentUrl}
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Stats */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">Всего:</span> {stats.filtered}
                  {stats.filtered !== stats.total && <span className="text-gray-400 ml-1">(из {stats.total})</span>}
                </span>
                <span className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Скрытых:</span> {stats.hidden}</span>
                <span className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white">Активных:</span> {stats.active}</span>
                <span className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-emerald-600">Товаров:</span> {stats.totalQuantity} шт.</span>
              </div>
              <div className="flex items-center gap-4">
                {stats.selected > 0 && <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Выбрано: {stats.selected}</Badge>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamsPage;
