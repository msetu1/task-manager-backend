import { ZodError, ZodIssue } from 'zod';
import { TErrorSource, TGenericErrorResponse } from './error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSource = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1] || 'Unknown Path', // Ensure 'path' has a fallback
      message: issue.message || 'Validation Error', // Fallback for message
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;
