const express = require('express');
const bodyParser = require('body-parser');
//const db = require('mssql');
const db = require('mssql/msnodesqlv8');
const dbConf = {
    driver: 'msnodesqlv8',
    server: 'localhost', //Using 'localhost' causes ODBC driver cannot connect on MacOS. Replace it with '127.0.0.1'
    //user: '<db user>',
    //password: '<db password>',
    database: 'ReactNodeTutorial',
    options: {
        trustedConnection: true, //set it to be 'true' to use 'Windows Authentication', otherwise we must provide 'user' and 'password'
    }
};

async function query() {
    try {
        await db.connect(dbConf);
        return await db.query.apply(db, arguments);
    } catch (err) {
        console.log(err);
        return false;
    }
}

function success(response, retValue) {
    response.type('json')
            .end( JSON.stringify(retValue) );
}

function error(response) {
    response.status(500)
            .type('text/plain')
            .end('error');
}

function notFound(response) {
    response.status(404)
            .type('text/plain')
            .end('Data not found');
}

const app = new express();
app.use(bodyParser.json());

app.get('/people', async function (req, res) {
    let result = await query('SELECT p.Id, p.Name, p.Age, p.Gender, LOWER(c.Code) CtrCode FROM Person p, Country c WHERE p.CountryId = c.Id ORDER BY p.Name');
    if (result === false) error(res);
    else success(res, result.recordset);
});

app.get('/person/:id', async function (req, res) {
    let result = await query`SELECT * FROM Person WHERE Id = ${req.params.id}`;
    if (result === false) error(res);
    else if (!result.recordset || !result.recordset[0]) notFound(res);
    else success(res, result.recordset[0]);
});

app.put('/person', async function (req, res) {
    let params = req.body;
    let id = new Date().getTime() + '';
    let result = await query`INSERT INTO Person (Name, Age, Gender, CountryId, Id) VALUES (${params.Name}, ${params.Age}, ${params.Gender}, ${params.CountryId}, ${id})`;
    if (result === false) error(res);
    else success(res, result.output);
});

app.post('/person', async function (req, res) {
    let params = req.body;
    let result = await query`UPDATE Person SET
            Name = ${params.Name},
            Age = ${params.Age},
            Gender = ${params.Gender}, 
            CountryId = ${params.CountryId} 
        WHERE Id = ${params.Id}`
    ;
    if (result === false) error(res);
    else success(res, result.output);
});

app.delete('/person/:id', async function (req, res) {
    let result = await query`DELETE FROM Person WHERE Id = ${req.params.id}`;
    if (result === false) error(res);
    else success(res, result.output);
});

app.get('/countries', async function (req, res) {
    let result = await query('SELECT Id, Name FROM Country');
    if (result === false) error(res);
    else success(res, result.recordset);
});

const server = app.listen(7777, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Server listening at http://%s:%s", host, port)
 });