
export interface Suite {
  id: string;
  name: string;
  number: string;
  status: 'unsold' | 'sold';
  capacity: number;
  level: string;
  section: string;
  notes?: string;
  hosts?: string;
  owner?: string;
  lastUpdated: string;
}
