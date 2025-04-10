import { Hono } from 'hono';

const overuse = new Hono();

overuse.get('/', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT d.id, p.name AS policy, d.account_type, d.price_per_unit
    FROM overuse_policy_details d
    JOIN overuse_policies p ON d.policy_id = p.id
    ORDER BY d.id
  `).all();

  return c.json(result.results);
});

export default overuse;
