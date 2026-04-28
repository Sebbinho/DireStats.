import { useState, useEffect, useRef } from 'react';

interface Partita {
  id: string;
  categoria: string;
  squadra1: string;
  squadra2: string;
  data: string;
  importo: number;
  percepito: boolean;
}

export function TabellaPartite() {
  const [activeTab, setActiveTab] = useState<'partite' | 'guadagni'>('partite');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [importText, setImportText] = useState('');
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

  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('partite-arbitro-vfinal', JSON.stringify(partite));
  }, [partite]);

  const handleTouchStart = (e: React.TouchEvent) => touchStart.current = e.targetTouches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const distance = touchStart.current - e.changedTouches[0].clientX;
    if (distance > 70) setActiveTab('guadagni');
    if (distance < -70) setActiveTab('partite');
    touchStart.current = null;
  };

  // Sezione Guadagni con nomi classici
  const totaleLordo = partite.reduce((acc, p) => acc + p.importo, 0);
  const totalePagato = partite.filter(p => p.percepito).reduce((acc, p) => acc + p.importo, 0);
  const mediaGara = partite.length > 0 ? (totaleLordo / partite.length).toFixed(2) : "0.00";

  const salvaPartita = () => {
    if (!s1 || !s2) return alert("Mancano le squadre!");
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
      percepito: selectedPartita ? selectedPartita.percepito : false
    };

    setPartite(prev => selectedPartita 
      ? prev.map(p => p.id === selectedPartita.id ? nuovaGara : p) 
      : [nuovaGara, ...prev]
    );
    chiudiTutto();
  };

  const chiudiTutto = () => {
    setIsModalOpen(false);
    setIsMenuOpen(false);
    setSelectedPartita(null);
    setCat(''); setS1(''); setS2(''); setSoldi('');
    setData(new Date().toISOString().split('T')[0]);
  };

  const apriDettaglio = (p: Partita) => {
    setSelectedPartita(p);
    setCat(p.categoria);
    setS1(p.squadra1);
    setS2(p.squadra2);
    setSoldi(p.importo.toString());
    const parti = p.data.split('/');
    if(parti.length === 3) setData(`${parti[2]}-${parti[1]}-${parti[0]}`);
    setIsModalOpen(true);
  };

  return (
    <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} style={S.container}>
      <div style={{ ...S.flexWrapper, transform: activeTab === 'partite' ? 'translateX(0%)' : 'translateX(-50%)' }}>
        
        <div style={S.tabContent}>
          <div style={S.header}>
            <h1 style={S.title}>DireStats.</h1>
            <div onClick={() => setIsMenuOpen(true)} style={{ cursor: 'pointer', padding: '10px' }}>
              <IconMenu color="#a3cf21" />
            </div>
          </div>
          <p style={S.subtitle}>{partite.length} gare totali</p>
          {partite.map(p => (
            <div key={p.id} onClick={() => apriDettaglio(p)} style={S.card}>
              <div>
                <div style={S.catBadge}>{p.categoria}</div>
                <div style={S.teams}>{p.squadra1}<br/>{p.squadra2}</div>
              </div>
              <div style={S.cardRight}>
                <div style={S.date}>{p.data}</div>
                <div style={S.price}>{p.importo.toFixed(2)}€</div>
                <div style={{ ...S.status, color: p.percepito ? '#a3cf21' : '#8e8e93', backgroundColor: p.percepito ? '#1e300a' : '#2c2c2e' }}>
                  {p.percepito ? 'Pagato' : 'In attesa'}
                </div>
              </div>
            </div>
          ))}
        </div>

