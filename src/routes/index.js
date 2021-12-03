const { Router } = require('express');
const router = Router();
const {
  //gets
  getRubros,
  getRubrosById,
  getCuentas,
  getPartidas,
  getMovimientos,
  getNombreCuentas,
  getCuentasById,
  getPartidasById,
  getCuentasByRubro,
  getMovimientosByPartida,
  getGeneral,
  //posts
  createCuenta,
  createPartida,
  createRubro,
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
} = require('../controllers/index.controller');

router.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'OPTIONS,POST,GET,PUT,DELETE');
  next();
});
//gets
router.get('/cuentas', getCuentas);
router.get('/cuentas/nombre', getNombreCuentas);
router.get('/partidas', getPartidas);
router.get('/movimientos', getMovimientos);
router.get('/rubros', getRubros);
router.get('/cuentas/:id', getCuentasById);
router.get('/partidas/:id', getPartidasById);
router.get('/rubros/:id', getRubrosById);
router.get('/cuentas/rubros/:id', getCuentasByRubro);
router.get('/movimientos/:id', getMovimientosByPartida);
router.get('/general', getGeneral);

//posts
router.post('/cuentas', createCuenta);
router.post('/partidas', createPartida);
router.post('/rubros', createRubro);
router.post('/movimientos', createMovimiento);
router.post('/partidas', createPartida);

//deletes
router.delete('/rubros/:id', deteleRubro);
router.delete('/cuentas/:id', deteleCuenta);
router.delete('/movimientos/:id', deteleMovimiento);
router.delete('/partidas/:id', detelePartida);

//updates
router.put('/rubros/:id', updateRubro);
router.put('/cuentas/:id', updateCuenta);
router.put('/movimientos/:id', updateMovimiento);
router.put('/partidas/:id', updatePartida);

module.exports = router;
