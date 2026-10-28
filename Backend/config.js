export const PORT = process.env.PORT || 8000;

// ===== MySQL (relational SQL database) =====
// Local dev uses the defaults below.
// When deploying on AWS (RDS or MySQL on EC2), set these env vars instead, e.g.:
//   $env:DB_HOST="mydb.xxxxx.ap-southeast-1.rds.amazonaws.com"
//   $env:DB_USER="admin"
//   $env:DB_PASSWORD="yourpassword"
//   $env:DB_NAME="lostitems"
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "lostitems",
};
