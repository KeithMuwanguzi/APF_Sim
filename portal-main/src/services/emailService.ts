/**
 * EmailJS Service for sending emails from frontend
 * Note: EmailJS only works from browser, not from backend servers
 * In development mode, emails are logged to console instead of being sent
 */

import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID ='service_vjzvr2e';
const EMAILJS_PUBLIC_KEY ='bnnAdDByZZy8gxYSF';
const EMAILJS_TEMPLATE_ID_OTP ='template_5ea6jqe';
const EMAILJS_TEMPLATE_ID_APPROVAL ='template_hdunzl7';


// Check if we're in development mode
const IS_DEVELOPMENT = import.meta.env.DEV || import.meta.env.MODE === 'development';

// Initialize EmailJS only in production
if (!IS_DEVELOPMENT) {
  emailjs.init(EMAILJS_PUBLIC_KEY);
}

export interface SendOTPEmailParams {
  to_email: string;
  otp_code: string;
  user_name?: string;
}

export interface SendApprovalEmailParams {
  to_email: string;
  user_name: string;
  from_email?: string;
}

/**
 * Send OTP email using EmailJS from frontend
 * In development mode, logs to console instead of sending
 */
export const sendOTPEmail = async (params: SendOTPEmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      otp_code: params.otp_code,
      user_name: params.user_name || params.to_email.split('@')[0],
    };

    // In development mode, just log to console
    if (IS_DEVELOPMENT) {
      console.log('[DEV MODE] OTP Email (not sent via EmailJS):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('To:', templateParams.to_email);
      console.log('User:', templateParams.user_name);
      console.log('OTP Code:', templateParams.otp_code);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(' Email logged to console (development mode)');
      return true;
    }

    // In production, send via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_OTP,
      templateParams
    );

    if (response.status === 200) {
      console.log('OTP email sent successfully via EmailJS');
      return true;
    } else {
      console.error(' EmailJS error:', response);
      return false;
    }
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

/**
 * Send application approval email using EmailJS from frontend
 * In development mode, logs to console instead of sending
 */
export const sendApprovalEmail = async (params: SendApprovalEmailParams): Promise<boolean> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      user_name: params.user_name,
      from_email:'abnowellah@gmail.com',
      reply_to: 'noreply@apf-uganda.com',
    };

    // In development mode, just log to console
    if (IS_DEVELOPMENT) {
      console.log('[DEV MODE] Approval Email (not sent via EmailJS):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('To:', templateParams.to_email);
      console.log('User:', templateParams.user_name);
      console.log('From:', templateParams.from_email);
      console.log('Reply To:', templateParams.reply_to);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Email logged to console (development mode)');
      return true;
    }

    // In production, send via EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_APPROVAL,
      templateParams
    );

    if (response.status === 200) {
      console.log(' Approval email sent successfully via EmailJS');
      return true;
    } else {
      console.error(' EmailJS error:', response);
      return false;
    }
  } catch (error) {
    console.error(' Error sending approval email:', error);
    return false;
  }
};
