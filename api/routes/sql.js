import { Hono } from 'hono';

const sqlExecutor = new Hono();

sqlExecutor.post('/query', async (c) => {  
  const {query} = await c.req.json();

  const {results} = await c.env.DB.prepare(query).all()
  console.log("run query", query, results) 

  return Response.json(results);
});

sqlExecutor.post('/mutate', async (c) => { 
    const {query} = await c.req.json();
  
    const info = await c.env.DB.prepare(query).run()
    console.log("run mutate", query, info) 
  
    return Response.json(info);
  });

export default sqlExecutor;
