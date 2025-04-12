/**
 * Data validation utilities for SuiteSync
 * Implements consistent validation across the application
 */
import { z } from 'zod';
import { sanitizeHtml, sanitizeUrl } from './security';

// Common validation schemas
export const commonSchemas = {
  // User information
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  
  // Content
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long')
    .transform(str => sanitizeHtml(str.trim())),
  description: z.string().max(2000, 'Description is too long')
    .transform(str => sanitizeHtml(str.trim())),
  content: z.string().transform(sanitizeHtml),
  
  // URLs and links
  url: z.string().url('Invalid URL').transform(sanitizeUrl),
  imageUrl: z.string().url('Invalid image URL').transform(sanitizeUrl),
  
  // IDs and references
  id: z.string().uuid('Invalid ID format'),
  reference: z.string().min(1, 'Reference is required'),
  
  // Dates and times
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  datetime: z.string().datetime('Invalid datetime format'),
  
  // Numbers
  positiveNumber: z.number().positive('Number must be positive'),
  nonNegativeNumber: z.number().min(0, 'Number must be non-negative'),
  
  // Booleans
  boolean: z.boolean(),
};

/**
 * Validate user input against a schema
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with data and errors
 */
export function validateData<T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
} {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/**
 * Format validation errors into a user-friendly object
 * @param errors - Zod validation errors
 * @returns Object with field names as keys and error messages as values
 */
export function formatValidationErrors(errors: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};
  
  for (const error of errors.errors) {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  }
  
  return formattedErrors;
}

// Notification validation schema
export const notificationSchema = z.object({
  title: commonSchemas.title,
  message: commonSchemas.content,
  type: z.enum(['info', 'success', 'warning', 'error']),
  isUrgent: commonSchemas.boolean.optional().default(false),
  sourceType: z.enum(['system', 'user', 'automated']),
  userId: commonSchemas.id.optional(),
});

// User profile validation schema
export const userProfileSchema = z.object({
  displayName: commonSchemas.name,
  email: commonSchemas.email,
  phone: commonSchemas.phone.optional(),
  bio: z.string().max(500, 'Bio is too long').transform(sanitizeHtml).optional(),
  avatarUrl: commonSchemas.imageUrl.optional(),
  preferences: z.record(z.unknown()).optional(),
});

// Appointment validation schema
export const appointmentSchema = z.object({
  title: commonSchemas.title,
  description: commonSchemas.description.optional(),
  startTime: commonSchemas.datetime,
  endTime: commonSchemas.datetime,
  clientId: commonSchemas.id,
  serviceId: commonSchemas.id,
  notes: z.string().max(1000, 'Notes are too long').transform(sanitizeHtml).optional(),
  status: z.enum(['scheduled', 'confirmed', 'cancelled', 'completed']),
});

// Client validation schema
export const clientSchema = z.object({
  name: commonSchemas.name,
  email: commonSchemas.email.optional(),
  phone: commonSchemas.phone.optional(),
  address: z.string().max(500, 'Address is too long').optional(),
  notes: z.string().max(1000, 'Notes are too long').transform(sanitizeHtml).optional(),
});
