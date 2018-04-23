const {dialog} = require('electron')
exports.openDialog = function (defaultpath, callback) {
<<<<<<< HEAD
    console.log(defaultpath)
}
dialog.showOpenDialog({
    defaultPath: defaultpath,
    properties: [
        'openFile',
    ],
    filters: [
        {name: 'All', extensions: ['*']},
    ]
}, function (res) {
    callback(res[0]) //我这个是打开单个文件的
=======
  console.log(defaultpath)
}
dialog.showOpenDialog({
  defaultPath: defaultpath,
  properties: [
    'openFile',
  ],
  filters: [
    {name: 'All', extensions: ['*']},
  ]
}, function (res) {
  callback(res[0]) //我这个是打开单个文件的
>>>>>>> 20064092c62648c8a00f3d668edd4705df126d46
})