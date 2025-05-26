
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const LanguageToggle: React.FC = () => {
  const { isKannada, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-sm border">
      <Label htmlFor="language-switch" className="text-xs font-medium text-gray-600">
        EN
      </Label>
      <Switch
        id="language-switch"
        checked={isKannada}
        onCheckedChange={toggleLanguage}
        className="scale-75"
      />
      <Label htmlFor="language-switch" className="text-xs font-medium text-gray-600">
        ಕನ್ನಡ
      </Label>
    </div>
  );
};
