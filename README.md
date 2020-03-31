## GULP HORSE
v1.0.0

## 项目说明
gulp-horse能快速使用Gulp搭建传统PC端多页面、框架iframe等应用，让传统前端项目也能够模块化和工程化。

## 主要功能项
    1、HTML共用组件化
    2、SASS转CSS
    3、CSS浏览器前缀
    4、JS Label、模块化
    5、本地服务，支持代理
    6、多环境变量
    7、代码压缩

## 使用说明
    1、安装依赖 cnpm install
    2、运行开发环境 npm run dev
    3、打包生产环境 npm run build

## 目录结构

```
ROOT
  ├─ dist                发布目录，发布时会将 css js html 文件进行压缩，并存放于此
  ├─ src                 项目源码
  │  ├─ assets           静态资源文件夹，图片、样式、字体、常量
  │  ├─ components       html公共组件，如 head、foot
  │  ├─ config           项目配置相关
  │  │  └─ api.js        接口列表
  │  │  └─ axios.js      请求封装
  │  │  └─ base.js       域名配置
  │  ├─ pages            项目html页面
  │  ├─ public           公共静态资源文件夹，用来存放第三方插件，组件库
  │  ├─ utils            工具类库
  │  ├─ app.js           入口文件
  │  └─ index.html       首页面
  ├─ gulpfile.js         gulp 配置文件
  └─ package.json        npm 配置文件
  └─ gulp.config.js      项目配置文件
```

```
有疑问联系邮箱：wsw.sun@qq.com
```