import type { APIRoute } from 'astro';
import { contactSchema } from '../../schemas/contact';
import { sendContactNotification } from '../../lib/email/service';
import type { ApiResponse } from '../../types/contact';

// Habilita el modo dinámico (Serverless Function) en Astro para esta ruta API
export const prerender = false;

/**
 * Stub / Hook para validación futura de Rate Limiting.
 * Retorna true por defecto.
 */
async function checkRateLimit(_request: Request): Promise<boolean> {
  // En el futuro, aquí se consultará Upstash Redis o memoria para limitar peticiones por IP.
  return true;
}

/**
 * Stub / Hook para validación futura de Cloudflare Turnstile.
 * Retorna true por defecto.
 */
async function verifyTurnstileToken(_token?: string): Promise<boolean> {
  // En el futuro, aquí se enviará el token a https://challenges.cloudflare.com/turnstile/v0/siteverify
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  // 1. Verificación de Rate Limit
  const isAllowed = await checkRateLimit(request);
  if (!isAllowed) {
    const errorResponse: ApiResponse = {
      success: false,
      message: 'Demasiadas solicitudes. Por favor, inténtalo más tarde.',
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. Parseo del cuerpo de la petición
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      const response: ApiResponse = {
        success: false,
        message: 'El formato de la solicitud no es un JSON válido.',
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Validación de esquema con Zod
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      const response: ApiResponse = {
        success: false,
        message: 'Por favor, corrige los errores en el formulario.',
        errors: fieldErrors as Record<string, string[]>,
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = validationResult.data;

    // 4. Verificación Anti-Spam Honeypot
    // Si un bot ha rellenado el campo trampa 'website_hp', fingimos un envío exitoso
    if (data.website_hp && data.website_hp.trim() !== '') {
      console.warn('[Anti-Spam] Intento de spam detectado mediante honeypot.');
      const fakeSuccess: ApiResponse = {
        success: true,
        message: '¡Gracias! Tu mensaje ha sido enviado exitosamente.',
      };
      return new Response(JSON.stringify(fakeSuccess), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 5. Verificación de Cloudflare Turnstile (Hook listo para activarse)
    const isTurnstileValid = await verifyTurnstileToken(data.turnstileToken);
    if (!isTurnstileValid) {
      const response: ApiResponse = {
        success: false,
        message: 'La verificación anti-bot ha fallado. Inténtalo de nuevo.',
      };
      return new Response(JSON.stringify(response), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 6. Envío del correo electrónico mediante Resend
    await sendContactNotification(data);

    const successResponse: ApiResponse = {
      success: true,
      message: '¡Gracias! Tu mensaje ha sido enviado exitosamente. Nos pondremos en contacto contigo a la brevedad.',
    };

    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Registro interno del error únicamente en el servidor (nunca expuesto al cliente)
    console.error('[API /api/contact Error Serverless]:', error);

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Ocurrió un error inesperado al procesar tu solicitud. Por favor, inténtalo de nuevo o contáctanos por teléfono.',
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

/**
 * Rechaza cualquier otro método HTTP distinto de POST (GET, PUT, DELETE, etc.)
 */
export const ALL: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    const response: ApiResponse = {
      success: false,
      message: `El método ${request.method} no está permitido en este endpoint. Utiliza POST.`,
    };
    return new Response(JSON.stringify(response), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        Allow: 'POST',
      },
    });
  }
  return new Response(null, { status: 405 });
};
