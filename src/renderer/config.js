const IS_DEV = process.env.NODE_ENV !== 'production';

export const API_ROOT = IS_DEV ? 'http://localhost:8001/nuls' : 'http://localhost:8001/nuls';
export const uploadUrl = 'https://pan.baidu.com/s/114vdfDBZJAMOHQTUlnhQpA#list/path=%2Fnuls/';

/*
function jarHomePath() {
    let jarPath = "";
    switch (os.type()) {
        case "Darwin": {
            // macOS
            if (IS_DEV) {
                path = require('path').join(__dirname, '/java');
                console.log(path)
            } else {

            }
        }
        break;
        case "Windows_NT": {
            // Windows
            if (IS_DEV) {

            } else {

            }
        }
        break;
    }
    return jarPath
}*/
