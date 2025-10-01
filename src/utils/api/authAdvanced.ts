import { apiRequest } from '../apiClient';

interface AdvancedLevel1Payload {
  file1: File; 
  file2: File; 
}

interface ApiResponse {
  status: boolean;
  msg?: string;
}

export const sendAdvancedLevel1 = async (payload: AdvancedLevel1Payload) => {
  const formData = new FormData();
  formData.append('file1', payload.file1);
  formData.append('file2', payload.file2);

  return apiRequest<ApiResponse>({
    url: '/kyc/advanced/level1',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
