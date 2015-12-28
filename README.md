# Backbone-php-mysql

需注意的几点：

1.sync方法把model持久化存储到服务器端

2.整个Backbone，只有Model和Collection的sync会调用Backbone.sync

3.请求类型由第一个参数method决定，可以是create/update/patch/delete/read。它默认采用RESTful请求

4.请求的数据由第二个参数model决定
