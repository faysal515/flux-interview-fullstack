import * as Joi from '@hapi/joi'



// This is the JOI validation schema, you define
// all the validation logic in here, then run
// the validation during the request lifecycle.
// If you prefer to use your own way of validating the 
// incoming data, you can use it.

const packageSchema = Joi.object({
  lite: Joi.number().required(),
  standard: Joi.number().required(),
  unlimited:Joi.number().required()
})
const schema = Joi.object<import('../../types').Matrix>({
  '36months': packageSchema.required(),
  '24months': packageSchema.required(),
  '12months': packageSchema.required(),
  'mtm': packageSchema.required(),
}).strict()

export default async (req: import('next').NextApiRequest, res: import('next').NextApiResponse) => {
  try {
    
    // This will throw when the validation fails
    const data = await schema.validateAsync(req.body, {
      abortEarly: false
    })
    // as import('../../types').Matrix

    // Write the new matrix to public/pricing.json

    res.statusCode = 200
    res.json(data)
  } catch(e) {
    // if(e is Joi.ValidationError) console.log('yes')
    console.error(e)
    if(e.isJoi) {
      // Handle the validation error and return a proper response
      const stringError = e.details.map(er => er.message).join(' & ')
      res.statusCode = 422
      res.json({error: {message: stringError, meta: e}})
      return
    }

    res.statusCode = 500
    res.json({ error: 'Unknown Error' })
  }
}