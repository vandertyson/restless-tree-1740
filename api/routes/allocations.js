import { Hono } from 'hono';

const allocations = new Hono();

allocations.get('/', async (c) => {
  const result = await c.env.DB.prepare(`
    SELECT d.id, p.name AS policy, d.account_type, d.amount
    FROM allocation_policy_details d
    JOIN allocation_policies p ON d.policy_id = p.id
    ORDER BY d.id
  `).all();

  return c.json(result.results);
});

export default allocations;
