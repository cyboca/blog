# demo
## 拉取基础环境
每个人先安装hugo，拉取本仓库[demo](https://gitee.com/cyboca/demo.git)。

## 目录
每个人目录是content/post/<拼音缩写>

## 创建文章
例如使用`hugo new post/cxn/hello.md`即可在cxn目录下创建一个空的hello.md，内容如下：
```
---
title: "Hello"
date: 2019-11-09T18:59:05-08:00
draft: true
---
```

* title是文章标题
* date是创建时间
* draft默认为true，表示是草稿， *写完后改成false，否则文章不生成html文件*
* 手动在上面加上一行categories，用于指定目录，例如添加以下的categories可以指定文章显示在cxn目录下：
```
---
title: "Hello"
categories: "cxn"
date: 2019-11-09T18:59:05-08:00
draft: true
---
```

* 添加author，指定文章作者，例如指定文章作者`cxn`：
```
---
title: "Hello"
categories: "cxn"
date: 2019-11-09T18:59:05-08:00
author: "cxn"
draft: true
---
```

* 添加tags，可以指定文章关键字，便于搜索，如添加`shell`，`linux`等：
```
---
title: "Hello"
categories: "cxn"
tags: ["linux","shell"]
date: 2019-11-09T18:59:05-08:00
author: "cxn"
draft: true
---
```

## 图片
图片放到`static/img`目录下，如`static/img/lyca.png`，在引用时，使用路径为`/img/lyca.png`，如有需要，可以在`static/img`目录下自行增加目录存放

## 本地预览
修改目录下的config.toml文件中的baseurl为`baseurl = "http://localhost:1313"`，执行`hugo server -D`即可本地预览文章

## 生成静态文件
在目录下执行hugo，会将写好的md生成静态网页文件

## 初次配置本地目录
1. 安装hugo
2. 拉取基础环境，执行`git pull https://gitee.com/cyboca/demo.git`，其中的config.toml在本地调试时，可以将其中的baseurl修改为`baseurl = "http://localhost:1313"`，*但执行hugo生成文件前，需要还原，否则页面会乱！！！*

## 后续创建、修改文章

1. 执行`hugo new post/cxn/test.md`创建文件（此处以cxn目录为例），编辑文章。多个文件重复操作即可。
2. 编辑完成后，拉取远程仓库`git pull origin master`，推送前先拉取一次，防止冲突
3. 执行`hugo`，将文章转成网页
4. 执行`git add *`，添加所有修改的文件
5. 执行`git commit -m <comment>`，提交更新，comment内容自定义
6. 执行`git push origin master`，将代码推送到远程仓库

## 注意事项
*本地调试时，修改了post外的文件，推送前需要还原，避免上传后页面混乱*

*post目录中的文章中draft必须修改为false，否则执行`hugo`不会生成网页*

*每个人编辑自己的目录下的文件，不要修改他人文件*


推送到远程仓库，服务器会自动拉取更新，访问 https://cyboca.ga 即可看到。