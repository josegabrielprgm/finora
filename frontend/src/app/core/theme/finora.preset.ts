import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Tema "Escuro elegante" do Finora.
 * Fundo azul-marinho, ações em âmbar.
 * Todas as cores do app saem daqui: nunca use hex solto nos componentes.
 */
export const FinoraPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{amber.50}',
      100: '{amber.100}',
      200: '{amber.200}',
      300: '{amber.300}',
      400: '{amber.400}',
      500: '{amber.500}',
      600: '{amber.600}',
      700: '{amber.700}',
      800: '{amber.800}',
      900: '{amber.900}',
      950: '{amber.950}'
    },
    colorScheme: {
      dark: {
        surface: {
          0: '#ffffff',
          50: '#E6F1FB',
          100: '#C9DDF0',
          200: '#A3C2E0',
          300: '#85B7EB',
          400: '#5A86B5',
          500: '#3D6A99',
          600: '#285380',
          700: '#183F66',
          800: '#0C3358',
          900: '#062A4C',
          950: '#031D36'
        }
      }
    }
  }
});