
export interface Suite {
  id: string;
  name: string;
  number: string;
  status: 'vacant' | 'occupied' | 'maintenance' | 'cleaning';
  capacity: number;
  level: string;
  section: string;
  notes?: string;
  lastUpdated: string;
}
