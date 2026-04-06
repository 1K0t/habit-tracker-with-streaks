import { Logger } from '@nestjs/common';

const logger = new Logger('EnvValidation');

/**
 * Validates that all required environment variables are set at application startup.
 * Throws an error if any required variables are missing.
 */
export function validateEnvironment(): void {
  const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];

  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.debug('✓ All required environment variables are set');
}
