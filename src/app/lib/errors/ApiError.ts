export class ApiError extends Error {
    constructor(
      public statusCode: number,
      message: string,
      public code?: string,
      public details?: any
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }
  
  export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
      return Response.json(
        {
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }
  
    console.error('Unhandled error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }