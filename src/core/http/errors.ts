export class DomainError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export const HttpStatusByCode: Record<string, number> = {
  // Validação
  VALIDATION_ERROR: 400,
  BAD_REQUEST: 400,
  
  // Autenticação/Autorização
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  
  // Recursos
  NOT_FOUND: 404,
  CONFLICT: 409,
  
  // Negócio
  EMAIL_IN_USE: 409,
  INVALID_CREDENTIALS: 401,
  
  // Infraestrutura
  INTERNAL_ERROR: 500,
} as const;
