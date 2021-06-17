const express = require('express');
const bodyParser = require('body-parser');
//const db = require('mssql');
const db = require('mssql/msnodesqlv8');
const dbConf = {
    driver: 'msnodesqlv8',
    server: 'localhost',
    //user: '<db user>',
    //password: '<db password>',
    database: 'ReactNodeTutorial',
    options: {
        enableArithAbort: true,
        trustedConnection: true
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
    let result = await query('SELECT p.Id, p.Name, p.Age, p.Sex, LOWER(c.Code) CtrCode FROM Person p, Country c where p.CountryId = c.Id');
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
    let result = await query`INSERT INTO Person (Name, Age, Sex, CountryId, Id) VALUES (${params.Name}, ${params.Age}, ${params.Sex}, ${params.CountryId}, ${id})`;
    if (result === false) error(res);
    else success(res, result.output);
});

app.post('/person', async function (req, res) {
    let params = req.body;
    let result = await query`UPDATE Person SET
            Name = ${params.Name},
            Age = ${params.Age},
            Sex = ${params.Sex}, 
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