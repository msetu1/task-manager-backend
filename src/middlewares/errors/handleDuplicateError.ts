import { TErrorSource, TGenericErrorResponse } from './error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleDuplicateError = (error: any): TGenericErrorResponse => {
  const match = error.message.match(/"([^"]*)"/);

  const extractedMsg = match ? match[1] : 'Unknown ID'; // Ensure we have a valid message

  const errorSources: TErrorSource = [
    {
      path: '', // You might want to set a more specific path
      message: `${extractedMsg} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate Entry Error', // More specific error message
    errorSources,
  };
};

export default handleDuplicateError;
