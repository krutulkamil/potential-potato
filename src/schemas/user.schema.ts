import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      firstName: z
        .string({
          required_error: 'First Name is required',
        })
        .min(2, 'First Name too short - should be 2 chars minimum')
        .max(24, 'First Name too long - should be 24 chars maximum'),
      lastName: z
        .string({
          required_error: 'Last Name is required',
        })
        .min(2, 'Last Name too short - should be 2 chars minimum')
        .max(24, 'Last Name too long - should be 24 chars maximum'),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email('Not a valid email address'),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, 'Password too short - should be 6 chars minimum')
        .max(24, 'Password too long - should be 24 chars maximum'),
      passwordConfirmation: z
        .string({
          required_error: 'Password confirmation is required',
        })
        .min(
          6,
          'Password confirmation is too short - should be 6 chars minimum'
        )
        .max(24, 'Password confirmation too long - should be 24 chars maximum'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: 'Passwords do not match',
      path: ['passwordConfirmation'],
    }),
});

export const verifyUserSchema = z.object({
  params: z
    .object({
      id: z.string(),
      verificationCode: z.string(),
    })
    .refine((data) => data.id.length === 24, {
      message: 'Invalid mongoDB id. Must be 24 characters long',
      path: ['id'],
    }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
  }),
});

export type TCreateUserSchema = z.TypeOf<typeof createUserSchema>;
export type TVerifyUserSchema = z.TypeOf<typeof verifyUserSchema>['params'];
export type TForgotPasswordSchema = z.TypeOf<
  typeof forgotPasswordSchema
>['body'];
