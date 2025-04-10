import { Hono } from 'hono';

const accounts = new Hono();

accounts.get('/', async (c) => {  
  const {results} = await c.env.DB.prepare("SELECT * FROM account_types ORDER BY account_type_id").all();

  return Response.json({ data: results, source: "database" });
});

accounts.get('/:id', async (c) => {  
  const account_id = c.req.param("id");
  const {results} = await c.env.DB.prepare("SELECT * FROM account_types where account_type_id = ?").bind(account_id).all()

  return Response.json({ data: results, source: "database" });
});


accounts.post('/', async (c) => {
  const sql = c.env.SQL;
  const { code, name, unit } = await c.req.json();

  const info = await c.env.DB.prepare("INSERT INTO account_types (code, name, unit) VALUES ?1, ?2, ?3")
  .bind(code, name, unit)
  .run()

  console.log("insert account", info)
  
  return Response.json({ success: true });
});

accounts.put('/:id', async (c) => {  
  const id = c.req.param('id');
  const { code, name, unit } = await c.req.json();

  const info = c.env.DB.prepare(`
    UPDATE account_types
    SET code = ?1, name = ?2, unit = ?3
    WHERE account_type_id = ?4
  `)
  .bind(code, name, unit, id)
  .run()

  console.log("update account", info)

  return Response.json({ success: true });
});

accounts.delete('/:id', async (c) => {  
  const id = c.req.param('id');
  const info = await c.env.DB.prepare(`DELETE FROM accounts WHERE account_type_id = ?`)
  .bind(id)
  .run()
  console.log("delete account", info)
  return Response.json({ success: true });
});

export default accounts;
