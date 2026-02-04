import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Sparkles, Link2, Tag, Palette, Ruler, Package, 
  CheckCircle, AlertCircle, Loader2, X, Plus, Trash2, Settings2 
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

  // Extended mode - Product catalog as array of objects
  const [productRows, setProductRows] = useState([
    { id: 1, code: '', colors: '', sizes: '' }
  ]);
  const [extendedKeywords, setExtendedKeywords] = useState('');

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
        <CatalogInput
          icon={Tag}
          label={t('modal.codes')}
          value={simpleCatalog.codes}
          onChange={(v) => setSimpleCatalog(prev => ({ ...prev, codes: v }))}
          placeholder={t('modal.codesPlaceholder')}
          example="SPD-001, SWT-042, BIZ-088, TOR-155"
        />

        <CatalogInput
          icon={Palette}
          label={t('modal.colors')}
          value={simpleCatalog.colors}
          onChange={(v) => setSimpleCatalog(prev => ({ ...prev, colors: v }))}
          placeholder={t('modal.colorsPlaceholder')}
          example={t('modal.colorsExample')}
        />

        <CatalogInput
          icon={Ruler}
          label={t('modal.sizes')}
          value={simpleCatalog.sizes}
          onChange={(v) => setSimpleCatalog(prev => ({ ...prev, sizes: v }))}
          placeholder={t('modal.sizesPlaceholder')}
          example="XS, S, M, L, XL, 36, 38, 40, 42"
        />

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
