const DatabaseTableSchema = require('./database.json');

const sqlite = require('better-sqlite3');
const Database = new sqlite('./database/database.sqlite');

module.exports = {
    Prepare: function(tableName) {
        var tableArrString = [];
        var tableArr = DatabaseTableSchema[`${tableName}`];
    
        for(let i = 0; i < tableArr.length; i++) {
            tableArrString.push(`${tableArr[i].name} ${tableArr[i].type}`);
        }
    
        const Table = Database.prepare(`SELECT count(*) FROM sqlite_master WHERE type = 'table' AND name = '${tableName}';`).get();
    
        if(!Table['count(*)']) {        
            Database.prepare(`CREATE TABLE ${tableName} (${tableArrString.join(', ')});`).run();
            Database.pragma("synchronous = 1");
            Database.pragma("journal_mode = wal");
        }

        console.log(FirstCharUpperCase(tableName) + " database is ready!");
        return Table;
    },
    
    GetDataFromTable: function(tableName, id) {
        var tableData = Database.prepare(`SELECT * FROM ${tableName} WHERE id = ? ;`).get(id);
        if(!tableData) tableData = GetCurrencyObjectTemplate(id);
        SetDataForTable(tableName, tableData);
        return tableData;
    },
    
    SetDataForTable: function(tableName, data) {
        var names = GetObjectValueFromArray(tableArr, "name");
        var tableArr = DatabaseTableSchema[`${tableName}`];
        return Database.prepare(`INSERT OR REPLACE INTO ${tableName} (${names.join(', ')}) VALUES (@${names.join(', @')});`).run(data);
    },
    
    DeleteDataFromTable: function(tableName, id) {
        return Database.prepare(`delete FROM ${tableName} WHERE id = ? ;`).run(id);
    },

    GetPostTemplate: function(id) {
        return {
            id: id,
            title: '',
            title_desc: '',
            post_text: '',
            embed_linK: '',
            date: ''
        };
    }
};

function FirstCharUpperCase(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function GetObjectValueFromArray(array, value) {
    var values = [];
    for(let i = 0; i < array.length; i++) {
        values.push(array[i][`${value}`]);
    }
    return values;
}