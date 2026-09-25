export type RequestStatus = 'submitted' | 'cancelled';

export interface ApplicantInfo {
  fullName: string;
  nationalId: string;
  mobile: string;
  email?: string;
  dateOfBirth: string;
}

export type DeliveryDetails =
  | { method: 'pickup'; appointmentDate: string }
  | { method: 'courier'; governorateId: string; street: string };

export interface ServiceRequest {
  referenceNumber: string;
  serviceId: string;
  status: RequestStatus;
  submittedAt: string;
  applicant: ApplicantInfo;
  delivery: DeliveryDetails;
  notes?: string;
}

export interface CreateRequestPayload {
  serviceId: string;
  applicant: ApplicantInfo;
  delivery: DeliveryDetails;
  notes?: string;
}
