/**
 * Datos recibidos desde el formulario de contacto de la landing page.
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  /** Campo trampa anti-spam (Honeypot). Debe estar vacío para usuarios reales. */
  website_hp?: string;
  /** Token reservado para la futura integración con Cloudflare Turnstile */
  turnstileToken?: string;
}

/**
 * Estructura estandarizada para las respuestas JSON de las API Routes.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

/**
 * Tipos de correos soportados por el servicio de email de la aplicación.
 * Facilita la extensión para futuras funcionalidades sin modificar la arquitectura base.
 */
export type EmailType = 
  | 'contact_notification'
  | 'customer_confirmation'
  | 'quote_request';

/**
 * Parámetros para el envío de correos a través del servicio de email.
 */
export interface SendEmailOptions {
  type: EmailType;
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  replyTo?: string;
}
