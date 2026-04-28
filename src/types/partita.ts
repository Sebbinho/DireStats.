export interface Partita {
  id: string;
  squadra1: string;
  squadra2: string;
  categoria: string; // Es: "U16 REG", "U15 PROV"
  data: string; // Es: "26/04/2026"
  importo: number; // Es: 47
  percepito: boolean; // true = "Ricevuto", false = "In attesa"
  amichevole: boolean; // Per la scritta "AMICHEVOLE"
}