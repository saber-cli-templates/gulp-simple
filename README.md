# saber_cli_tpl_gulp

基于gulp构建的项目模版

## 目录

## Q&A

Q：有了webpack，为什么还需要Gulp？
A：前端框架：1.jQuery;2.React/Vue

React/Vue构建的应用，SEO不友好，除非做服务端渲染（或者简单页面的预渲染），服务端渲染成本高。需要SEO友好的情况下，可能会直接使用原生或者jQuery开发。

由于webpack基于js作为入口，打包客户端渲染的单页面应用比较方便，对于需要SEO的页面，要么使用服务端渲染，要么回到原始状态，这时使用gulp构建还是比较方便的。
