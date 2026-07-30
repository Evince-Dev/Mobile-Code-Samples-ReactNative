import { z } from 'zod';

/**
 * AuthValidationService Class
 * Centralizes all form validation schemas across authentication screens.
 */
export class AuthValidationService {
  /**
   * Zod schema for standard Email & Password Login (LoginScreen)
   */
  static readonly loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'auth.emailRequired' })
      .email({ message: 'auth.invalidEmail' }),
    password: z
      .string()
      .min(1, { message: 'auth.passwordRequired' })
      .min(6, { message: 'auth.passwordMinLength' }),
  });

  /**
   * Zod schema for Login With One-Time Code Form (LoginWithCodeScreen)
   */
  static readonly codeFormSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'auth.emailRequired' })
      .email({ message: 'auth.invalidEmail' }),
  });

  /**
   * Zod schema for Forgot Password Form (ForgotPasswordScreen)
   */
  static readonly forgotPasswordSchema = z.object({
    email: z
      .string()
      .min(1, { message: 'auth.emailRequired' })
      .email({ message: 'auth.invalidEmail' }),
  });
}

export type LoginFormValues = z.infer<typeof AuthValidationService.loginSchema>;
export type CodeFormValues = z.infer<typeof AuthValidationService.codeFormSchema>;
export type ForgotPasswordFormValues = z.infer<typeof AuthValidationService.forgotPasswordSchema>;
