import pg from "pg"
import env from "dotenv" 



//to start the env server
env.config();



const pool=new pg.Pool({
    user:process.env.PG_USER,
    host:process.env.PG_HOST, 
    database:process.env.PG_DATABASE, 
    password:process.env.PG_PASSWORD, 
    port:process.env.PG_PORT, 

})
pool.on('connect', () => {
    console.log('Connected to the db successfully');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export default pool;