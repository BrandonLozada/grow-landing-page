import type { ContactFormData } from '../../types/contact';

/**
 * Función auxiliar para escapar caracteres HTML en entradas dinámicas
 * previendo ataques de inyección de HTML o formato en el cliente de correo.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Genera la versión en texto plano del correo de notificación de contacto.
 */
export function generateContactEmailText(data: ContactFormData): string {
  const companyStr = data.company ? data.company : 'No especificada';
  const phoneStr = data.phone ? data.phone : 'No especificado';

  return `
NUEVO MENSAJE DE CONTACTO - LANDING GROW
========================================

Detalles del remitente:
----------------------
• Nombre: ${data.name}
• Empresa: ${companyStr}
• Correo electrónico: ${data.email}
• Teléfono: ${phoneStr}

Mensaje:
--------
${data.message}

---
Este mensaje fue enviado desde el formulario de contacto de growespecializados.com.mx
`.trim();
}

/**
 * Genera la versión HTML corporativa del correo de notificación de contacto.
 */
export function generateContactEmailHtml(data: ContactFormData): string {
  const safeName = escapeHtml(data.name);
  const safeCompany = data.company ? escapeHtml(data.company) : '<em style="color:#888888;">No especificada</em>';
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : '<em style="color:#888888;">No especificado</em>';
  const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>');

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo contacto desde la Landing GROW</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; color: #222222; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f6f8; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e1e6eb;">
          
          <!-- Encabezado -->
          <tr>
            <td style="background-color: #0b2545; padding: 28px 32px; text-align: left;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">
                Servicios Especializados GROW
              </h1>
              <p style="color: #8da9c4; margin: 6px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                Notificación de Nuevo Contacto
              </p>
            </td>
          </tr>

          <!-- Contenido Principal -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin-top: 0; margin-bottom: 24px; font-size: 15px; line-height: 1.5; color: #444444;">
                Has recibido una nueva consulta desde el formulario de la landing page. A continuación se presentan los detalles facilitados por el visitante:
              </p>

              <!-- Tabla de Datos -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 28px; border-collapse: collapse;">
                <tr>
                  <td width="35%" style="padding: 12px 16px; background-color: #f8fafc; font-size: 13px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">
                    Nombre:
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${safeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 13px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">
                    Empresa:
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${safeCompany}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 13px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">
                    Correo:
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    <a href="mailto:${safeEmail}" style="color: #134074; text-decoration: none; font-weight: 500;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #f8fafc; font-size: 13px; font-weight: bold; color: #475569; border-bottom: 1px solid #e2e8f0; text-transform: uppercase;">
                    Teléfono:
                  </td>
                  <td style="padding: 12px 16px; background-color: #ffffff; font-size: 14px; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                    ${safePhone}
                  </td>
                </tr>
              </table>

              <!-- Caja de Mensaje -->
              <div style="margin-bottom: 24px;">
                <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #334155; text-transform: uppercase; letter-spacing: 0.5px;">
                  Mensaje del visitante:
                </h3>
                <div style="background-color: #f8fafc; border-left: 4px solid #134074; padding: 16px; border-radius: 0 6px 6px 0; font-size: 14px; line-height: 1.6; color: #1e293b;">
                  ${safeMessage}
                </div>
              </div>

              <!-- Indicador de Responder -->
              <p style="margin-top: 24px; margin-bottom: 0; font-size: 13px; color: #64748b; font-style: italic;">
                💡 Puedes responder directamente a este correo para comunicarte con <strong>${safeName}</strong> (${safeEmail}).
              </p>
            </td>
          </tr>

          <!-- Pie de página -->
          <tr>
            <td style="background-color: #f1f5f9; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Servicios Especializados GROW &copy; ${new Date().getFullYear()} — Notificación Automática de Formulario web.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
}
