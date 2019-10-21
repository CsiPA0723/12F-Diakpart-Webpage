const DatabaseTableSchema = require('./database.json');

const fs = require('fs');

const postIds = require('./database/ids.json');

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
        return tableData;
    },
    
    SetDataForTable: function(tableName, data) {
        var tableArr = DatabaseTableSchema[`${tableName}`];
        var names = GetObjectValueFromArray(tableArr, "name");
        if(data && data.id && !this.GetDataFromTable(tableName, data.id)) {
            postIds.push(data.id);
            fs.writeFileSync("./database/ids.json", JSON.stringify(postIds, null, 4), err => { if(err) throw err; });
        }
        return Database.prepare(`INSERT OR REPLACE INTO ${tableName} (${names.join(', ')}) VALUES (@${names.join(', @')});`).run(data);
    },
    
    DeleteDataFromTable: function(tableName, id) {
        console.log("postIds", postIds);
        var index = postIds.indexOf(parseInt(id));
        console.log("index", index);
        if(index != -1) postIds.splice(parseInt(index), 1);
        console.log("postIds", postIds);
        fs.writeFileSync("./database/ids.json", JSON.stringify(postIds, null, 4), err => { if(err) throw err; });
        return Database.prepare(`delete FROM ${tableName} WHERE id = ? ;`).run(id);
    },

    GetPostTemplate: function(id) {
        if(!id) id = this.GetLastAvaiableId();
        return {
            id: id,
            title: '',
            title_desc: '',
            post_text: '',
            date: ''
        };
    },

    GetFirstId: function() {
        return parseInt(postIds[0]);
    },

    GetLastAvaiableId: function() {
        return parseInt(postIds[postIds.length - 1]) + 1;
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