<div style={S.tabContent}>
          <h1 style={{...S.title, fontSize: '32px',marginTop: '30px', marginBottom: '25px', textAlign: 'left'}}>DireStats.</h1>
          
          <div style={S.statsGrid}>
            <div style={S.statBox}>
              <div style={S.statLabel}>Totale</div>
              <div style={S.statValue}>{totaleLordo.toFixed(2)}€</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Totale Percepiti</div>
              <div style={S.statValue}>{totalePagato.toFixed(2)}€</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>
                {partite.reduce((acc, p) => {
                  const cat = (p.categoria || "").toUpperCase();
                  if (cat.includes('U14') || cat.includes('U15')) return acc + 70;
                  if (cat.includes('U16')) return acc + 80;
                  return acc + 90;
                }, 0)}min
              </div>
              <div style={S.statValue}>
                {(partite.reduce((acc, p) => {
                  const cat = (p.categoria || "").toUpperCase();
                  if (cat.includes('U14') || cat.includes('U15')) return acc + 70;
                  if (cat.includes('U16')) return acc + 80;
                  return acc + 90;
                }, 0) / 60).toFixed(2)}h
              </div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Media €/h</div>
              <div style={S.statValue}>{(totaleLordo / 32.83).toFixed(2)}€/h</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Totale Partite</div>
              <div style={S.statValue}>{partite.length}</div>
            </div>
            <div style={S.statBox}>
              <div style={S.statLabel}>Media €/partita</div>
              <div style={S.statValue}>{mediaGara}€</div>
            </div>
          </div>

          {/* Sezione Barre Verdi */}
          <div style={{marginTop: '25px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
              <span style={{fontSize:'14px', fontWeight:'bold', color: 'white'}}>Totale</span>
              <span style={{fontSize:'14px', color:'#8e8e93'}}>{totaleLordo.toFixed(2)}€</span>
            </div>
            <div style={{width:'100%', height:'8px', backgroundColor:'#2c2c2e', borderRadius:'10px', marginBottom:'20px'}}>
              <div style={{width:'100%', height:'100%', backgroundColor:'#a3cf21', borderRadius:'10px'}}></div>
            </div>

            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
              <span style={{fontSize:'14px', fontWeight:'bold', color: 'white'}}>Totale Percepiti</span>
              <span style={{fontSize:'14px', color:'#8e8e93'}}>{totalePagato.toFixed(2)}€</span>
            </div>
            <div style={{width:'100%', height:'8px', backgroundColor:'#2c2c2e', borderRadius:'10px'}}>
              <div style={{width: `${totaleLordo > 0 ? (totalePagato/totaleLordo)*100 : 0}%`, height:'100%', backgroundColor:'#a3cf21', borderRadius:'10px', boxShadow: '0 0 10px rgba(163, 207, 33, 0.4)'}}></div>
            </div>
          </div>

          <h3 style={{fontSize:'14px', color:'#8e8e93', marginTop:'30px', textTransform:'uppercase', fontWeight: 'bold'}}>Ultime Partite</h3>
          <div style={{display:'flex', overflowX:'auto', gap:'12px', marginTop:'15px', paddingBottom:'15px'}}>
            {partite.slice(0, 5).map(p => (
              <div key={p.id} style={{...S.statBox, minWidth:'200px', textAlign:'left', padding:'15px', flexShrink: 0}}>
                <div style={{fontSize:'11px', color:'#8e8e93'}}>{p.data}</div>
                <div style={{fontSize:'14px', fontWeight:'bold', margin:'8px 0', color: 'white'}}>{p.squadra1}<br/>{p.squadra2}</div>
                <div style={{color:'#a3cf21', fontWeight:'bold'}}>{p.importo.toFixed(2)}€</div>
              </div>
            ))}
          </div>
        </div>
    </div>
      <nav style={S.nav}>
        <div onClick={() => setActiveTab('partite')} style={{ ...S.navItem, opacity: activeTab === 'partite' ? 1 : 0.4 }}>
           <IconPartite color={activeTab === 'partite' ? '#a3cf21' : '#8e8e93'} />
           <span style={{ fontSize: '10px', marginTop: '4px' }}>Partite</span>
        </div>
        <button onClick={() => { chiudiTutto(); setIsModalOpen(true); }} style={S.fab}>+</button>
        <div onClick={() => setActiveTab('guadagni')} style={{ ...S.navItem, opacity: activeTab === 'guadagni' ? 1 : 0.4 }}>
           <IconGuadagni color={activeTab === 'guadagni' ? '#a3cf21' : '#8e8e93'} />
           <span style={{ fontSize: '10px', marginTop: '4px' }}>Guadagni</span>
        </div>
      </nav>

      {isMenuOpen && (
        <div style={{...S.overlay, alignItems: 'center'}} onClick={chiudiTutto}>
          <div style={{...S.modal, height: '90vh', backgroundColor: '#121212', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0}}>Database</h2>
              <button onClick={chiudiTutto} style={{background: 'none', border: 'none', color: '#ff453a', fontWeight: 'bold'}}>CHIUDI</button>
            </div>
            <textarea 
              style={{width: '100%', height: '100px', backgroundColor: '#1c1c1e', color: 'white', borderRadius: '12px', padding: '12px', border: '1px solid #333', fontSize: '14px', marginBottom: '10px'}}
              placeholder="Incolla da Excel..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button 
              onClick={() => {
                const righe = importText.split('\n').filter(r => r.trim().length > 5);
                const nuove = righe.map(r => {
                  const c = r.split('\t').map(col => col.replace(/"/g, '').trim());
                  return {
                    id: Math.random().toString(36).substr(2, 9),
                    squadra1: (c[1] || 'CASA').toUpperCase(),
                    squadra2: (c[2] || 'OSPITE').toUpperCase(),
                    categoria: (c[3] || 'GARA').toUpperCase(),
                    data: c[4] || new Date().toLocaleDateString('it-IT'),
                    importo: parseFloat((c[5] || '0').replace(',', '.')) || 0,
                    percepito: false
                  };
                });
                setPartite(prev => [...nuove, ...prev]);
                setImportText('');
              }}
              style={S.btnSave}
            >
              Carica nel Database
            </button>
            <button onClick={() => { if(confirm("Svuotare tutto?")) setPartite([]); }} style={S.btnDel}>Svuota Database</button>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div style={S.overlay} onClick={(e) => e.target === e.currentTarget && chiudiTutto()}>
          <div style={S.modal}>
            <div style={S.modalHandle}></div>
            <h2 style={{ marginBottom: '20px', fontWeight: '800' }}>Dettaglio Gara</h2>
            <label style={S.label}>CATEGORIA</label>
            <input style={S.input} value={cat} onChange={e => setCat(e.target.value)} />
            <div style={{ display: 'flex', gap: '10px' }}>
               <div style={{ flex: 1 }}><label style={S.label}>CASA</label><input style={S.input} value={s1} onChange={e => setS1(e.target.value)} /></div>
               <div style={{ flex: 1 }}><label style={S.label}>OSPITE</label><input style={S.input} value={s2} onChange={e => setS2(e.target.value)} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
               <div style={{ flex: 1 }}><label style={S.label}>DATA</label><input style={S.input} type="date" value={data} onChange={e => setData(e.target.value)} /></div>
               <div style={{ flex: 1 }}><label style={S.label}>IMPORTO €</label><input style={S.input} type="number" value={soldi} onChange={e => setSoldi(e.target.value)} /></div>
            </div>
            {selectedPartita && (
  <div 
    style={{...S.payRow, cursor: 'pointer', marginTop: '20px'}} 
    onClick={() => {
      const nuovePartite = partite.map(p => 
        p.id === selectedPartita.id ? { ...p, percepito: !p.percepito } : p
      );
      setPartite(nuovePartite);
      setSelectedPartita({...selectedPartita, percepito: !selectedPartita.percepito});
    }}
  >
    <span style={{color: 'white', fontWeight: 'bold'}}>Pagamento ricevuto</span>
    <div style={{
      width: '40px', 
      height: '22px', 
      borderRadius: '20px', 
      padding: '2px',
      backgroundColor: selectedPartita.percepito ? '#a3cf21' : '#333',
      display: 'flex',
      alignItems: 'center',
      transition: '0.3s'
    }}>
      <div style={{
        width: '18px', 
        height: '18px', 
        backgroundColor: 'white', 
        borderRadius: '50%',
        transition: '0.3s',
        transform: selectedPartita.percepito ? 'translateX(18px)' : 'translateX(0)'
      }} />
    </div>
  </div>
)}
            <button onClick={salvaPartita} style={S.btnSave}>Conferma</button>
            {selectedPartita && <button onClick={() => { if(window.confirm("Eliminare?")) { setPartite(partite.filter(p => p.id !== selectedPartita.id)); chiudiTutto(); } }} style={S.btnDel}>Elimina partita</button>}
          </div>
        </div>
      )}
    </div>
  );
}

const IconPartite = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1" fill={color}/><circle cx="3" cy="12" r="1" fill={color}/><circle cx="3" cy="18" r="1" fill={color}/></svg>
);
const IconGuadagni = ({ color }: { color: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
);
const IconMenu = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
);

const S: { [key: string]: React.CSSProperties } = {
  container: { backgroundColor: '#161616', color: 'white', minHeight: '100vh', fontFamily: '-apple-system, sans-serif', overflow: 'hidden' },
  flexWrapper: { display: 'flex', width: '200%', transition: '0.3s ease-out' },
  tabContent: { width: '50%', padding: '20px 15px 120px', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' },
  title: { fontSize: '32px', fontWeight: '800' },
  subtitle: { color: '#8e8e93', fontSize: '14px', marginBottom: '20px' },
  card: { backgroundColor: '#1c1c1e', padding: '18px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', marginBottom: '12px' },
  catBadge: { color: '#a3cf21', fontSize: '12px', fontWeight: 'bold', marginBottom: '0px', textAlign: 'left', alignSelf: 'flex-start' },
  teams: { fontSize: '17px', fontWeight: '800', lineHeight: '1.1', wordBreak: 'break-word', textAlign: 'left', fontFamily: 'sans-serif-condensed, Arial Narrow, sans-serif' },
  cardRight: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' },
  price: { fontSize: '20px', fontWeight: '900' },
  date: { color: '#8e8e93', fontSize: '11px' },
  status: { fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '6px', marginTop: '6px' },
  statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  statBox: { backgroundColor: '#1c1c1e', padding: '10px 8px', borderRadius: '18px', border: '1px solid #2c2c2e', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '90px', boxSizing: 'border-box' },
  statLabel: { color: '#8e8e93', fontSize: '11px', fontWeight: '600' },
  statValue: { fontSize: '22px', fontWeight: '800', marginTop: '5px' },
  nav: { position: 'fixed', bottom: 0, width: '100%', height: '85px', backgroundColor: '#121212', display: 'flex', justifyContent: 'space-around', alignItems: 'center', borderTop: '1px solid #2c2c2e', paddingBottom: '15px' },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fab: { width: '56px', height: '56px', borderRadius: '28px', backgroundColor: '#a3cf21', border: 'none', fontSize: '28px', fontWeight: 'bold', marginTop: '-40px' },
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-end', zIndex: 1000 },
  modal: { backgroundColor: '#121212', width: '100%', padding: '20px 25px 40px', borderTopLeftRadius: '25px', borderTopRightRadius: '25px', borderTop: '1px solid #333', maxHeight: '90vh', overflowY: 'auto' },
  modalHandle: { width: '40px', height: '4px', backgroundColor: '#333', borderRadius: '2px', margin: '0 auto 20px' },
  label: { display: 'block', color: '#8e8e93', fontSize: '10px', fontWeight: 'bold', marginBottom: '6px' },
  input: { width: '100%', padding: '14px', backgroundColor: '#1c1c1e', border: '1px solid #2c2c2e', borderRadius: '12px', color: 'white', marginBottom: '15px', fontSize: '16px', boxSizing: 'border-box' },
  btnSave: { width: '100%', padding: '16px', backgroundColor: '#a3cf21', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '16px', color: '#000' },
  btnDel: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#ff453a', border: 'none', marginTop: '10px', fontWeight: 'bold' },
  payRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderTop: '1px solid #2c2c2e', marginBottom: '10px' },
  toggle: { width: '42px', height: '22px', borderRadius: '11px', padding: '2px', transition: '0.3s' },
  toggleCircle: { width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', transition: '0.3s' }
};