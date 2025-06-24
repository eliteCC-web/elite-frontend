import apiClient from './api-client';

export interface EmailVerificationResponse {
  success: boolean;
  message: string;
}

export interface EmailStatusResponse {
  verified: boolean;
  email: string;
  message: string;
}

export class EmailVerificationService {
  static async sendVerificationEmail(userId: number, email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/email-verification/send', {
      userId,
      email
    });
    return response.data;
  }

  static async verifyEmail(token: string): Promise<EmailVerificationResponse> {
    const response = await apiClient.post('/email-verification/verify', {
      token
    });
    return response.data;
  }

  static async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post('/email-verification/resend', {
      email
    });
    return response.data;
  }

  static async getEmailVerificationStatus(email: string): Promise<EmailStatusResponse> {
    const response = await apiClient.get(`/email-verification/status/${email}`);
    return response.data;
  }
} 