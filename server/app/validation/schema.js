const Joi = require('joi');
const mongoose = require('mongoose');
const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message(`"${value}" is not a valid ObjectId`);
  }
  return value;
};
// Register Schema
const registerSchema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username can be up to 30 characters long',
      'string.empty': 'Username is required',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
    }),

  confirmPassword: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Confirm password must be at least 6 characters long',
      'string.empty': 'Confirm password is required',
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email address',
      'string.empty': 'Email is required',
    }),

})
  .custom((value, helper) => {
    if (value.password !== value.confirmPassword) {
      return helper.message("Passwords don't match");
    }
    return value;
  });

// Login Schema
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Invalid email address',
      'string.empty': 'Email is required',
    }),

  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.empty': 'Password is required',
    }),

 
})
  

// user data
const userSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1',
      'any.required': 'Page is required',
    }),

  limit: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'any.required': 'Limit is required',
    }),
});
  const singleUserSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'User ID must be a string',
      'string.empty': 'User ID is required',
      'any.required': 'User ID is required',
    }),
   });

   const boardValidationSchema = Joi.object({
    title: Joi.string().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
   description: Joi.string().allow(''),
   members: Joi.array().items(
    Joi.string().custom(objectId).messages({
      'string.base': 'Each member ID must be a valid string'
    })
  ),
   tickets: Joi.array().items(
    Joi.string().custom(objectId).messages({
      'string.base': 'Each ticket ID must be a valid string'
    })
  )
})
 const singleBoardschema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'ID must be a string',
      'string.empty': 'ID is required',
      'any.required': 'ID is required',
    }),
   });

   //
   const createTicketBodySchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  description: Joi.string().allow(''),
  status: Joi.number().valid(0, 1, 2).optional(),
  assignedTo: Joi.alternatives().try(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/), // valid MongoDB ObjectId
    Joi.string().valid('').allow(''),        // allow empty string
    Joi.allow(null)                          // allow null explicitly
  ).optional(),
  dueDate: Joi.date().optional(),
  priority: Joi.number().valid(0, 1, 2).optional(),
  order: Joi.number().optional()
});

// Validate params (boardId in URL like /create/:boardId)
const createTicketParamSchema = Joi.object({
  boardId: Joi.string().required().messages({
    'string.base': 'Board ID must be a string',
    'string.empty': 'Board ID is required',
    'any.required': 'Board ID is required'
  })
});
const getTicketsSchema = Joi.object({
  boardId: Joi.string().required().messages({
    'string.base': 'Board ID must be a string',
    'string.empty': 'Board ID is required',
    'any.required': 'Board ID is required'
  }),
 
});

const updateTicketsSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow('', null),
  status: Joi.number().valid(0, 1, 2).required(),
  assignedTo: Joi.alternatives().try(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/), // valid MongoDB ObjectId
    Joi.string().valid('').allow(''),        // allow empty string
    Joi.allow(null)                          // allow null explicitly
  ).optional(),
  dueDate: Joi.date().optional(),
  priority: Joi.number().valid(0, 1, 2).required(),
  order: Joi.number().default(0),
  comments: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      commentedBy: Joi.string().required(),
      commentedAt: Joi.date()
    })
  ).optional()
 
});

const updateTicketStatus=Joi.object({
  title: Joi.string(),
  description: Joi.string().allow('', null),
  status: Joi.number().valid(0, 1, 2),
  dueDate: Joi.date(),
  priority: Joi.number().valid(0, 1, 2),
  order: Joi.number().default(0),
  comments: Joi.array().items(
    Joi.object({
      text: Joi.string().required(),
      commentedBy: Joi.string().required(),
      commentedAt: Joi.date()
    })
  ).optional(),
  // Explicitly disallow these fields
  board: Joi.forbidden(),
  assignedTo: Joi.forbidden()
});

module.exports = { 
  registerSchema, 
  loginSchema ,
  userSchema,
  singleUserSchema,
  boardValidationSchema,
  singleBoardschema ,
  createTicketBodySchema,
  createTicketParamSchema,
  getTicketsSchema,
  updateTicketStatus,
  updateTicketsSchema

};
