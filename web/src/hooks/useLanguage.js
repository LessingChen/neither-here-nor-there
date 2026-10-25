import { useEffect, useState } from 'react';

const STORAGE_KEY = 'nhnt-lang';

function readLang() {
  if (import.meta.env.DEV) {
    const query = new URLSearchParams(window.location.search).get('lang');
    if (query === 'zh' || query === 'en') return query;
  }
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved === 'zh' || saved === 'en') return saved;
  } catch {
    /* ignore private-mode storage */
  }
  return 'zh';
}

export function useLanguage() {
  const [lang, setLang] = useState(readLang);

  useEffect(() => {
    document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    try {
      sessionStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore private-mode storage */
    }
  }, [lang]);

  return [lang, setLang];
}
