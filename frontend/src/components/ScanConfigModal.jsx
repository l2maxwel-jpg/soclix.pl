import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Link2, Tag, Palette, Ruler, Package, 
  CheckCircle, AlertCircle, Loader2, X, Plus, Trash2, Settings2, Hash, Wand2 
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ScrollArea } from './ui/scroll-area';

const ScanConfigModal = ({ 
  open, 
  onOpenChange, 
  streamUrl, 
  onProcess, 
  isProcessing, 
  processStatus, 
  setProcessStatus 
}) => {
  const { t } = useTranslation();

  // Mode: 'simple' or 'extended'
  const [mode, setMode] = useState('simple');

  // Simple mode catalog
  const [simpleCatalog, setSimpleCatalog] = useState({
    codes: '',
    colors: '',
    sizes: '',
    keywords: '',
  });

  // Code generator state
  const [codeGenerator, setCodeGenerator] = useState({
    prefix: '',
    from: '',
    to: '',
    digits: '3',
  });
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [selectedSizes, setSelectedSizes] = useState(new Set());

  // Predefined colors with their display colors
  const predefinedColors = [
    { name: 'Черный', nameEn: 'Black', color: '#000000' },
    { name: 'Белый', nameEn: 'White', color: '#FFFFFF' },
    { name: 'Серый', nameEn: 'Gray', color: '#808080' },
    { name: 'Красный', nameEn: 'Red', color: '#EF4444' },
    { name: 'Синий', nameEn: 'Blue', color: '#3B82F6' },
    { name: 'Зеленый', nameEn: 'Green', color: '#22C55E' },
    { name: 'Желтый', nameEn: 'Yellow', color: '#EAB308' },
    { name: 'Оранжевый', nameEn: 'Orange', color: '#F97316' },
    { name: 'Розовый', nameEn: 'Pink', color: '#EC4899' },
    { name: 'Фиолетовый', nameEn: 'Purple', color: '#A855F7' },
    { name: 'Бежевый', nameEn: 'Beige', color: '#D4A574' },
    { name: 'Коричневый', nameEn: 'Brown', color: '#92400E' },
    { name: 'Бордовый', nameEn: 'Burgundy', color: '#7F1D1D' },
    { name: 'Голубой', nameEn: 'Light Blue', color: '#60A5FA' },
    { name: 'Темно-синий', nameEn: 'Navy', color: '#1E3A5F' },
    { name: 'Хаки', nameEn: 'Khaki', color: '#8B8B4B' },
    { name: 'Золотой', nameEn: 'Gold', color: '#FFD700' },
    { name: 'Серебряный', nameEn: 'Silver', color: '#C0C0C0' },
    { name: 'Мятный', nameEn: 'Mint', color: '#98FB98' },
    { name: 'Коралловый', nameEn: 'Coral', color: '#FF7F50' },
  ];

  // Predefined sizes by category
  const sizeCategories = [
    { 
      name: 'letterSizes', 
      label: 'XS-XXL',
      sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] 
    },
    { 
      name: 'euSizes', 
      label: 'EU (32-54)',
      sizes: ['32', '34', '36', '38', '40', '42', '44', '46', '48', '50', '52', '54'] 
    },
    { 
      name: 'usSizes', 
      label: 'US (0-16)',
      sizes: ['0', '2', '4', '6', '8', '10', '12', '14', '16'] 
    },
    { 
      name: 'shoeSizes', 
      label: 'Обувь (35-46)',
      sizes: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'] 
    },
  ];

  // Extended mode - Product catalog as array of objects
  const [productRows, setProductRows] = useState([
    { id: 1, code: '', colors: '', sizes: '' }
  ]);
  const [extendedKeywords, setExtendedKeywords] = useState('');

  // Toggle color selection
  const toggleColor = (colorName) => {
    const newSelected = new Set(selectedColors);
    if (newSelected.has(colorName)) {
      newSelected.delete(colorName);
    } else {
      newSelected.add(colorName);
    }
    setSelectedColors(newSelected);
  };

  // Toggle size selection
  const toggleSize = (size) => {
    const newSelected = new Set(selectedSizes);
    if (newSelected.has(size)) {
      newSelected.delete(size);
    } else {
      newSelected.add(size);
    }
    setSelectedSizes(newSelected);
  };

  // Select all sizes in category
  const selectAllSizesInCategory = (sizes) => {
    const newSelected = new Set(selectedSizes);
    sizes.forEach(size => newSelected.add(size));
    setSelectedSizes(newSelected);
  };

  // Add selected colors to field
  const addSelectedColors = () => {
    if (selectedColors.size === 0) return;
    
    const colorsArray = Array.from(selectedColors);
    const existingColors = simpleCatalog.colors.trim();
    const newColors = existingColors 
      ? `${existingColors}, ${colorsArray.join(', ')}`
      : colorsArray.join(', ');
    
    setSimpleCatalog(prev => ({ ...prev, colors: newColors }));
    setShowColorPicker(false);
    setSelectedColors(new Set());
  };

  // Add selected sizes to field
  const addSelectedSizes = () => {
    if (selectedSizes.size === 0) return;
    
    const sizesArray = Array.from(selectedSizes);
    const existingSizes = simpleCatalog.sizes.trim();
    const newSizes = existingSizes 
      ? `${existingSizes}, ${sizesArray.join(', ')}`
      : sizesArray.join(', ');
    
    setSimpleCatalog(prev => ({ ...prev, sizes: newSizes }));
    setShowSizePicker(false);
    setSelectedSizes(new Set());
  };

  // Generate codes from range
  const generateCodes = () => {
    const { prefix, from, to, digits } = codeGenerator;
    const start = parseInt(from, 10);
    const end = parseInt(to, 10);
    const digitCount = parseInt(digits, 10);

    if (isNaN(start) || isNaN(end) || start > end) {
      return;
    }

    // Limit to prevent browser freeze (max 1000 codes)
    const maxCodes = Math.min(end - start + 1, 1000);
    const codes = [];
    
    for (let i = start; i < start + maxCodes; i++) {
      const paddedNum = String(i).padStart(digitCount, '0');
      codes.push(`${prefix}${paddedNum}`);
    }

    // Add to existing codes
    const existingCodes = simpleCatalog.codes.trim();
    const newCodes = existingCodes 
      ? `${existingCodes}, ${codes.join(', ')}`
      : codes.join(', ');
    
    setSimpleCatalog(prev => ({ ...prev, codes: newCodes }));
    setShowCodeGenerator(false);
    setCodeGenerator({ prefix: '', from: '', to: '', digits: '3' });
  };

  // Add new row (extended mode)
  const addRow = () => {
    const newId = Math.max(...productRows.map(r => r.id), 0) + 1;
    setProductRows([...productRows, { id: newId, code: '', colors: '', sizes: '' }]);
  };

  // Remove row (extended mode)
  const removeRow = (id) => {
    if (productRows.length > 1) {
      setProductRows(productRows.filter(row => row.id !== id));
    }
  };

  // Update row field (extended mode)
  const updateRow = (id, field, value) => {
    setProductRows(productRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  // Clear all
  const clearAll = () => {
    if (mode === 'simple') {
      setSimpleCatalog({ codes: '', colors: '', sizes: '', keywords: '' });
    } else {
      setProductRows([{ id: 1, code: '', colors: '', sizes: '' }]);
      setExtendedKeywords('');
    }
  };

  // Handle process
  const handleProcess = () => {
    let catalogData;
    
    if (mode === 'simple') {
      catalogData = {
        mode: 'simple',
        codes: simpleCatalog.codes.split(',').map(s => s.trim()).filter(Boolean),
        colors: simpleCatalog.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes: simpleCatalog.sizes.split(',').map(s => s.trim()).filter(Boolean),
        keywords: simpleCatalog.keywords.split(',').map(s => s.trim()).filter(Boolean),
      };
    } else {
      catalogData = {
        mode: 'extended',
        products: productRows
          .filter(row => row.code.trim())
          .map(row => ({
            code: row.code.trim(),
            colors: row.colors.split(',').map(s => s.trim()).filter(Boolean),
            sizes: row.sizes.split(',').map(s => s.trim()).filter(Boolean),
          })),
        keywords: extendedKeywords.split(',').map(s => s.trim()).filter(Boolean),
      };
    }
    onProcess(catalogData);
  };

  // Simple catalog input component
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
        {t('modal.example')}: {example}
      </p>
    </div>
  );

  // Render simple mode content
  const renderSimpleMode = () => (
    <div className="space-y-6 py-4">
      {/* Stream URL Display */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('modal.streamUrl')}:</span>
        </div>
        <p className="text-sm text-emerald-600 dark:text-emerald-400 break-all">{streamUrl}</p>
      </div>

      {/* AI Helper Info */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-emerald-800 dark:text-emerald-300">
              {t('modal.aiHelperTitle')}
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
              {t('modal.aiHelperDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Catalog Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Codes with Generator */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              {t('modal.codes')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCodeGenerator(!showCodeGenerator)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 h-7 px-2"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              {t('modal.generateCodes')}
            </Button>
          </Label>
          
          {/* Code Generator Panel */}
          {showCodeGenerator && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
                <Wand2 className="w-4 h-4" />
                {t('modal.codeGeneratorTitle')}
              </div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <Label className="text-xs text-blue-700 dark:text-blue-400">{t('modal.prefix')}</Label>
                  <Input
                    value={codeGenerator.prefix}
                    onChange={(e) => setCodeGenerator(prev => ({ ...prev, prefix: e.target.value }))}
                    placeholder="SPD-"
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-blue-700 dark:text-blue-400">{t('modal.from')}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={codeGenerator.from}
                    onChange={(e) => setCodeGenerator(prev => ({ ...prev, from: e.target.value }))}
                    placeholder="1"
                    className="h-8 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-blue-700 dark:text-blue-400">{t('modal.to')}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={codeGenerator.to}
                    onChange={(e) => setCodeGenerator(prev => ({ ...prev, to: e.target.value }))}
                    placeholder="100"
                    className="h-8 text-sm mt-1"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-blue-700 dark:text-blue-400">{t('modal.digits')}</Label>
                  <select
                    value={codeGenerator.digits}
                    onChange={(e) => setCodeGenerator(prev => ({ ...prev, digits: e.target.value }))}
                    className="h-7 text-xs rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-900 px-2"
                  >
                    <option value="1">1 (1, 2, 3)</option>
                    <option value="2">2 (01, 02, 03)</option>
                    <option value="3">3 (001, 002, 003)</option>
                    <option value="4">4 (0001, 0002, 0003)</option>
                  </select>
                </div>
                <Button
                  size="sm"
                  onClick={generateCodes}
                  disabled={!codeGenerator.prefix || !codeGenerator.from || !codeGenerator.to}
                  className="h-7 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t('modal.addCodes')}
                </Button>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {t('modal.generatorExample')}: {codeGenerator.prefix || 'SPD-'}{String(codeGenerator.from || 1).padStart(parseInt(codeGenerator.digits) || 3, '0')} ... {codeGenerator.prefix || 'SPD-'}{String(codeGenerator.to || 100).padStart(parseInt(codeGenerator.digits) || 3, '0')}
              </p>
            </div>
          )}

          <Textarea
            value={simpleCatalog.codes}
            onChange={(e) => setSimpleCatalog(prev => ({ ...prev, codes: e.target.value }))}
            placeholder={t('modal.codesPlaceholder')}
            className="min-h-[80px] text-sm resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('modal.example')}: SPD-001, SWT-042, BIZ-088, TOR-155
          </p>
        </div>

        {/* Colors with Picker */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              {t('modal.colors')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 h-7 px-2"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              {t('modal.selectColors')}
            </Button>
          </Label>

          {/* Color Picker Panel */}
          {showColorPicker && (
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3 border border-pink-200 dark:border-pink-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-pink-800 dark:text-pink-300">
                  <Palette className="w-4 h-4" />
                  {t('modal.popularColors')}
                </div>
                <span className="text-xs text-pink-600 dark:text-pink-400">
                  {t('modal.selected')}: {selectedColors.size}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {predefinedColors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => toggleColor(c.name)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                      selectedColors.has(c.name)
                        ? 'border-pink-500 bg-pink-100 dark:bg-pink-900/40'
                        : 'border-transparent hover:border-pink-200 dark:hover:border-pink-700'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: c.color }}
                    />
                    <span className="text-[10px] text-gray-700 dark:text-gray-300 text-center leading-tight">
                      {c.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={addSelectedColors}
                  disabled={selectedColors.size === 0}
                  className="h-7 bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t('modal.addSelected')}
                </Button>
              </div>
            </div>
          )}

          <Textarea
            value={simpleCatalog.colors}
            onChange={(e) => setSimpleCatalog(prev => ({ ...prev, colors: e.target.value }))}
            placeholder={t('modal.colorsPlaceholder')}
            className="min-h-[80px] text-sm resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('modal.example')}: {t('modal.colorsExample')}
          </p>
        </div>

        {/* Sizes with Picker */}
        <div className="space-y-2">
          <Label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Ruler className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              {t('modal.sizes')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSizePicker(!showSizePicker)}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 h-7 px-2"
            >
              <Wand2 className="w-3.5 h-3.5 mr-1" />
              {t('modal.selectSizes')}
            </Button>
          </Label>

          {/* Size Picker Panel */}
          {showSizePicker && (
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-200 dark:border-violet-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-violet-800 dark:text-violet-300">
                  <Ruler className="w-4 h-4" />
                  {t('modal.standardSizes')}
                </div>
                <span className="text-xs text-violet-600 dark:text-violet-400">
                  {t('modal.selected')}: {selectedSizes.size}
                </span>
              </div>
              
              {sizeCategories.map((category) => (
                <div key={category.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
                      {category.label}
                    </span>
                    <button
                      onClick={() => selectAllSizesInCategory(category.sizes)}
                      className="text-[10px] text-violet-600 hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      {t('modal.selectAll')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {category.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-2 py-1 text-xs rounded border transition-all ${
                          selectedSizes.has(size)
                            ? 'bg-violet-500 text-white border-violet-500'
                            : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-violet-200 dark:border-violet-700 hover:border-violet-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-2">
                <Button
                  size="sm"
                  onClick={addSelectedSizes}
                  disabled={selectedSizes.size === 0}
                  className="h-7 bg-violet-600 hover:bg-violet-700 text-white"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {t('modal.addSelected')}
                </Button>
              </div>
            </div>
          )}

          <Textarea
            value={simpleCatalog.sizes}
            onChange={(e) => setSimpleCatalog(prev => ({ ...prev, sizes: e.target.value }))}
            placeholder={t('modal.sizesPlaceholder')}
            className="min-h-[80px] text-sm resize-none"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('modal.example')}: XS, S, M, L, XL, 36, 38, 40, 42
          </p>
        </div>

        <CatalogInput
          icon={Package}
          label={t('modal.keywords')}
          value={simpleCatalog.keywords}
          onChange={(v) => setSimpleCatalog(prev => ({ ...prev, keywords: v }))}
          placeholder={t('modal.keywordsPlaceholder')}
          example={t('modal.keywordsExample')}
        />
      </div>

      {/* Extended Mode Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMode('extended')}
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
        >
          <Settings2 className="w-4 h-4 mr-2" />
          {t('modal.extendedSettings')}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={clearAll}>
          <X className="w-4 h-4 mr-2" />
          {t('modal.clearAll')}
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('modal.cancel')}
          </Button>
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[160px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('modal.processing')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('modal.startScan')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render extended mode content
  const renderExtendedMode = () => (
    <div className="flex flex-col gap-4 flex-1 overflow-hidden py-4">
      {/* Stream URL Display */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-gray-500 shrink-0" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('modal.streamUrl')}:</span>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 break-all truncate">{streamUrl}</p>
        </div>
      </div>

      {/* AI Helper Info */}
      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-emerald-800 dark:text-emerald-300 text-sm">
              {t('modal.aiHelperTitle')}
            </h4>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
              {t('modal.tableDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="flex-1 overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1.5fr_1.5fr_auto] gap-2 p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('modal.code')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('modal.colorsForCode')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t('modal.sizesForCode')}</span>
          </div>
          <div className="w-9"></div>
        </div>

        {/* Table Body */}
        <ScrollArea className="h-[200px]">
          <div className="p-2 space-y-2">
            {productRows.map((row) => (
              <div 
                key={row.id} 
                className="grid grid-cols-[1fr_1.5fr_1.5fr_auto] gap-2 items-center p-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors"
              >
                <Input
                  value={row.code}
                  onChange={(e) => updateRow(row.id, 'code', e.target.value)}
                  placeholder={t('modal.codePlaceholder')}
                  className="h-9 text-sm"
                />
                <Input
                  value={row.colors}
                  onChange={(e) => updateRow(row.id, 'colors', e.target.value)}
                  placeholder={t('modal.colorsPlaceholderShort')}
                  className="h-9 text-sm"
                />
                <Input
                  value={row.sizes}
                  onChange={(e) => updateRow(row.id, 'sizes', e.target.value)}
                  placeholder={t('modal.sizesPlaceholderShort')}
                  className="h-9 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                  disabled={productRows.length === 1}
                  className="h-9 w-9 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Add Row Button */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <Button
            variant="outline"
            size="sm"
            onClick={addRow}
            className="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('modal.addProduct')}
          </Button>
        </div>
      </div>

      {/* Keywords Field */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded flex items-center justify-center">
            <Package className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          </div>
          {t('modal.keywords')}
        </Label>
        <Input
          value={extendedKeywords}
          onChange={(e) => setExtendedKeywords(e.target.value)}
          placeholder={t('modal.keywordsPlaceholder')}
          className="h-9 text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('modal.example')}: {t('modal.keywordsExample')}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setMode('simple')}>
            {t('modal.simpleMode')}
          </Button>
          <Button variant="ghost" size="sm" onClick={clearAll}>
            <X className="w-4 h-4 mr-2" />
            {t('modal.clearAll')}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            {t('modal.cancel')}
          </Button>
          <Button
            onClick={handleProcess}
            disabled={isProcessing}
            size="sm"
            className="bg-emerald-500 hover:bg-emerald-600 text-white min-w-[140px]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t('modal.processing')}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                {t('modal.startScan')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={mode === 'extended' ? "sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" : "sm:max-w-2xl max-h-[90vh] overflow-y-auto"}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            {t('modal.title')}
            {mode === 'extended' && (
              <span className="text-sm font-normal text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                {t('modal.extendedMode')}
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            {t('modal.description')}
          </DialogDescription>
        </DialogHeader>

        {processStatus === 'success' ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('modal.success')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('modal.successDesc')}</p>
          </div>
        ) : processStatus === 'error' ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('modal.error')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{t('modal.errorDesc')}</p>
            <Button onClick={() => setProcessStatus(null)} className="mt-4">{t('modal.retry')}</Button>
          </div>
        ) : (
          mode === 'simple' ? renderSimpleMode() : renderExtendedMode()
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScanConfigModal;
