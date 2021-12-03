const { Pool } = require('pg');

//se crea la configuracion de la conexion
const pool = new Pool({
  user: 'postgres',
  host: '',
  database: 'sic',
  password: 'sunamiboy3007',
  port: 5432,
});

//gets
const getRubros = async (req, res) => {
  const query = 'SELECT * FROM rubro';
  const respuesta = await pool.query(query);
  res.status(200).json(respuesta.rows);
};

const getRubrosById = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM rubro WHERE id_rubro=$1';
  const respuesta = await pool.query(query, [id]);
  res.json(respuesta.rows);
};

const getCuentas = async (req, res) => {
  const query =
    'select rb.rb_nombre rubro,* from cuenta c join rubro rb on(c.id_rubro=rb.id_rubro) order by cast(codigo as varchar) asc';
  const respuesta = await pool.query(query);
  res.status(200).json(respuesta.rows);
};

const getPartidas = async (req, res) => {
  const query = 'SELECT * FROM partida';
  const respuesta = await pool.query(query);
  res.status(200).json(respuesta.rows);
};

const getMovimientos = async (req, res) => {
  const query =
    'SELECT id_movimiento,id_partida,c.nombre as cuenta,debe,haber,descripcion_movimiento,saldo FROM movimiento m JOIN cuenta c on(m.codigo=c.codigo)';
  const respuesta = await pool.query(query);
  res.status(200).json(respuesta.rows);
};
const getMovimientosByPartida = async (req, res) => {
  const id = req.params.id;
  const query =
    'SELECT id_movimiento,id_partida,c.nombre as cuenta,debe,haber,descripcion_movimiento,saldo FROM movimiento m JOIN cuenta c on(m.codigo=c.codigo) where id_partida=$1';
  const respuesta = await pool.query(query, [id]);
  res.status(200).json(respuesta.rows);
};

const getCuentasById = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM cuenta WHERE id_cuenta=$1';
  const respuesta = await pool.query(query, [id]);
  res.json(respuesta.rows);
};

const getNombreCuentas = async (req, res) => {
  const query = `SELECT codigo as value, nombre as label FROM cuenta where movimiento='Si'`;
  const respuesta = await pool.query(query);
  res.json(respuesta.rows);
};

const getPartidasById = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM partida WHERE id_partida=$1';
  const respuesta = await pool.query(query, [id]);
  res.json(respuesta.rows);
};

const getCuentasByRubro = async (req, res) => {
  const id = req.params.id;
  const query =
    'SELECT rb.nombre rubro, * FROM cuenta c JOIN rubro rb on (c.id_rubro=rb.id_rubro) WHERE id_cuenta=$1';
  const respuesta = await pool.query(query, [id]);
  res.json(respuesta.rows);
};

const getGeneral = async (req, res) => {
  const query = `WITH recursive TTTODO AS (SELECT cuentas.codigo, cuentas.codigo_padre , cuentas.nivel ,cuentas.nombre , importes.saldo FROM cuenta cuentas LEFT JOIN movimiento importes ON cuentas.codigo = importes.codigo ), TTRECURSIVO( codigo, codigo_padre, nivel,nombre, saldo ) AS (SELECT codigo, codigo_padre, nivel,nombre,sum(saldo) FROM TTTODO WHERE saldo IS NOT NULL group by codigo, codigo_padre, nivel,nombre,saldo UNION ALL SELECT actual.codigo, actual.codigo_padre, actual.nivel, actual.nombre,anterior.saldo FROM TTTODO actual JOIN TTRECURSIVO anterior ON anterior.codigo_padre  = actual.codigo ) SELECT codigo_padre,codigo, nivel, nombre, SUM( saldo ) saldo FROM TTRECURSIVO where cast(codigo as varchar) LIKE '1%' or cast(codigo as varchar) LIKE '2%' or cast(codigo as varchar) LIKE '3%' GROUP BY codigo_padre,codigo, nivel,nombre ORDER BY cast(codigo as varchar) asc

    `;

  const respuesta = await pool.query(query);
  res.json(respuesta.rows);
};

//posts
const createCuenta = async (req, res) => {
  const {
    codigo,
    codigo_padre,
    descripcion,
    id_rubro,
    nivel,
    nivel_padre,
    nombre,
    saldo_cuenta,
    tipo_cuenta,
  } = req.body;
  const query =
    'INSERT INTO cuenta (codigo,codigo_padre,descripcion,id_rubro,nivel,nivel_padre,nombre,saldo_cuenta,tipo_cuenta) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *';
  try {
    const respuesta = await pool.query(query, [
      codigo,
      codigo_padre,
      descripcion,
      id_rubro,
      nivel,
      nivel_padre,
      nombre,
      saldo_cuenta,
      tipo_cuenta,
    ]);
    res.send('Cuenta created');
  } catch (error) {
    res.send(
      'Nombre o codigo de la cuenta esta repetido, vuelva a ingresar nombre o codigo'
    );
  }
};

