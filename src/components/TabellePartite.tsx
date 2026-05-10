import { useState, useEffect, useRef, type ChangeEvent, type CSSProperties } from 'react';

interface Partita {
  id: string;
  categoria: string;
  squadra1: string;
  squadra2: string;
  data: string;
  importo: number;
  percepito: boolean;
  voto?: number;
  km?: number;
  gialliS1?: number;
  rossiS1?: number;
  gialliS2?: number;
  rossiS2?: number;
}

type ThemeName = 'dark' | 'light';

interface ThemePalette {
  background: string;
  text: string;
  muted: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  inputBg: string;
  modalBg: string;
  overlay: string;
  drawerBg: string;
  navBg: string;
  accent: string;
  accentText: string;
  accentSoft: string;
  accentBorder: string;
  statusPaidBg: string;
  statusPendingBg: string;
  buttonSecondaryBg: string;
  fileInputText: string;
}

const themePalettes: Record<ThemeName, ThemePalette> = {
  dark: {
    background: '#161616',
    text: '#ffffff',
    muted: '#8e8e93',
    surface: '#1c1c1e',
    surfaceAlt: '#121212',
    border: '#2c2c2e',
    inputBg: '#1c1c1e',
    modalBg: '#121212',
    overlay: 'rgba(0,0,0,0.65)',
    drawerBg: '#121212',
    navBg: '#121212',
    navbar: '#292828',
    accent: '#67cf21',
    accentText: '#000000',
    accentSoft: '#d9f7d9',
    accentBorder: '#6fcf21',
    statusPaidBg: '#1e300a',
    statusPendingBg: '#2c2c2e',
    buttonSecondaryBg: '#222222',
    fileInputText: '#ffffff'
  },
  light: {
    background: '#f7f7f4',
    text: '#111827',
    muted: '#6b7280',
    surface: '#ffffff',
    surfaceAlt: '#f8fafc',
    border: '#d1d5db',
    inputBg: '#f8fafc',
    modalBg: '#ffffff',
    overlay: 'rgba(15,23,42,0.08)',
    drawerBg: '#ffffff',
    navBg: '#ffffff',
    accent: '#67cf21',
    accentText: '#ffffff',
    accentSoft: '#d9fce5',
    accentBorder: '#4ade80',
    statusPaidBg: '#dcfce7',
    statusPendingBg: '#e5e7eb',
    buttonSecondaryBg: '#f3f4f6',
    fileInputText: '#111827'
  }
};

