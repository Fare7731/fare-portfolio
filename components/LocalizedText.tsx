import React from 'react';
import { useLanguage } from '../LanguageContext';

interface LocalizedTextProps {
  en: string;
  ru?: string;
  className?: string;
  inline?: boolean;
}

const LocalizedText: React.FC<LocalizedTextProps> = ({ en, ru, className = "", inline = true }) => {
  const { language } = useLanguage();

  const text = (language === 'ru' && ru) ? ru : en;

  if (!inline) {
    return <div className={className}>{text}</div>;
  }

  return <span className={className}>{text}</span>;
};

export default LocalizedText;
