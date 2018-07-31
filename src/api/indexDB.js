/**
 * 创建indexDB 数据库
 * @param params
 */
export function setDB(DB) {
  //console.log(DB);
  if (!window.indexedDB) {
    window.alert("sorry IndexDB");
  }
  let request = indexedDB.open(DB.db_name, DB.db_version);
  request.onerror = function (event) {
    alert("err: " + event);
  };
  request.onupgradeneeded = function (event) {
    this.db = event.target.result;
    if (!this.db.objectStoreNames.contains(DB.db_store_name)) {
      this.db.createObjectStore(DB.db_store_name);
    }
  };
  request.onsuccess = function (event) {
    this.db = event.target.result;
  };
}

/**
 *
 * @param DB
 * @param params
 * @param key
 * @constructor
 */
export function Editor(DB, params, key) {
  let request = indexedDB.open(DB.db_name, DB.db_version);
  request.onsuccess = function (event) {
    let db = event.target.result;
    let transaction = db.transaction(DB.db_store_name, "readwrite");
    let store = transaction.objectStore(DB.db_store_name);
    let request = store.put(params, key);
  };
  request.onerror = function (event) {
    console.log("err：" + event);
  }
}
