import Joi from 'joi';

export const VALIDATION_ERROR_TYPES = [Joi.ValidationError];

interface FormattedError {
  field: string;
  message: string;
}

export const formatValidationErrors = (err: Joi.ValidationError): FormattedError[] => {
  let details: Joi.ValidationErrorItem[];

  if (err instanceof Joi.ValidationError) {
    details = err.details;
  } else {
    return [];
  }

  return details.map((detail): FormattedError => {
    const path = 'path' in detail ? detail.path : [];
    const pathArray = Array.isArray(path) ? path : [path];
    return {
      field: pathArray.join('.'),
      message: detail.message.replace(/"/g, ''),
    };
  });
};
