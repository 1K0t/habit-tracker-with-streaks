/**
 * Validates that all required NEXT_PUBLIC_* environment variables are set.
 * Runs at build time and when components initialize.
 */
export function validateEnvironment(): string[] {
  const requiredPublicVars = ['NEXT_PUBLIC_API_URL', 'NEXT_PUBLIC_WS_URL'];

  const missingVars: string[] = [];

  for (const varName of requiredPublicVars) {
    const value = process.env[varName];
    if (!value || value.trim() === '') {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(', ')}. Check your .env.local file.`;
    console.error('❌ [Environment Validation]', errorMessage);
    // In production, this would prevent the app from loading
    if (typeof window === 'undefined') {
      // Server-side: throw to prevent build
      throw new Error(errorMessage);
    }
  }

  if (missingVars.length === 0) {
    console.debug('✓ All required environment variables are configured');
  }

  return missingVars;
}
