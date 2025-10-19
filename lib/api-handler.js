import { NextResponse } from 'next/server';
import { ApiError } from './api-error';
import logger from './logger';

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred';

function serializeError(error) {
  if (!error) return undefined;

  return {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
  };
}

export function createApiHandler(handler, options = {}) {
  const { defaultMessage = DEFAULT_ERROR_MESSAGE, logMessage } = options;

  return async function apiHandler(request, context) {
    try {
      const response = await handler(request, context);
      return response;
    } catch (error) {
      const payload = serializeError(error);
      logger.error({ error: payload, url: request?.url }, logMessage ?? error.message ?? defaultMessage);

      if (error instanceof ApiError) {
        const message = error.expose ? error.message : defaultMessage;
        const body = { success: false, message };

        if (error.details) {
          body.details = error.details;
        }

        return NextResponse.json(body, { status: error.statusCode });
      }

      if (error?.name === 'ValidationError' && error?.errors) {
        const errors = Object.values(error.errors).map((err) => err?.message ?? String(err));
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: defaultMessage
        },
        { status: 500 }
      );
    }
  };
}

export default createApiHandler;