const createPartida = async (req, res) => {
  const { descripcion_partida, fecha, tipo } = req.body;
  const query =
    'INSERT INTO partida (descripcion_partida,fecha,tipo) VALUES($1,$2,$3) RETURNING *';
  try {
    const respuesta = await pool.query(query, [
      descripcion_partida,
      fecha,
      tipo,
    ]);
    res.send('Partida creada');
  } catch (error) {
    res.send(error);
  }
};
const createMovimiento = async (req, res) => {
  const { id_partida, codigo, debe, descripcion_movimiento, haber, saldo } =
    req.body;
  const query =
    'INSERT INTO movimiento (id_partida,codigo,debe,descripcion_movimiento,haber,saldo) VALUES($1,$2,$3,$4,$5,$6) RETURNING *';
  const respuesta = await pool.query(query, [
    id_partida,
    codigo,
    debe,
    descripcion_movimiento,
    haber,
    saldo,
  ]);
  res.send('Movimiento creado');
};

const createRubro = async (req, res) => {
  const { nombre } = req.body;
  const respuesta = await pool.query('INSERT INTO rubro (nombre) VALUES($1)', [
    nombre,
  ]);
  res.send('Rubro created');
};

//updates
const updateRubro = async (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;
  const respuesta = await pool.query(
    'UPDATE rubro SET nombre =$1 WHERE id_rubro=$2',
    [nombre, id]
  );
  console.log(respuesta);
  res.json(`Rubro ${id} Update successfully`);
};
const updateCuenta = async (req, res) => {
  const id = req.params.id;
  const query =
    'UPDATE cuenta SET (codigo,codigo_padre,descripcion,movimiento,id_rubro,nivel,nivel_padre,nombre,saldo_cuenta,tipo_cuenta) =($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) WHERE id_cuenta=$11';
  const {
    codigo,
    codigo_padre,
    descripcion,
    movimiento,
    id_rubro,
    nivel,
    nivel_padre,
    nombre,
    saldo_cuenta,
    tipo_cuenta,
  } = req.body;
  const respuesta = await pool.query(query, [
    codigo,
    codigo_padre,
    descripcion,
    movimiento,
    id_rubro,
    nivel,
    nivel_padre,
    nombre,
    saldo_cuenta,
    tipo_cuenta,
    id,
  ]);
  console.log(respuesta);
  res.json(`Cuenta ${id} Update successfully`);
};
const updatePartida = async (req, res) => {
  const id = req.params.id;
  const query =
    'UPDATE partida SET (descripcion_partida,fecha,tipo) =($1,$2,$3) WHERE id_partida=$4';
  const { descripcion_partida, fecha, tipo } = req.body;
  const respuesta = await pool.query(query, [
    descripcion_partida,
    fecha,
    tipo,
    id,
  ]);
  console.log(respuesta);
  res.json(`Partida ${id} Update successfully`);
};
const updateMovimiento = async (req, res) => {
  const id = req.params.id;
  const query =
    'UPDATE movimiento SET (id_partida,codigo,debe,descripcion_movimiento,haber,saldo) = ($1,$2,$3,$4,$5,$6) WHERE id_movimiento=$7';
  const { id_partida, codigo, debe, descripcion_movimiento, haber, saldo } =
    req.body;
  const respuesta = await pool.query(query, [
    id_partida,
    codigo,
    debe,
    descripcion_movimiento,
    haber,
    saldo,
    id,
  ]);
  console.log(respuesta);
  res.json(`Movimiento ${id} Update successfully`);
};

//deletes
const deteleRubro = async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM rubro WHERE id_rubro=$1';
  const respuesta = await pool.query(query, [id]);
  console.log(respuesta);
  res.json(`Rubro ${id} deleted successfully`);
};
const deteleCuenta = async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM cuenta WHERE id_cuenta=$1';
  try {
    const respuesta = await pool.query(query, [id]);
    console.log(respuesta);
    res.json(`Cuenta ${id} eliminada correctamente`);
  } catch (error) {
    res.send(
      'No se puede eliminar la cuenta, antes se deben de eliminar los movimientos asociados a la cuenta'
    );
  }
};
const detelePartida = async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM partida WHERE id_partida=$1';
  try {
    const respuesta = await pool.query(query, [id]);
    console.log(respuesta);
    res.send(`Partida ${id} eliminada correctamente`);
  } catch (error) {
    res.send(
      'No se puede eliminar la partida, antes se deben de eliminar los movimientos asociados a la partida'
    );
  }
};
const deteleMovimiento = async (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM movimiento WHERE id_movimiento=$1';
  try {
    const respuesta = await pool.query(query, [id]);
    res.send(`Movimiento ${id} eliminado correctamente`);
  } catch (error) {
    res.send('Hubo un problema con la eliminacion');
  }
};

module.exports = {
  //gets
  getRubros,
  getRubrosById,
  getCuentas,
  getNombreCuentas,
  getPartidas,
  getMovimientos,
  getCuentasById,
  getPartidasById,
  getCuentasByRubro,
  getMovimientosByPartida,
  getGeneral,

  //post
  createRubro,
  createCuenta,
  createPartida,
  createMovimiento,

  //updates
  updateRubro,
  updateCuenta,
  updateMovimiento,
  updatePartida,

  //deletes
  deteleRubro,
  deteleCuenta,
  deteleMovimiento,
  detelePartida,
};
