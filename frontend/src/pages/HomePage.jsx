import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Clock, Monitor, BarChart3, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ScanConfigModal from '../components/ScanConfigModal';

const TikTokIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const HomePage = () => {
  const [streamUrl, setStreamUrl] = useState('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Modal and processing states
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState(null);

  const features = [
    { id: 1, icon: Zap, titleKey: 'features.aiPowered.title', descKey: 'features.aiPowered.description' },
    { id: 2, icon: Clock, titleKey: 'features.saveHours.title', descKey: 'features.saveHours.description' },
    { id: 3, icon: Monitor, titleKey: 'features.realTime.title', descKey: 'features.realTime.description' },
    { id: 4, icon: BarChart3, titleKey: 'features.analytics.title', descKey: 'features.analytics.description' },
  ];

  const steps = [
    { id: 1, number: '01', titleKey: 'howItWorks.step1.title', descKey: 'howItWorks.step1.description' },
    { id: 2, number: '02', titleKey: 'howItWorks.step2.title', descKey: 'howItWorks.step2.description' },
    { id: 3, number: '03', titleKey: 'howItWorks.step3.title', descKey: 'howItWorks.step3.description' },
  ];

  const handleFind = () => {
    if (streamUrl.trim()) {
      setShowConfigModal(true);
    }
  };

  // Handle stream processing with catalog
  const handleProcessStream = async (catalogData) => {
    setIsProcessing(true);
    setProcessStatus(null);
    
    try {
      console.log('Processing stream with catalog:', { url: streamUrl, catalog: catalogData });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setProcessStatus('success');
      
      setTimeout(() => {
        setShowConfigModal(false);
        setProcessStatus(null);
        // Navigate to streams page with URL parameter
        navigate(`/streams?url=${encodeURIComponent(streamUrl)}`);
        setStreamUrl('');
      }, 1500);

    } catch (error) {
      setProcessStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Stream Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="w-6 h-6 text-emerald-500" />
              {t('modal.title')}
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
                  value={catalog.codes}
                  onChange={(v) => setCatalog(prev => ({ ...prev, codes: v }))}
                  placeholder={t('modal.codesPlaceholder')}
                  example="SPD-001, SWT-042, BIZ-088, TOR-155"
                />

                <CatalogInput
                  icon={Palette}
                  label={t('modal.colors')}
                  value={catalog.colors}
                  onChange={(v) => setCatalog(prev => ({ ...prev, colors: v }))}
                  placeholder={t('modal.colorsPlaceholder')}
                  example={t('modal.colorsExample')}
                />

                <CatalogInput
                  icon={Ruler}
                  label={t('modal.sizes')}
                  value={catalog.sizes}
                  onChange={(v) => setCatalog(prev => ({ ...prev, sizes: v }))}
                  placeholder={t('modal.sizesPlaceholder')}
                  example="XS, S, M, L, XL, 36, 38, 40, 42"
                />

                <CatalogInput
                  icon={Package}
                  label={t('modal.keywords')}
                  value={catalog.keywords}
                  onChange={(v) => setCatalog(prev => ({ ...prev, keywords: v }))}
                  placeholder={t('modal.keywordsPlaceholder')}
                  example={t('modal.keywordsExample')}
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
                  {t('modal.clearAll')}
                </Button>

                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                    {t('modal.cancel')}
                  </Button>
                  <Button
                    onClick={handleProcessStream}
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
          )}
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              {t('hero.title1')}
              <br />
              <span className="text-emerald-500">{t('hero.title2')}</span>
            </h1>
            
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* URL Input */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1 w-full">
                <Input
                  type="url"
                  placeholder={t('hero.placeholder')}
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  className="w-full h-14 pl-4 pr-4 text-base rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <Button
                onClick={handleFind}
                className="h-14 px-8 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105"
              >
                {t('hero.findButton')}
              </Button>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-500 dark:text-gray-400">
              <span className="text-sm">{t('hero.tagline')}</span>
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <Instagram className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <TikTokIcon className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
                <Youtube className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('features.title')}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/50 transition-colors">
                    <IconComponent className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {t(feature.titleKey)}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {t(feature.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              {t('howItWorks.title')}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-200 to-emerald-100 dark:from-emerald-800 dark:to-emerald-900" />
                )}
                
                <div className="text-7xl font-bold text-emerald-100 dark:text-emerald-900/50 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {t(step.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(step.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            {t('cta.subtitle')}
          </p>
          <Link to="/streams">
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
