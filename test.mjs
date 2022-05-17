/*
 * @Author: jimouspeng
 * @Date: 2022-05-07 14:11:59
 * @Description:
 * @FilePath: \vue\test.mjs
 */
/** https://www.npmjs.com/package/path-to-regexp */
import { pathToRegexp } from 'path-to-regexp';

const pathList = [];
const regCtx = pathToRegexp('/foo/:id', pathList, {});
console.log(regCtx, pathList);
