import { Resend } from 'resend';
import type { SendEmailOptions, ContactFormData } from '../../types/contact';
import {
  generateContactEmailHtml,
  generateContactEmailText,
} from './contact-template';

/**
 * Instancia diferida (lazy) del cliente Resend.
 */
let resendInstance: Resend | null = null;

function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error(
        'Falta la variable de entorno RESEND_API_KEY. Configúrala en tu entorno o en .env'
      );
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

/**
 * Servicio genérico para envío de correos mediante Resend.
 * Permite despachar cualquier tipo de correo (notificaciones, confirmaciones, cotizaciones).
 */
export async function sendEmail(options: SendEmailOptions) {
  const resend = getResendClient();

  const defaultFrom =
    import.meta.env.FROM_EMAIL ||
    process.env.FROM_EMAIL ||
    'Landing GROW <noreply@growespecializados.com.mx>';

  const from = options.from || defaultFrom;

  const response = await resend.emails.send({
    from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });

  if (response.error) {
    throw new Error(`Error de Resend API: ${response.error.message}`);
  }

  return response.data;
}

/**
 * Función especializada para enviar notificaciones de contacto.
 * Consume las plantillas limpias y la configuración predeterminada de GROW.
 */
export async function sendContactNotification(formData: ContactFormData) {
  const destinationEmail =
    import.meta.env.CONTACT_EMAIL ||
    process.env.CONTACT_EMAIL ||
    'administracion@growespecializados.com.mx';

  const html = generateContactEmailHtml(formData);
  const text = generateContactEmailText(formData);

  return sendEmail({
    type: 'contact_notification',
    to: destinationEmail,
    subject: `Nuevo contacto desde la Landing GROW — ${formData.name}`,
    html,
    text,
    replyTo: formData.email,
  });
}
