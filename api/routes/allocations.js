import { Hono } from 'hono';

const allocations = new Hono();

allocations.get('/', async (c) => {  
  const {results} = await c.env.DB.prepare(`
    SELECT m.allocation_policy_id, m.name, p.name as account, d.amount, p.unit
    FROM allocation_policy_details d
    JOIN allocation_policies m ON m.allocation_policy_id = d.allocation_policy_id
    JOIN account_types p ON d.account_type_id = p.account_type_id
    ORDER BY m.allocation_policy_id
  `).all()

  return Response.json({ data: results, source: "database" });
});

// POST, PUT, DELETE tương tự nếu cần mở rộng
export default allocations;
