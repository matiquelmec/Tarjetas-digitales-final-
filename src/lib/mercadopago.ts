import { MercadoPagoConfig } from 'mercadopago';
// import { Preference } from 'mercadopago'; // Unused import

// Initialize MercadoPago only if access token is available
export const mercadopago = process.env.MP_ACCESS_TOKEN 
  ? new MercadoPagoConfig({ 
      accessToken: process.env.MP_ACCESS_TOKEN 
    })
  : null;

export const CARD_PRICES = {
  FIRST_YEAR: 4990,      // $4,990 CLP primer año
  RENEWAL: 2990,         // $2,990 CLP renovación
  TRIAL_DAYS: 7,         // 7 días de trial
};

// Ya no hay límites - durante trial tiene acceso completo
export const TRIAL_ACCESS = {
  TRIAL_DAYS: 7,
  FULL_ACCESS: true,     // Durante trial tiene acceso completo
};

export const SUBSCRIPTION_DETAILS = {
  FIRST_YEAR: {
    name: 'Tarjetas Digitales Premium - Primer Año',
    description: 'Acceso completo a todas las funcionalidades por 12 meses',
    price: CARD_PRICES.FIRST_YEAR,
  },
  RENEWAL: {
    name: 'Tarjetas Digitales Premium - Renovación',
    description: 'Renovación anual con precio especial para usuarios existentes',
    price: CARD_PRICES.RENEWAL,
  },
};