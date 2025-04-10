import { Hono } from 'hono';

const packages = new Hono();

packages.get('/', async (c) => {    
  const sql = c.env.SQL;
  let query = sql` SELECT package_id, name, price, allocation_policy_id, overuse_policy_id
    FROM packages ORDER BY package_id`;
  const results = await query;    
  const json = Response.json({
    data: results,
    source: "database",
  })  
  return json;
});

export default packages;
