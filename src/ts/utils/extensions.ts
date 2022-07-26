type _anyObj = { [key: string | number]: any };

declare global {
  interface Window {
    objectMap: <T>(
      obj: _anyObj,
      keyfun: (key: string, obj: _anyObj) => string,
      propfun: (arg: _anyObj, key: string) => any
    ) => { [key: string]: T };
  }
}

export const objectMap = (window.objectMap = <T>(
  obj: _anyObj,
  keyfun: (key: string, obj: _anyObj) => string,
  propfun: (arg: _anyObj, key: string) => any
): { [key: string]: T } => {
  const newObj: { [key: string]: any } = {};
  for (const key of Object.keys(obj)) {
    newObj[keyfun(key, obj[key])] = propfun(obj[key], key);
  }
  return newObj;
});

window.mapToObject = function mapToObject(arr, keyfun, propfun) {
  const newObj = {};
  for (const i of Object.keys(arr)) {
    newObj[keyfun(arr[i], i)] = propfun(arr[i], i);
  }
  return newObj;
};

window.run = function run(param, ...args) {
  if (typeof param === "function") return param(...args);
  else return param;
};

String.prototype.capitalize = function () {
  return this[0].toUpperCase() + this.slice(1);
};

window.last = function last(array) {
  return array[array.length - 1];
};

window.deepAssign = function deepAssign(target, source) {
  for (const prop of Object.keys(source)) {
    if (typeof source[prop] === "object" && typeof target[prop] === "object") deepAssign(target[prop], source[prop]);
    else target[prop] = deepClone(source[prop]);
  }
};

window.mergeUnique = function mergeUnique(a, b) {
  return a.concat(b.filter((item) => a.indexOf(item) < 0));
};

window.deepClone = function deepClone(object) {
  if (typeof object !== "object") return object;
  let fillObject;
  if (object.constructor === Array) fillObject = [];
  else fillObject = {};
  for (const prop of Object.keys(object)) {
    fillObject[prop] = deepClone(object[prop]);
  }
  return fillObject;
};

export {};
