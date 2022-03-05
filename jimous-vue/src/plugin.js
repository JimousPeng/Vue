/*
 * @Author: jimouspeng
 * @LastEditTime: 2022-03-05 13:53:05
 * @Description: 
 * @FilePath: \vue\jimous-vue\src\plugin.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
export const JimousPlugin = {}
JimousPlugin.install = (Vue, options) => {
    console.log(options)
    Vue.prototype.writeDom = () => {
        console.log('调用plugin方法')
    }
}
