export default async (request, context) => {
  const response = await context.next();

  // You need this if you are calling this from the browser
  // to handle CORS preflight stuff
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  response.headers.set('Access-Control-Allow-Origin', '*');
  return response;
};
