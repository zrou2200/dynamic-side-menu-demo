import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

export async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SERVICE}`
  });
}
