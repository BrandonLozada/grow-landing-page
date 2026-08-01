import type { Site, Socials } from './types';

export const SITE: Site = {
  COMPANY_NAME: 'Servicios Especializados GROW',
  LEGAL_NAME: 'Servicios Especializados GROW',
  TITLE: 'Soluciones administrativas, contables y jurídicas para tu empresa.',
  DESCRIPTION:
    'En Servicios Especializados GROW ayudamos a las organizaciones a optimizar sus procesos administrativos mediante la gestión integral de nómina, servicios contables, asesoría jurídica y soluciones especializadas.',
  CANONICAL_URL: import.meta.env.DEV
    ? 'http://localhost:4321'
    : 'https://grow-landing-page.pages.dev',
  LOCALE: 'es',
  TELEPHONE: '+52 (81) 1234 5678',
  EMAIL: 'administracion@growespecializados.com.mx',
  ADDRESS:
    'Calle Torreón No. 1719, Interior 11, Colonia Mitras Centro, C.P. 64460, Monterrey, Nuevo León, México',

  OG_IMAGE: '/grow-logo-og.png',
};

export const SOCIALS: Socials = [
  {
    NAME: 'Facebook',
    ICON: 'facebook',
    LABEL: `${SITE.COMPANY_NAME} en Facebook`,
    HREF: 'https://www.facebook.com/',
  },
  {
    NAME: 'Instagram',
    ICON: 'instagram',
    LABEL: `${SITE.COMPANY_NAME} en Instagram`,
    HREF: 'https://www.instagram.com/',
  },
];
