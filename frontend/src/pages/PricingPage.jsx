import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

const PricingPage = () => {
  const { t } = useTranslation();

  const pricingPlans = [
    {
      id: 1,
      nameKey: 'pricing.starter.name',
      price: '0',
      currency: 'zł',
      descKey: 'pricing.starter.description',
      features: [
        'pricing.starter.feature1',
        'pricing.starter.feature2',
        'pricing.starter.feature3',
        'pricing.starter.feature4',
      ],
      buttonKey: 'pricing.starter.button',
      popular: false,
    },
    {
      id: 2,
      nameKey: 'pricing.pro.name',
      price: '99',
      currency: 'zł',
      descKey: 'pricing.pro.description',
      features: [
        'pricing.pro.feature1',
        'pricing.pro.feature2',
        'pricing.pro.feature3',
        'pricing.pro.feature4',
        'pricing.pro.feature5',
        'pricing.pro.feature6',
      ],
      buttonKey: 'pricing.pro.button',
      popular: true,
    },
    {
      id: 3,
      nameKey: 'pricing.enterprise.name',
      price: '299',
      currency: 'zł',
      descKey: 'pricing.enterprise.description',
      features: [
        'pricing.enterprise.feature1',
        'pricing.enterprise.feature2',
        'pricing.enterprise.feature3',
        'pricing.enterprise.feature4',
        'pricing.enterprise.feature5',
        'pricing.enterprise.feature6',
      ],
      buttonKey: 'pricing.enterprise.button',
      popular: false,
    },
  ];

  const faqs = [
    { qKey: 'pricing.faq.q1', aKey: 'pricing.faq.a1' },
    { qKey: 'pricing.faq.q2', aKey: 'pricing.faq.a2' },
    { qKey: 'pricing.faq.q3', aKey: 'pricing.faq.a3' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 transition-all hover:shadow-xl ${
                plan.popular
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-emerald-500 text-white px-4 py-1">
                    {t('pricing.mostPopular')}
                  </Badge>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {t(plan.nameKey)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  {t(plan.descKey)}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">
                    {plan.currency}{t('pricing.perMonth')}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((featureKey, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {t(featureKey)}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-6 font-semibold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {t(plan.buttonKey)}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            {t('pricing.faq.title')}
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {t(faq.qKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(faq.aKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
