export type Category = 'Sightseeing' | 'Food' | 'Hotel' | 'Transport' | 'Flight';
export type Priority = 'High' | 'Medium' | 'Low';
export type ScheduleStatus = 'NotStarted' | 'InProgress' | 'Completed';

export interface TransportDetail {
  type: '徒歩' | 'MRT' | 'タクシー' | 'バス' | '飛行機' | 'なし' | string;
  durationMin: number;
  route?: string;
  mapUrl?: string;
}

export interface ScheduleItem {
  id: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  startTime: string; // 'HH:mm'
  endTime: string; // 'HH:mm'
  locationName: string;
  lat: number;
  lng: number;
  address?: string;
  googleMapsUrl?: string;
  placeId?: string;
  openingHours?: {
    open: string;
    close: string;
  };
  category: Category;
  priority: Priority;
  notes?: string;
  transport?: TransportDetail;
  stayDurationMin?: number;
  highlights?: string[];
  warnings?: string[];
  order: number; // for sorting
  qrCodeUrl?: string; // for reservations
  status?: ScheduleStatus;
  showTaxiCard?: boolean; // Whether to show Taxi destination card button (defaults to true)
}

