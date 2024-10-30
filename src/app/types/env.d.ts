declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
      MONGODB_URI: string;
      RESEND_API_KEY: string;
      NODE_ENV: 'development' | 'production' | 'test';      
    }
}