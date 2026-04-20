// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'admin' | 'student' | 'super_admin';
        [key: string]: unknown;
      };
      file?: any;
      files?: any;
    }
  }
}

// Type declarations for missing modules
declare module 'bcrypt' {
  export function hash(data: string, salt: number | string): Promise<string>;
  export function compare(data: string, hash: string): Promise<boolean>;
  export function genSalt(rounds?: number): Promise<string>;
}

declare module 'express-validator' {
  export const body: any;
  export const param: any;
  export const query: any;
  export const validationResult: any;
  export interface ValidationChain {
    isEmail(): ValidationChain;
    isLength(options: { min?: number; max?: number }): ValidationChain;
    matches(pattern: string | RegExp): ValidationChain;
    isIn(values: any[]): ValidationChain;
    notEmpty(): ValidationChain;
    isNumeric(): ValidationChain;
    isString(): ValidationChain;
    optional(): ValidationChain;
  }
}

declare module 'multer' {
  export interface Multer {
    single(fieldname: string): any;
    array(fieldname: string, maxCount?: number): any;
    fields(fields: any[]): any;
    none(): any;
    any(): any;
  }
  export function multer(options?: any): Multer;
}

declare module 'uuid' {
  export function v4(): string;
}