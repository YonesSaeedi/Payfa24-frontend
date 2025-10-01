// // src/utils/api/authBasic.ts
// import { apiRequest } from '../apiClient';

// interface ContactPayload {
//   email?: string;
//   mobile?: string;
//   code?: string;
// }

// interface ApiResponse {
//   status: boolean;
//   msg?: string;
// }

// export const sendContact = async (payload: { email?: string; mobile?: string }) => {
//   return apiRequest<ApiResponse>({
//     url: '/api/kyc/basic/level1', // add /api for proxy
//     method: 'POST',
//     data: payload,
//   });
// };

// export const verifyOtp = async (payload: { email?: string; mobile?: string; code: string }) => {
//   return apiRequest<ApiResponse>({
//     url: '/api/kyc/basic/level1', // add /api for proxy
//     method: 'POST',
//     data: payload,
//   });
// };




// src/utils/api/authBasic.ts
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
    url: '/kyc/basic/level1', // مطابق Swagger
    method: 'POST',
    data: payload,
  });
};

export const verifyOtp = async (payload: VerifyPayload) => {
  return apiRequest<ApiResponse>({
    url: '/kyc/basic/level1', // مطابق Swagger
    method: 'POST',
    data: payload,
  });
};