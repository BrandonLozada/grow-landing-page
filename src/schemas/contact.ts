import { z } from 'zod';

/**
 * Esquema de validación del lado servidor para el formulario de contacto.
 * Utiliza Zod para asegurar la integridad, saneamiento y tipos de los datos ingresados.
 */
export const contactSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es obligatorio.' })
    .trim()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
    .max(100, { message: 'El nombre no puede exceder los 100 caracteres.' }),

  company: z
    .string()
    .trim()
    .max(100, { message: 'El nombre de la empresa no puede exceder 100 caracteres.' })
    .optional()
    .or(z.literal('')),

  email: z
    .string({ required_error: 'El correo electrónico es obligatorio.' })
    .trim()
    .toLowerCase()
    .email({ message: 'Ingresa un correo electrónico válido.' }),

  phone: z
    .string()
    .trim()
    .max(30, { message: 'El teléfono no puede exceder 30 caracteres.' })
    .optional()
    .or(z.literal('')),

  message: z
    .string({ required_error: 'El mensaje es obligatorio.' })
    .trim()
    .min(5, { message: 'El mensaje debe contener al menos 5 caracteres.' })
    .max(2000, { message: 'El mensaje no puede exceder los 2000 caracteres.' }),

  /**
   * Campo trampa Honeypot. Si un bot lo llena, la API ignorará silenciosamente el envío.
   */
  website_hp: z.string().optional().or(z.literal('')),

  /**
   * Token preparado para la futura validación de Cloudflare Turnstile
   */
  turnstileToken: z.string().optional(),
});

export type ContactSchemaType = z.infer<typeof contactSchema>;