const getStyles = (theme: ThemePalette): Record<string, CSSProperties> => ({
  container: { 
    backgroundColor: theme.background, 
    color: theme.text, 
    minHeight: '100vh', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
    overflow: 'hidden' 
  },
  flexWrapper: { 
    display: 'flex', 
    width: '400%', // 4 Schermate orizzontali totali
    transition: '0.35s cubic-bezier(0.16, 1, 0.3, 1)' 
  },
  tabContent: { 
    width: '25%', // Ogni schermata occupa esattamente il 100% della viewport
    padding: '20px 15px 120px', 
    boxSizing: 'border-box',
    height: '100vh',
    overflowY: 'auto'
  },
  header: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative', 
    marginTop: '10px' 
  },
  title: { 
    fontSize: '32px', 
    fontWeight: '800', 
    color: theme.text,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  subtitle: { 
    color: theme.muted, 
    fontSize: '14px', 
    marginTop: '10px', 
    marginBottom: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Stile delle card nella lista partite
  card: { 
    backgroundColor: theme.surface, 
    padding: '12px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    border: 'none', 
    overflow: 'hidden', 
    width: '100%', 
    maxWidth: '100%', 
    boxSizing: 'border-box' 
  },
  cardFirst: { borderRadius: '16px 16px 0 0' },
  cardLast: { borderRadius: '0 0 16px 16px' },
  cardMiddle: { borderRadius: '0px' },
  cardListWrapper: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '5px', 
    width: '100%', 
    maxWidth: '100%',
    backgroundColor: theme.background, 
    borderRadius: '16px', 
    overflow: 'hidden',
    marginBottom: '12px'
  },

  catBadge: { 
    color: theme.accent, 
    fontSize: '13px', 
    fontWeight: 'bold', 
    marginBottom: '-3px', 
    textAlign: 'left', 
    alignSelf: 'flex-start',
    fontFamily: '"Roboto Condensed", "Arial Narrow", -apple-system, sans-serif',  },

  teams: {
    fontSize: '18px', // Leggermente più piccolo per salvaguardare lo spazio
    fontWeight: '600', // Bello marcato (Bold)
    lineHeight: '1.2',
    textAlign: 'left',
    // Usiamo Roboto Condensed (o il font di sistema compatto come Arial Narrow)
    fontFamily: '"Roboto Condensed", "Arial Narrow", -apple-system, sans-serif',
    color: theme.text,
    textTransform: 'uppercase', // Maiuscolo sportivo
    letterSpacing: '-0.3px', // Avvicina le lettere
    whiteSpace: 'nowrap', // Impedisce che la singola squadra vada a capo su due righe
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '230px' // Limita la larghezza massima prima che scattino i tre puntini (...)
  },
  cardRight: { 
    textAlign: 'right', 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'flex-end', 
    justifyContent: 'center' 
  },
  price: { 
    fontSize: '20px', 
    fontWeight: '900', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: theme.text 
  },
  date: { 
    color: theme.muted, 
    fontSize: '11px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  status: { 
    fontSize: '10px', 
    fontWeight: 'bold', 
    padding: '3px 8px', 
    borderRadius: '6px', 
    marginTop: '6px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },

  // Griglia e Box Statistiche in puro stile Telegram (bassi, tondi, senza bordi)
  statsGrid: { 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', 
    gap: '2.5px', 
    backgroundColor: 'transparent', 
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '15px'
  },
  statBox: { 
    backgroundColor: theme.surface, 
    padding: '12px 14px', 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    minHeight: '65px', 
    width: '100%', 
    boxSizing: 'border-box', 
    border: 'none', 
    borderRadius: '16px' 
  },
  statLabel: { 
    color: theme.muted, 
    fontSize: '11px', 
    fontWeight: '600',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  statValue: { 
    fontSize: '20px', 
    fontWeight: '800', 
    marginTop: '2px', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: theme.text 
  },

  progressSection: { marginTop: '18px', display: 'grid', gap: '10px' },
  progressRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
  progressLabel: { fontSize: '12px', color: theme.muted, fontWeight: '600' },
  progressValue: { fontSize: '12px', color: theme.text, fontWeight: '700' },
  progressBarOuter: { width: '100%', height: '8px', backgroundColor: theme.surfaceAlt, borderRadius: '10px', overflow: 'hidden' },
  progressBarInner: { width: '100%', height: '100%', backgroundColor: theme.accent },
  categoryList: { display: 'grid', gap: '6px' },
  categoryRow: { backgroundColor: theme.surface, borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', minHeight: '42px', border: 'none' },
  categoryMeta: { display: 'flex', alignItems: 'center', gap: '6px' },
  categoryMetaText: { color: theme.muted, fontSize: '11px', whiteSpace: 'nowrap' },
  categoryScorePill: { minWidth: '38px', height: '34px', borderRadius: '14px', backgroundColor: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 8px' },
  categoryScoreText: { color: theme.accentText, fontSize: '15px', fontWeight: '900' },
  categoryLabel: { color: theme.text, fontSize: '15px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.35px' },
  
  // Stili per la Tab Bar (Telegram Style)
nav: { 
    position: 'fixed', 
    bottom: '16px', 
    left: '20px',
    right: '20px',
    width: 'auto', 
    height: '56px', 
    backgroundColor: theme.navbar, 
    // Ridotto il blur a 6px per eliminare l'effetto alone scuro sui bordi arrotondati
    backdropFilter: 'blur(0px)', 
    WebkitBackdropFilter: 'blur(6px)', 
    display: 'flex', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderRadius: '28px', 
    border: 'none', 
    boxSizing: 'border-box',
    // Ombra resa ultra-morbida e leggerissima per non creare aloni artificiali
    boxShadow: theme.mode === 'dark' 
      ? '0 4px 20px rgba(0, 0, 0, 0.4)' // Ombra scura ma compatta per il tema scuro
      : '0 4px 20px rgba(0, 0, 0, 0.06)', // Ombra leggerissima per il tema chiaro
    zIndex: 1000,
    padding: '0 0px' 
  },  
  navItem: { 
    display: 'flex', 
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    cursor: 'pointer',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'transparent',
    border: 'none'
  },
  
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Larghezza e altezza perfette per l'allineamento orizzontale concentrico
    width: '64px',  
    height: '47px', // Lascia esattamente 8px di spazio sopra e sotto (56px - 40px = 16px totali di spazio verticale)
    // Curvatura massima dell'ovale interno (40 / 2 = 20px)
    borderRadius: '28px', 
    backgroundColor: 'transparent', 
    transition: 'all 0.15s ease-in-out',
    boxSizing: 'border-box'
  },
  
 
  iconWrapperActive: {
    backgroundColor: theme.accent, 
  },

  navLabel: {
    fontSize: '9px', 
    fontWeight: '800', 
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    letterSpacing: '0.1px',
    textTransform: 'uppercase',
    transition: 'color 0.15s ease-in-out',
    lineHeight: '1'
  },

  // ... altre proprietà sotto ...

  // Modal / popup dettagli partita (Bottom Sheet)
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: theme.overlay, display: 'flex', alignItems: 'flex-end', zIndex: 2000 },
  modal: { backgroundColor: theme.modalBg, width: '100%', padding: '20px 25px 40px', borderTopLeftRadius: '25px', borderTopRightRadius: '25px', border: `1px solid ${theme.border}`, maxHeight: '90vh', overflowY: 'auto' },
  modalHandle: { width: '40px', height: '4px', backgroundColor: theme.border, borderRadius: '2px', margin: '0 auto 20px' },
  label: { display: 'block', color: theme.muted, fontSize: '10px', fontWeight: 'bold', marginBottom: '6px' },
  input: { width: '100%', padding: '14px', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px', color: theme.text, marginBottom: '15px', fontSize: '16px', boxSizing: 'border-box' },
  btnSave: { width: '100%', padding: '16px', backgroundColor: theme.accent, border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', color: theme.accentText },
  btnDel: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#dc2626', border: 'none', marginTop: '10px', fontWeight: 'bold' },
  payRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: `1px solid ${theme.border}`, marginBottom: '10px' },

  // Selettore a segmenti della pagina statistiche (iOS/Telegram Style)
  statsHeaderTabs: { 
    display: 'flex', 
    gap: '0px', 
    marginTop: '15px', 
    marginBottom: '15px', 
    overflow: 'hidden', 
    backgroundColor: theme.surface, 
    borderRadius: '16px', 
    padding: '4px', 
    border: 'none'
  },
  statsTabButton: { 
    flex: 1, 
    minWidth: '80px', 
    padding: '10px 14px', 
    borderRadius: '12px', 
    border: 'none', 
    backgroundColor: 'transparent', 
    color: theme.muted, 
    fontWeight: '800', 
    cursor: 'pointer', 
    outline: 'none', 
    WebkitTapHighlightColor: 'transparent', 
    WebkitAppearance: 'none',
    transition: 'all 0.2s ease'
  },
  statsTabActive: { 
    backgroundColor: theme.accent, 
    color: theme.accentText, 
    fontWeight: '900'
  },
  statsPages: { display: 'flex', gap: '18px', overflowX: 'hidden', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: '10px', touchAction: 'pan-x' },
  statsPage: { flex: '0 0 100%', scrollSnapAlign: 'start', minWidth: '100%' },
  sectionBlock: { backgroundColor: 'transparent', borderRadius: '18px', padding: '0px', minHeight: '320px', overflowY: 'auto', touchAction: 'pan-y', border: 'none' },

  // Stili per la pagina impostazioni
  settingItem: { backgroundColor: theme.surface, borderRadius: '16px', padding: '16px', marginBottom: '10px' },
  settingLabel: { color: theme.text, fontSize: '16px', fontWeight: '700', marginBottom: '4px' },
  settingNote: { color: theme.muted, fontSize: '13px', lineHeight: '1.4' },
  themeToggleRow: { display: 'flex', gap: '8px', marginTop: '10px' },
  themeButton: { flex: 1, padding: '10px 12px', backgroundColor: theme.surfaceAlt, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '12px', cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitAppearance: 'none', fontWeight: 'bold' },
  themeButtonActive: { flex: 1, padding: '10px 12px', backgroundColor: theme.accent, color: theme.accentText, border: `1px solid ${theme.accent}`, borderRadius: '12px', cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent', WebkitAppearance: 'none', fontWeight: '900' },
  rawJsonArea: { width: '100%', minHeight: '100px', backgroundColor: theme.inputBg, border: `1px solid ${theme.border}`, borderRadius: '12px', color: theme.text, padding: '12px', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical', marginTop: '10px' },
  importActions: { display: 'flex', gap: '8px', marginTop: '10px' }
});

export function TabellaPartite() {
  const [activeTab, setActiveTab] = useState<'partite' | 'aggiungi' | 'statistiche' | 'impostazioni'>('partite');
  const [theme, setTheme] = useState<ThemeName>(() => localStorage.getItem('direstats-theme') === 'light' ? 'light' : 'dark');
  const [importText, setImportText] = useState('');
  const [fileError, setFileError] = useState('');
  const [partite, setPartite] = useState<Partita[]>(() => {
    const salvate = localStorage.getItem('partite-arbitro-vfinal');
    return salvate ? JSON.parse(salvate) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPartita, setSelectedPartita] = useState<Partita | null>(null);
  const [cat, setCat] = useState('');
  const [s1, setS1] = useState('');
  const [s2, setS2] = useState('');
  const [soldi, setSoldi] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [voto, setVoto] = useState('0');
  const [km, setKm] = useState('0');
  const touchStart = useRef<number | null>(null);
  const statsScrollRef = useRef<HTMLDivElement | null>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [statsSection, setStatsSection] = useState<'finanza' | 'voti' | 'distanze'>('finanza');

  useEffect(() => {
    localStorage.setItem('partite-arbitro-vfinal', JSON.stringify(partite));
  }, [partite]);

  useEffect(() => {
    localStorage.setItem('direstats-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (activeTab !== 'partite') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  useEffect(() => {
    const node = statsScrollRef.current;
    if (!node) return;
    const index = statsSection === 'finanza' ? 0 : statsSection === 'voti' ? 1 : 2;
    node.scrollTo({ left: node.clientWidth * index, behavior: 'smooth' });
  }, [statsSection]);

  const themePalette = themePalettes[theme];
  const S = getStyles(themePalette);

  const handleTouchStart = (e: React.TouchEvent) => touchStart.current = e.targetTouches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const distance = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(distance) > 70) {
      const tabs: ('partite' | 'aggiungi' | 'statistiche' | 'impostazioni')[] = ['partite', 'aggiungi', 'statistiche', 'impostazioni'];
      const currentIndex = tabs.indexOf(activeTab);
      if (distance > 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      } else if (distance < 0 && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
    touchStart.current = null;
  };

  const handleModalDragStart = (e: React.TouchEvent<HTMLDivElement>) => {
    dragStartY.current = e.targetTouches[0].clientY;
  };

  const handleModalDragMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    e.preventDefault();
    const offset = e.targetTouches[0].clientY - dragStartY.current;
    setDragOffset(offset > 0 ? offset : 0);
  };
  const handleModalDragEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) return;
    const distance = e.changedTouches[0].clientY - dragStartY.current;
    if (distance > 120) chiudiTutto();
    setDragOffset(0);
    dragStartY.current = null;
  };

  const totaleLordo = partite.reduce((acc, p) => acc + p.importo, 0);
  const totalePagato = partite.filter(p => p.percepito).reduce((acc, p) => acc + p.importo, 0);
  const totaleKm = partite.reduce((acc, p) => acc + (p.km || 0), 0);
  const avgKm = partite.length ? totaleKm / partite.length : 0;
  const topKmPartite = [...partite].sort((a, b) => (b.km || 0) - (a.km || 0)).slice(0, 5);
  const mediaGara = partite.length > 0 ? (totaleLordo / partite.length).toFixed(2) : '0.00';
  const categoriaOrder = [
    'SERIE A', 'SERIE B', 'SERIE C', 'SERIE D', 'ECCELLENZA', 'PROMOZIONE', 'PRIMA CATEGORIA', 'SECONDA CATEGORIA', 'TERZA CATEGORIA',
    'U19 NAZ', 'U19 REG', 'U19 PROV',
    'U18 NAZ', 'U18 REG', 'U18 PROV',
    'U17 NAZ', 'U17 REG', 'U17 PROV',
    'U16 NAZ', 'U16 REG', 'U16 PROV',
    'U15 NAZ', 'U15 REG', 'U15 PROV',
    'U14 NAZ', 'U14 REG', 'U14 PROV'
  ];
  const categorieUniche = [...new Set(partite.map(p => p.categoria.toUpperCase()))];
  const categorieOrdinate = [
    ...categoriaOrder.filter(cat => categorieUniche.includes(cat)),
    ...categorieUniche.filter(cat => !categoriaOrder.includes(cat)).sort()
  ];
  const mediaVotiPerCategoria = categorieOrdinate.map(cat => {
    const partiteCat = partite.filter(p => p.categoria.toUpperCase() === cat && (p.voto || 0) > 0);
    const media = partiteCat.length > 0 ? partiteCat.reduce((acc, p) => acc + (p.voto || 0), 0) / partiteCat.length : 0;
    return { categoria: cat, media: media.toFixed(2), partite: partiteCat.length };
  }).filter(item => item.partite > 0);

  const salvaPartita = () => {
    if (!s1 || !s2) return alert('Mancano le squadre!');
    const importoPulito = parseFloat(soldi.toString().replace(',', '.')) || 0;
    let dataFormattata = data;
    if (data.includes('-')) dataFormattata = data.split('-').reverse().join('/');
    const nuovaGara: Partita = {
      id: selectedPartita ? selectedPartita.id : Date.now().toString(),
      categoria: cat.toUpperCase() || 'GARA',
      squadra1: s1.toUpperCase(),
      squadra2: s2.toUpperCase(),
      importo: importoPulito,
      data: dataFormattata,
      percepito: selectedPartita ? selectedPartita.percepito : false,
      voto: parseFloat(voto) || 0,
      km: parseFloat(km) || 0
    };

    setPartite(prev => selectedPartita 
      ? prev.map(p => p.id === selectedPartita.id ? nuovaGara : p)
      : [nuovaGara, ...prev]
    );
    chiudiTutto();
  };

  const chiudiTutto = () => {
    setIsModalOpen(false);
    setSelectedPartita(null);
    setCat(''); setS1(''); setS2(''); setSoldi('');
    setVoto('0'); setKm('0');
    setData(new Date().toISOString().split('T')[0]);
  };

  const parseImportText = (text: string) => {
    const righe = text.replace(/\r/g, '').split('\n').map(r => r.trim()).filter(r => r.length > 0);
    if (righe.length === 0) {
      setFileError('File vuoto o non valido');
      return;
    }

    const dataRows = righe[0].toLowerCase().includes('squadra') ? righe.slice(1) : righe;
    const nuovePartite = dataRows.map(r => {
      const colonne = r.split(/\t|;/).map(col => col.replace(/"/g, '').trim());
      return {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        squadra1: (colonne[0] || 'CASA').toUpperCase(),
        squadra2: (colonne[1] || 'OSPITE').toUpperCase(),
        categoria: (colonne[2] || 'GARA').toUpperCase(),
        data: colonne[3] || new Date().toLocaleDateString('it-IT'),
        km: parseFloat((colonne[4] || '0').replace(',', '.')) || 0,
        importo: parseFloat((colonne[5] || '0').replace(',', '.')) || 0,
        percepito: false,
        voto: 0,
        gialliS1: 0,
        rossiS1: 0,
        gialliS2: 0,
        rossiS2: 0
      } as Partita;
    });

    setPartite(prev => [...nuovePartite, ...prev]);
    setFileError('');
    alert('Partite importate con successo!');
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      parseImportText(text);
    };
    reader.onerror = () => setFileError('Impossibile leggere il file');
    reader.readAsText(file, 'UTF-8');
  };

  const importFromText = () => {
    parseImportText(importText);
    setImportText('');
  };

  const apriDettaglio = (p: Partita) => {
    setSelectedPartita(p);
    setCat(p.categoria);
    setS1(p.squadra1);
    setS2(p.squadra2);
    setSoldi(p.importo.toString());
    setVoto((p.voto || 0).toString());
    setKm(p.km?.toString() || '0');
    const parti = p.data.split('/');
    if (parti.length === 3) setData(`${parti[2]}-${parti[1]}-${parti[0]}`);
    setIsModalOpen(true);
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={S.container}>
      <div style={{ 
        ...S.flexWrapper, 
        transform: activeTab === 'partite' ? 'translateX(0%)' : 
                   activeTab === 'aggiungi' ? 'translateX(-25%)' : 
                   activeTab === 'statistiche' ? 'translateX(-50%)' : 'translateX(-75%)' 
      }}>
        
        {/* ================= SCHEDA 1: LISTA PARTITE ================= */}
        <div style={S.tabContent}>
          <div style={S.header}>
            <h1 style={{ ...S.title, margin: 0, textAlign: 'center' }}>
              DireStats<span style={{ color: themePalette.accent }}>.</span>
            </h1>
          </div>
          <p style={S.subtitle}>{partite.length} gare totali</p>

          <div style={S.cardListWrapper}>
            {partite.map((p, index) => {
              let borderStyle = S.cardMiddle;
              if (partite.length === 1) {
                borderStyle = { borderRadius: '16px' };
              } else if (index === 0) {
                borderStyle = S.cardFirst;
              } else if (index === partite.length - 1) {
                borderStyle = S.cardLast;
              }

              return (
                <div key={p.id} onClick={() => apriDettaglio(p)} style={{ ...S.card, ...borderStyle }}>
                  <div>
                    <div style={S.catBadge}>{p.categoria}</div>
                    <div style={S.teams}>{p.squadra1}<br />{p.squadra2}</div>
                  </div>
                  <div style={S.cardRight}>
                    <div style={S.date}>{p.data}</div>
                    <div style={S.price}>{p.importo.toFixed(2)}€</div>
                    <div style={{ 
                      ...S.status, 
                      color: p.percepito ? themePalette.accent : themePalette.muted, 
                      backgroundColor: p.percepito ? themePalette.statusPaidBg : themePalette.statusPendingBg 
                    }}>
                      {p.percepito ? 'Pagato' : 'In attesa'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= SCHEDA 2: INSERIMENTO GARA (A TUTTO SCHERMO) ================= */}
        <div style={S.tabContent}>
          <div style={S.header}>
            <h1 style={{ ...S.title, margin: 0, textAlign: 'center' }}>
              Nuova Gara<span style={{ color: themePalette.accent }}>.</span>
            </h1>
          </div>
          <p style={S.subtitle}> Inserisci i dettagli del match</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px' }}>
              <label style={S.label}>CATEGORIA</label>
              <input style={{ ...S.input, marginBottom: '0px' }} value={cat} onChange={e => setCat(e.target.value)} placeholder="Es. SERIE D, ECCELLENZA" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px' }}>
                <label style={S.label}>SQUADRA CASA</label>
                <input style={{ ...S.input, marginBottom: '0px' }} value={s1} onChange={e => setS1(e.target.value)} placeholder="Casa" />
              </div>
              <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px' }}>
                <label style={S.label}>SQUADRA OSPITE</label>
                <input style={{ ...S.input, marginBottom: '0px' }} value={s2} onChange={e => setS2(e.target.value)} placeholder="Ospite" />
              </div>
            </div>

            {/* LIVELLO 1: DATA DA SOLA */}
        <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px', marginBottom: '0px' }}>
          <label style={S.label}>DATA</label>
          <input style={{ ...S.input, marginBottom: '0px' }} type="date" value={data} onChange={e => setData(e.target.value)} />
        </div>

        {/* LIVELLO 2: EURO (€) E KM AFFIANCATI */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', marginBottom: '0px' }}>
          <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px' }}>
            <label style={S.label}>€</label>
            <input style={{ ...S.input, marginBottom: '0px' }} type="number" value={soldi} onChange={e => setSoldi(e.target.value)} placeholder="0.00" />
          </div>
          <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px' }}>
            <label style={S.label}>KM</label>
            <input style={{ ...S.input, marginBottom: '0px' }} type="number" value={km} onChange={e => setKm(e.target.value)} placeholder="0" />
          </div>
        </div>

        {/* LIVELLO 3: VOTO OSSEVATORE DA SOLO */}
        <div style={{ backgroundColor: themePalette.surface, padding: '16px', borderRadius: '16px', marginBottom: '5px' }}>
          <label style={S.label}>VOTO OSSEVATORE</label>
          <input style={{ ...S.input, marginBottom: '0px' }} type="number" step="0.1" value={voto} onChange={e => setVoto(e.target.value)} placeholder="8.40" />
        </div>

            <button onClick={() => { salvaPartita(); setActiveTab('partite'); }} style={S.btnSave}>
              Salva Incontro
            </button>
          </div>
        </div>

        {/* ================= SCHEDA 3: STATISTICHE (CON SEGM. TELEGRAM) ================= */}
        <div style={S.tabContent}>
          <div style={S.header}>
            <h1 style={{ ...S.title, margin: 0, textAlign: 'center' }}>
              Statistiche<span style={{ color: themePalette.accent }}>.</span>
            </h1>
          </div>
          <p style={S.subtitle}>Le tue performance sul campo</p>

          <div style={S.statsHeaderTabs}>
            <button onClick={() => setStatsSection('finanza')} style={{ ...S.statsTabButton, ...(statsSection === 'finanza' ? S.statsTabActive : {}) }}>Finanza</button>
            <button onClick={() => setStatsSection('voti')} style={{ ...S.statsTabButton, ...(statsSection === 'voti' ? S.statsTabActive : {}) }}>Voti</button>
            <button onClick={() => setStatsSection('distanze')} style={{ ...S.statsTabButton, ...(statsSection === 'distanze' ? S.statsTabActive : {}) }}>Distanze</button>
          </div>

          <div ref={statsScrollRef} style={S.statsPages}>
            {/* FINANZA */}
            <div style={S.statsPage}>
              <div style={S.statsGrid}>
                <div style={S.statBox}><div style={S.statLabel}>Totale</div><div style={S.statValue}>{totaleLordo.toFixed(2)}€</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Totale Percepiti</div><div style={S.statValue}>{totalePagato.toFixed(2)}€</div></div>
                <div style={S.statBox}>
                  <div style={S.statLabel}>Min Totali</div>
                  <div style={S.statValue}>
                    {partite.reduce((acc, p) => {
                      const catName = (p.categoria || '').toUpperCase();
                      if (catName.includes('U14') || catName.includes('U15')) return acc + 70;
                      if (catName.includes('U16')) return acc + 80;
                      return acc + 90;
                    }, 0)}min
                  </div>
                </div>
                <div style={S.statBox}><div style={S.statLabel}>Media €/h</div><div style={S.statValue}>{(totaleLordo / 32.83).toFixed(2)}€/h</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Totale Partite</div><div style={S.statValue}>{partite.length}</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Media €/partita</div><div style={S.statValue}>{mediaGara}€</div></div>
              </div>
              <div style={S.progressSection}>
                <div style={S.progressRow}>
                  <span style={S.progressLabel}>Totale</span>
                  <span style={S.progressValue}>{totaleLordo.toFixed(2)}€</span>
                </div>
                <div style={S.progressBarOuter}>
                  <div style={S.progressBarInner}></div>
                </div>
                <div style={S.progressRow}>
                  <span style={S.progressLabel}>Totale Percepiti</span>
                  <span style={S.progressValue}>{totalePagato.toFixed(2)}€</span>
                </div>
                <div style={S.progressBarOuter}>
                  <div style={{ ...S.progressBarInner, width: `${totaleLordo > 0 ? (totalePagato / totaleLordo) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            {/* VOTI */}
            <div style={S.statsPage}>
              <div style={{ ...S.statsGrid, marginBottom: '10px' }}>
                <div style={S.statBox}>
                  <div style={S.statLabel}>Media Voto</div>
                  <div style={{ ...S.statValue, color: themePalette.accent }}>
                    {partite.filter(p => (p.voto || 0) > 0).length > 0 
                      ? (partite.filter(p => (p.voto || 0) > 0).reduce((acc, p) => acc + (p.voto || 0), 0) / partite.filter(p => (p.voto || 0) > 0).length).toFixed(2) 
                      : '0.00'}
                  </div>
                </div>
                <div style={S.statBox}><div style={S.statLabel}>Partite Valutate</div><div style={S.statValue}>{partite.filter(p => (p.voto || 0) > 0).length}</div></div>
              </div>
              {mediaVotiPerCategoria.length > 0 && (
                <div style={S.categoryList}>
                  {mediaVotiPerCategoria.map(item => (
                    <div key={item.categoria} style={S.categoryRow}>
                      <span style={S.categoryLabel}>{item.categoria}</span>
                      <div style={S.categoryMeta}>
                        <span style={S.categoryMetaText}>{item.partite} gara</span>
                        <div style={S.categoryScorePill}>
                          <span style={S.categoryScoreText}>{item.media}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DISTANZE */}
            <div style={S.statsPage}>
              <div style={S.statsGrid}>
                <div style={S.statBox}><div style={S.statLabel}>Km Totali</div><div style={S.statValue}>{totaleKm.toFixed(1)} km</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Media Km</div><div style={S.statValue}>{avgKm.toFixed(1)} km</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Più Lunga</div><div style={S.statValue}>{topKmPartite[0] ? `${topKmPartite[0].km} km` : '0 km'}</div></div>
                <div style={S.statBox}><div style={S.statLabel}>Matchs Totali</div><div style={S.statValue}>{partite.length}</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SCHEDA 4: IMPOSTAZIONI (NATIVA TELEGRAM STYLE) ================= */}
        <div style={S.tabContent}>
          <div style={S.header}>
            <h1 style={{ ...S.title, margin: 0, textAlign: 'center' }}>
              Impostazioni<span style={{ color: themePalette.accent }}>.</span>
            </h1>
          </div>
          <p style={S.subtitle}>Gestione del database e personalizzazione</p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Scelta del Tema */}
            <div style={S.settingItem}>
              <div style={S.settingLabel}>Tema Grafico</div>
              <div style={S.settingNote}>Scegli tra l'interfaccia chiara o scura ad alta visibilità.</div>
              <div style={S.themeToggleRow}>
                <button onClick={() => setTheme('dark')} style={theme === 'dark' ? S.themeButtonActive : S.themeButton}>Scuro</button>
                <button onClick={() => setTheme('light')} style={theme === 'light' ? S.themeButtonActive : S.themeButton}>Chiaro</button>
              </div>
            </div>

            {/* Importazione Excel/CSV */}
            <div style={S.settingItem}>
              <div style={S.settingLabel}>Importa Partite (Excel/CSV)</div>
              <div style={S.settingNote}>Carica un file CSV o incolla direttamente le righe dei dati nel campo di testo sottostante.</div>
              
              <input
                type="file"
                accept=".csv,.tsv,text/csv,text/tab-separated-values"
                onChange={handleFileUpload}
                style={{ color: themePalette.fileInputText, marginTop: '12px', display: 'block', fontSize: '14px' }}
              />

              <textarea
                style={S.rawJsonArea}
                placeholder="Oppure incolla i dati qui..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />

              <div style={S.importActions}>
                <button onClick={importFromText} style={S.btnSave}>Importa Testo</button>
              </div>
              {fileError && <div style={{ color: '#ff6b6b', fontSize: '13px', marginTop: '8px', fontWeight: 'bold' }}>{fileError}</div>}
            </div>

            {/* Controllo Database */}
            <div style={S.settingItem}>
              <div style={S.settingLabel}>Gestione Dati</div>
              <div style={S.settingNote}>Elimina tutti i dati e le partite salvate sul browser. L'azione non è reversibile.</div>
              <button 
                onClick={() => { if (confirm('Sei sicuro di voler cancellare TUTTE le partite salvate? Questa operazione svuoterà l\'applicazione.')) setPartite([]); }} 
                style={{ ...S.btnSave, backgroundColor: '#dc2626', color: '#ffffff', marginTop: '12px' }}
              >
                Svuota Database
              </button>
            </div>
          </div>
          {/* SEZIONE GESTIONE PARTITE CON ELIMINAZIONE SINGOLA */}
      <div style={S.settingItem}>
        <div style={S.settingLabel}>GESTIONE PARTITE ({partite.length})</div>
        <div style={S.settingNote}>Scorri l'elenco e rimuovi singolarmente le partite inserite.</div>
        
        {partite.length === 0 ? (
          <p style={{ color: themePalette.muted, fontSize: '13px', margin: '10px 0 0 0', textAlign: 'center' }}>
            Nessuna partita registrata.
          </p>
        ) : (
          /* Elenco scorrevole */
          <div style={{ 
            maxHeight: '350px', 
            overflowY: 'auto', 
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            marginTop: '12px',
            paddingRight: '4px'
          }}>
            {partite.map((p, index) => (
              <div 
                key={p.id || index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '10px 12px', 
                  backgroundColor: themePalette.inputBg, 
                  borderRadius: '10px',
                  border: `1px solid ${themePalette.border}`,
                  boxSizing: 'border-box'
                }}
              >
                {/* Info partita */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  gap: '2px', 
                  maxWidth: '70%', 
                  textAlign: 'left' 
                }}>
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: '700', 
                    color: themePalette.text,
                    fontFamily: '"Roboto Condensed", sans-serif',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.2'
                  }}>
                    {p.squadra1} - {p.squadra2}
                  </span>
                  <span style={{ 
                    fontSize: '11px', 
                    color: themePalette.muted,
                    lineHeight: '1.1'
                  }}>
                    {p.data} • {p.importo ? `${p.importo.toFixed(2)}€` : '0.00€'}
                  </span>
                </div>

                {/* Bottone Elimina */}
                <button 
                  onClick={() => {
                    if (window.confirm("Vuoi davvero eliminare questa partita?")) {
                      const nuovePartite = partite.filter((_, idx) => idx !== index);
                      setPartite(nuovePartite);
                      localStorage.setItem('partite-arbitro-vfinal', JSON.stringify(nuovePartite));
                    }
                  }}
                  style={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.12)', 
                    border: 'none', 
                    borderRadius: '8px', 
                    padding: '8px 12px', 
                    cursor: 'pointer',
                    color: '#ef4444',
                    fontSize: '11px',
                    fontWeight: '700',
                    fontFamily: '"Roboto Condensed", sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1',
                    height: '30px'
                  }}
                >
                  ELIMINA
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>

      </div>

      

      {/* ================= TAB BAR BOTTOM (TELEGRAM STYLE) ================= */}
      <nav style={S.nav}>
        {/* TAB 1: PARTITE */}
        <div onClick={() => setActiveTab('partite')} style={S.navItem}>
           <div style={{ 
             ...S.iconWrapper, 
             ...(activeTab === 'partite' ? S.iconWrapperActive : {}) 
           }}>
             <IconPartite color={activeTab === 'partite' ? themePalette.accentText : themePalette.muted} />
             <span style={{ 
               ...S.navLabel, 
               color: activeTab === 'partite' ? themePalette.accentText : themePalette.muted 
             }}>
               
             </span>
           </div>
        </div>

        {/* TAB 2: AGGIUNGI */}
        <div onClick={() => { chiudiTutto(); setActiveTab('aggiungi'); }} style={S.navItem}>
           <div style={{ 
             ...S.iconWrapper, 
             ...(activeTab === 'aggiungi' ? S.iconWrapperActive : {}) 
           }}>
             <IconAggiungi color={activeTab === 'aggiungi' ? themePalette.accentText : themePalette.muted} />
             <span style={{ 
               ...S.navLabel, 
               color: activeTab === 'aggiungi' ? themePalette.accentText : themePalette.muted 
             }}>
               
             </span>
           </div>
        </div>

        {/* TAB 3: STATISTICHE */}
        <div onClick={() => setActiveTab('statistiche')} style={S.navItem}>
           <div style={{ 
             ...S.iconWrapper, 
             ...(activeTab === 'statistiche' ? S.iconWrapperActive : {}) 
           }}>
             <IconGuadagni color={activeTab === 'statistiche' ? themePalette.accentText : themePalette.muted} />
             <span style={{ 
               ...S.navLabel, 
               color: activeTab === 'statistiche' ? themePalette.accentText : themePalette.muted 
             }}>
               
             </span>
           </div>
        </div>

        {/* TAB 4: IMPOSTAZIONI */}
        <div onClick={() => setActiveTab('impostazioni')} style={S.navItem}>
           <div style={{ 
             ...S.iconWrapper, 
             ...(activeTab === 'impostazioni' ? S.iconWrapperActive : {}) 
           }}>
             <IconImpostazioni color={activeTab === 'impostazioni' ? themePalette.accentText : themePalette.muted} />
             <span style={{ 
               ...S.navLabel, 
               color: activeTab === 'impostazioni' ? themePalette.accentText : themePalette.muted 
             }}>
               
             </span>
           </div>
        </div>
      </nav>

      {/* ================= MODAL / POPUP DETTAGLIO GARA ================= */}
      {isModalOpen && selectedPartita && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && chiudiTutto()}>
          <div style={{ ...S.modal, transform: dragOffset ? `translateY(${dragOffset}px)` : undefined }}>
            <div style={S.modalHandle} onTouchStart={handleModalDragStart} onTouchMove={handleModalDragMove} onTouchEnd={handleModalDragEnd}></div>
            <h2 style={{ marginBottom: '20px', fontWeight: '800', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Modifica Gara</h2>
            
            <label style={S.label}>CATEGORIA</label>
            <input style={S.input} value={cat} onChange={e => setCat(e.target.value)} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}><label style={S.label}>CASA</label><input style={S.input} value={s1} onChange={e => setS1(e.target.value)} /></div>
              <div style={{ flex: 1 }}><label style={S.label}>OSPITE</label><input style={S.input} value={s2} onChange={e => setS2(e.target.value)} /></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px', marginTop: '10px' }}>
              <div>
                <label style={S.label}>DATA</label>
                <input style={S.input} type="date" value={data} onChange={e => setData(e.target.value)} />
              </div>
              <div>
                <label style={S.label}>IMPORTO €</label>
                <input style={S.input} type="number" value={soldi} onChange={e => setSoldi(e.target.value)} />
              </div>
              <div>
                <label style={S.label}>KM</label>
                <input style={S.input} type="number" value={km} onChange={e => setKm(e.target.value)} />
              </div>
            </div>
            
            <div>
              <label style={S.label}>VOTO</label>
              <input style={S.input} type="number" step="0.1" value={voto} onChange={e => setVoto(e.target.value)} />
            </div>

            <div
              style={{ ...S.payRow, cursor: 'pointer', marginTop: '20px' }}
              onClick={() => {
                const nuovePartite = partite.map(p => p.id === selectedPartita.id ? { ...p, percepito: !p.percepito } : p);
                setPartite(nuovePartite);
                setSelectedPartita({ ...selectedPartita, percepito: !selectedPartita.percepito });
              }}
            >
              <span style={{ color: themePalette.text, fontWeight: 'bold', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>Pagamento ricevuto</span>
              <div style={{
                width: '40px',
                height: '22px',
                borderRadius: '20px',
                padding: '2px',
                backgroundColor: selectedPartita.percepito ? themePalette.accent : themePalette.buttonSecondaryBg,
                display: 'flex',
                alignItems: 'center',
                transition: '0.3s'
              }}>
                <div style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: themePalette.surface,
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: selectedPartita.percepito ? 'translateX(18px)' : 'translateX(0)'
                }} />
              </div>
            </div>
            
            <button onClick={salvaPartita} style={S.btnSave}>Salva Modifiche</button>
            <button 
              onClick={() => { if (window.confirm('Eliminare questa partita?')) { setPartite(partite.filter(p => p.id !== selectedPartita.id)); chiudiTutto(); } }} 
              style={S.btnDel}
            >
              Elimina partita
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ================= COMPONENTI SVG DELLE ICONE (ALLINEATE E COERENTI) =================
const IconPartite = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/>
    <line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6" r="1" fill={color}/>
    <circle cx="3" cy="12" r="1" fill={color}/>
    <circle cx="3" cy="18" r="1" fill={color}/>
  </svg>
);

const IconAggiungi = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconGuadagni = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const IconImpostazioni = ({ color }: { color: string }) => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);