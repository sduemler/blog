import type {Config, Context} from '@netlify/edge-functions'
export default async (request : Request, context : Context) => {
  const response = await context.next()
  return new Response(response.body, {
    headers: {
       'access-control-allow-origin': '*'
    }
  })
}
export const config : Config = {
  path: '/*'
}