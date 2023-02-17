import { options }  from './options/mariaDB.js'
import knex from 'knex'
const myKnex = knex(options)

myKnex.schema.createTable('productos', table => {
    table.increments('id').primary();
    table.string('nombre').notNullable();
    table.float('precio').notNullable();
    table.string('imagen').notNullable();

})
.then(() => console.log('table created'))
.catch((err) => {console.log(err); throw err})
.finally(() => {
    myKnex.destroy();
});



