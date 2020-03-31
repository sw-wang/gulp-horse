// gulp 配置文件
// TIP:更改生效需重启项目
module.exports = {
    open: true,    // 是否自动打开浏览器
    livereload: true,    // 是否启用热更新
    babel: true,    // 开发模式是否ES6 to ES5
    // 根据 package.json 配置的环境变量
    env: {
        // 接口地址HOST，开发环境请替换development，生成环境请替换production
        'api': {
            production: 'https://production.com',
            development: 'https://development.com'
        }
    },
    // 全局嵌入到所有模版的公共文件
    public: {
        // 公共模版文件，如mate、head、foot...
        template: {
            mate: 'components/meta.html'
        },
        // 公共js文件，如jq，layui
        js: [
            'public/layui/layui.js?v=2.5.6',
            'public/jquery/jquery.min.js?v=3.4.1',
            'public/jquery/jquery.cookie.js?v=1.4.1',
        ],
        // 公共css文件
        css: [
            'public/layui/css/layui.css?v=2.5.6'
        ]
    }
}