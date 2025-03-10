export class Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
}
