import { Hono } from 'hono';

const packages = new Hono();

packages.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT package_id, name, price, allocation_policy_id FROM packages ORDER BY package_id",
  ).all();

  return Response.json({
    data: results,
    source: "database",
  });
});

packages.get('/:id', async (c) => {
  const package_id = c.req.param("id");  
  const { results } = await c.env.DB.prepare(
    "SELECT package_id, name, price, allocation_policy_id FROM packages where package_id = ?"
  )
  .bind(package_id)
  .all()

  return Response.json({
    data: results,
    source: "database",
  });
});

packages.post('/', async (c) => {  
  const { name, price, allocation_policy_id } = await c.req.json();

  const info = await c.env.DB.prepare(
    "INSERT INTO packages (name, price, allocation_policy_id) VALUES ?1, ?2, ?3)"
  )
  .bind(name, price, allocation_policy_id)
  .run()  
  console.log("insert package", info)

  return Response.json({ success: true, message: "Đã tạo gói cước mới." });
});

packages.put('/:id', async (c) => {  
  const id = c.req.param('id');
  const { name, price, allocation_policy_id } = await c.req.json();

  const info = await c.env.DB.prepare(
    "UPDATE packages SET name = ?1, price = ?2, allocation_policy_id = ?3  WHERE package_id = ?4")
  .bind(name, price, allocation_policy_id, id)

  console.log("update package", info)

  return Response.json({ success: true, message: "Đã cập nhật gói cước." });
});


export default packages;
