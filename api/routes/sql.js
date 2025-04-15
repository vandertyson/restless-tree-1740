import { Hono } from 'hono';

const sqlExecutor = new Hono();

sqlExecutor.post('/query', async (c) => {
  try {
    const {query} = await c.req.json();

    const {results} = await c.env.DB.prepare(query).all()
    console.log("run query", query, results) 

    return Response.json(results);  
  } catch (error) {
    console.log("Error query sql")
    console.trace(error)
    throw error
  }  
});

sqlExecutor.post('/mutate', async (c) => { 
  try {
    const {query} = await c.req.json();
  
    const info = await c.env.DB.prepare(query).run()
    console.log("run mutate", query, info) 
  
    return Response.json(info);    
  } catch (error) {
    console.log("Error mutate sql")
    console.trace(error)
    throw error
  }
});

export default sqlExecutor;
