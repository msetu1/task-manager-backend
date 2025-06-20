import mongoose from 'mongoose';
import { TErrorSource, TGenericErrorResponse } from './error';

const handleValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericErrorResponse => {
  const errorSources: TErrorSource = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path || 'Unknown Path', // Ensure 'path' has a fallback
        message: val?.message || 'Validation Error', // Fallback for message
      };
    },
  );

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValidationError;
