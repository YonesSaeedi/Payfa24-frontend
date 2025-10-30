
// import { apiRequest } from '../apiClient';

// interface ContactPayload {
//   email?: string;
//   mobile?: string;
// }

// interface VerifyPayload extends ContactPayload {
//   code: string;
// }
// type ContactPayload = Record<string, string | number | boolean | Blob | File> & {
//   email?: string;
//   mobile?: string;
// };

// type VerifyPayload = ContactPayload & {
//   code: string;
// };

// interface ApiResponse {
//   status: boolean;
//   msg?: string;
// }

// export const sendContact = async (payload: ContactPayload) => {
//   return apiRequest<ApiResponse>({
//     url: '/api/kyc/basic/level1', // مطابق Swagger
//     method: 'POST',
//     data: payload,
//   });
// };

// export const verifyOtp = async (payload: VerifyPayload) => {
//   return apiRequest<ApiResponse>({
//     url: '/api/kyc/basic/level1', // مطابق Swagger
//     method: 'POST',
//     data: payload,
//   });
// };

// export const sendContact = async (payload: ContactPayload) => {
//   return apiRequest<ApiResponse, ContactPayload>({
//     url: '/api/kyc/basic/level1',
//     method: 'POST',
//     data: payload,
//   });
// };

// export const verifyOtp = async (payload: VerifyPayload) => {
//   return apiRequest<ApiResponse, VerifyPayload>({
//     url: '/api/kyc/basic/level1',
//     method: 'POST',
//     data: payload,
//   });
// };
