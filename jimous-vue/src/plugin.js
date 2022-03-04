export const JimousPlugin = {}
JimousPlugin.install = (Vue, options) => {
    console.log(options)
    Vue.prototype.writeDom = () => {
        console.log('调用plugin方法')
    }
}
