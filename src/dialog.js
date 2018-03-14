const {dialog} = require("electron");
exports.openDialog = function(defaultpath,callback){
    console.log(defaultpath);
}
    dialog.showOpenDialog({
        defaultPath :defaultpath,
        properties: [
            'openFile',
        ],
        filters: [
            { name: 'All, extensions: ['*'] },
        ]
    },function(res){
        callback(res[0]) //我这个是打开单个文件的
    })
}