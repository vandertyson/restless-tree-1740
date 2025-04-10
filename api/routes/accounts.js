import { Hono } from 'hono';

const accounts = new Hono();

accounts.get('/', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT * FROM accounts ORDER BY id
  `).all();

  return c.json(result.results);
});

export default accounts;
