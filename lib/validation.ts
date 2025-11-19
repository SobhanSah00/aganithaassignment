import { z } from "zod"

export const createLinkValidation = z.object({
    targetUrl: z.string().url('Invalid url format'),
    code: z.string().regex(/^[A-Za-z0-9]{6,8}$/, 'Code must be 6-8 alphanumeric characters').optional(),
})

export const codeValidation = z.string().regex(/^[A-Za-z0-9]{6,8}$/, 'Invalid code format')
