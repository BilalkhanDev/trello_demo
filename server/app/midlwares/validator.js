const schemas = require('../validation/schema'); // Assuming schemas are in the schema.js file

const reqValidator = (schemaName, source = 'body') => {

  return (req, res, next) => {

    const schema = schemas[schemaName];
 
    if (!schema) {
      return res.status(400).json({ error: `Schema ${schemaName} not found` });
    }

    // Select the data source (body, query, or params)
    let data;
    switch (source) {
      case 'query':
        data = req.query;
        break;
      case 'params':
        data = req.params;
        break;
      case 'body':
      default:
        data = req.body;
        break;
    }

    // Validate data against the Joi schema
    const { error } = schema.validate(data, { abortEarly: false }); // abortEarly=false means all errors will be shown

    if (error) {
      // Re    console.log(schemaName, source)turn validation error messages as a list
        console.log(schemaName, source, error)
      const errorMessages = error.details.map(err => err.message);
      return res.status(400).json({ error: errorMessages });
    }

    next(); // Validation passed, move to the next middleware
  };
};

module.exports = reqValidator;
