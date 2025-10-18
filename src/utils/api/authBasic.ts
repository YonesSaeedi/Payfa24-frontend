import { apiRequest } from '../apiClient';

interface ContactPayload {
  email?: string;
  mobile?: string;
}

interface VerifyPayload extends ContactPayload {
  code: string;
}

interface ApiResponse {
  status: boolean;
  msg?: string;
}

export const sendContact = async (payload: ContactPayload) => {
  return apiRequest<ApiResponse>({
    url: '/api/kyc/basic/level1', // مطابق Swagger
    method: 'POST',
    data: payload,
  });
};

export const verifyOtp = async (payload: VerifyPayload) => {
  return apiRequest<ApiResponse>({
    url: '/api/kyc/basic/level1', // مطابق Swagger
    method: 'POST',
    data: payload,
  });
};