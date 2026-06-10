
export interface Voter {
  id: string;
  surname: string;
  firstName: string;
  lastName: string;
  stateOfOrigin: string;
  occupation: string;
  address: string;
  gender: 'male' | 'female';
  passportUrl: string;
  biometricId: string;
  email: string;
  phoneNumber: string;
  nin?: string;
  nationalIdUrl?: string;
  birthCertificateUrl?: string;
  driversLicenseUrl?: string;
  password?: string;
  registeredAt: number;
}

export interface Vote {
  id: string;
  voterId: string;
  electionType: 'presidential' | 'gubernatorial' | 'chairman';
  partyId: string;
  state: string; // Relevant for Gov/Chairman
  votedAt: number;
}

export interface Party {
  id: string;
  name: string;
  shortName: string;
  logoColor?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: number;
}
