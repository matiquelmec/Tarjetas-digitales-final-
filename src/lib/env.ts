// Environment variable configuration with build-time safety

export const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined' && !process.env.NETLIFY_BUILD_ID;
export const isNetlifyBuild = !!process.env.NETLIFY_BUILD_ID;

// Safe environment variable getter
export function getEnvVar(name: string, fallback: string = ''): string {
  const value = process.env[name];
  
  if (!value) {
    if (isBuildTime || isNetlifyBuild) {
      console.warn(`⚠️ Environment variable ${name} not found during build, using fallback`);
      return fallback;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.warn(`⚠️ Missing environment variable: ${name}`);
    }
  }
  
  return value || fallback;
}

// Required environment variables with safe fallbacks
export const env = {
  GOOGLE_CLIENT_ID: getEnvVar('GOOGLE_CLIENT_ID', 'build-time-placeholder'),
  GOOGLE_CLIENT_SECRET: getEnvVar('GOOGLE_CLIENT_SECRET', 'build-time-placeholder'),
  NEXTAUTH_SECRET: getEnvVar('NEXTAUTH_SECRET', 'build-time-secret-placeholder'),
  NEXTAUTH_URL: getEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  DATABASE_URL: getEnvVar('DATABASE_URL', 'postgresql://placeholder'),
  NODE_ENV: process.env.NODE_ENV || 'development',
};

// Runtime validation (only runs when actually needed)
export function validateRuntimeEnvironment(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const requiredVars = {
    GOOGLE_CLIENT_ID: env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_SECRET: env.NEXTAUTH_SECRET,
    DATABASE_URL: env.DATABASE_URL,
  };
  
  for (const [name, value] of Object.entries(requiredVars)) {
    if (!value || value.includes('placeholder') || value.includes('build-time')) {
      errors.push(`${name} is not properly configured`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}