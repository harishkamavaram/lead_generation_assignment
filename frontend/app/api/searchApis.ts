import type { AxiosResponse } from 'axios';
import instance from './search-instances';
import { Person } from '@/components/lead-results';

export interface SearchPayload {
  prompt: string;
}

export interface SendEmailPayload {
  email: string;
  data: Person[];
}

export async function HandleSearch({ prompt }: SearchPayload): Promise<AxiosResponse> {
  try {
    console.log('Prompt in HandleSearch :', prompt);
    const response = await instance.post('/search', { prompt });
    return response;
  } catch (error) {
    console.error('Error in search:', error);
    throw error;
  }
}

export async function SendEmailWithCsv(payload: SendEmailPayload): Promise<AxiosResponse> {
  try {
    console.log('Payload in SendEmailWithCsv :', payload);
    const response = await instance.post('/send-email', payload);
    return response;
  } catch (error) {
    console.error('Error sending email with CSV:', error);
    throw error;
  }
}