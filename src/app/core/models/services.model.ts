export type Lang = 'en' | 'ar';

export type DeliveryMethod = 'pickup' | 'courier';

export interface LocalizedText {
  en: string;
  ar: string;
}

export interface Category {
  id: string;
  name: LocalizedText;
  icon: string;
}

export interface Governorate {
  id: string;
  name: LocalizedText;
}

export interface GovService {
  id: string;
  categoryId: string;
  name: LocalizedText;
  summary: LocalizedText;
  description: LocalizedText;
  entity: LocalizedText;
  fee: number;
  processingDays: number;
  isActive: boolean;
  requiredDocuments?: LocalizedText[];
  deliveryOptions: DeliveryMethod[];
  keywords?: string[];
}

export interface ServicesData {
  version: number;
  governorates: Governorate[];
  categories: Category[];
  services: GovService[];
}
