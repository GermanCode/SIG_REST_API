var express = require('express');
var router = express.Router();

var pg = require('pg');

pg.defaults.ssl = true;
var conString = process.env.DATABASE_URL || "postgres://tiwntpmqhwcvbn:8a_RhEeMB-5aZXog4UXcHP0TpO@ec2-50-16-218-45.compute-1.amazonaws.com:5432/dbttmr3g8d7ntq"; // Cadena de conexión a la base de datos

// Set up your database query to display GeoJSON
var coffee_query = 'SELECT row_to_json(fc) FROM (	SELECT array_to_json(array_agg(f)) As features FROM (	SELECT ST_AsGeoJSON(lg.geom)::json As geometry,	row_to_json((gid, name)) As properties FROM public."reservas_putumayo" As lg) As f) As fc';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Reservas Putumayo'
  }
  );
});

router.get('/mapa', function (req, res, next) {
  res.render('mapa', {
    title: 'Reservas Putumayo'
  }
  );
});

/* GET Postgres JSON data */
router.get('/data', function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query(coffee_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    res.json(result.rows[0].row_to_json);
    res.end();
  });
});

/* GET Tabla */
router.get('/tabla', function (req, res) {
  var client = new pg.Client(conString);
  client.connect();
  var query = client.query(coffee_query);
  query.on("row", function (row, result) {
    result.addRow(row);
  });
  query.on("end", function (result) {
    res.render('tabla', {
      title: 'Tabla de datos',
      datos: result.rows
    });
  });
});

module.exports = router;
