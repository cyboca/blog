---
title: "NFS"
date: 2019-11-17T16:36:46+08:00
draft: false
author: cyboca
tags: ["nfs","linux"]
categories: cyboca
---

# nfs参数优化

##  一、nfs挂载优化

对nfs读写性能影响较大的主要是size数据块大小设置及是否需要同步写入磁盘

1. 在以太网环境中一般MTU为1500字节，size直接采用最大1M即可

2. 同步磁盘根据需求设定，若客户端间同步要求高或是对文件一致性、安全性要求较高，建议设置sync同步写入磁盘并设置noac关闭文件属性缓存

其余建议在挂载时加上的参数：nodev/noexec/nosuid/nolock

### 1.1.  rsize和wsize

默认rsize和wsize与服务器max_block_size相同

客户端挂载时可以指定rsize和wsize，该参数决定网络交互中数据块的大小，一般以太网MTU1500的情况下，采用最大1M即可

最大rsize和wsize根据/proc/fs/nfsd/max_block_size而定，nfsv3和nfsv4最大支持1M（设置超过1M不生效），不建议使用nfsv2。修改此值需要先停止nfs服务

![修改maxblock](/img/cyboca/clip_image003.gif)

#### 1.1.1. 测试rsize和wsize性能影响

设置size为8K和16K写入

![8k-16k](/img/cyboca/clip_image005.gif)

设置size为32K和64K写入

![32k-64k](/img/cyboca/clip_image007.gif)

设置size为256K和1M的写入

![256k-1m](/img/cyboca/clip_image009.gif)

### 1.2.  sync和async

默认采用async

sync将数据同步写入内存缓冲区与磁盘中，效率低，但可以保证数据的一致性；async将数据先保存在内存缓冲区中，必要时才写入磁盘

生产环境中建议使用sync，保证数据安全

#### 1.2.1. 测试sync和async性能影响

在size为1M下的写入对比

![sync写入对比](/img/cyboca/clip_image011.gif)

在size为256K下的写入对比

![256k-sync](/img/cyboca/clip_image013.gif)

### 1.3.  ac和noac

默认采用ac

客户端可以默认设置文件属性缓存，即开启ac。当客户端之间同步要求较高时，需要使用noac取消客户端文件缓存，同时与sync搭配使用

acregmin和acreginmax这2个参数指定缓存的有效时间

### 1.4.  tcp和udp

默认采用tcp

使用nfs over tcp 有助于提高慢速网络和广域网的性能。TCP 还提供拥塞控制和错误恢复功能

生产环境建议使用tcp

### 1.5.  lock和nolock

默认采用lock

nfs采取文件锁来保持文件同步，nfsv3采用NLM协议实现，nfsv4由自身实现文件锁

nfs中的文件锁可以加在客户端和服务端。lock在服务端加锁，所有客户端访问同一文件时都不会冲突；nolock仅在客户端本地加锁，本地多个进程同时访问同一文件时可以保证不冲突，但仍会以其他客户端产生冲突

### 1.6.  atime和noatime

默认采用atime

linux下访问文件会更新inode中atime，挂载时通过指定noatime可以禁止更新inode中的时间戳，以此提高性能（实测效果不大）

### 1.7.  nodev/noexec/nosuid

推荐客户端挂载时指定的几个参数

nodev设置不读取文件系统上的字符和块设备

nosuid取消挂载的文件系统上的suid设置

noexec设置挂载的文件系统上不具有可执行权限

### 1.8.  套接字缓冲区

通过设置一个远大于nfs block size的tcp窗口大小，可以优化传输（实测影响有限）

/proc/sys/net/core/rmem_max最大接收窗口大小

/proc/sys/net/core/rmem_default默认接收窗口大小

/proc/sys/net/core/wmem_max最大发送窗口大小

/proc/sys/net/core/wmem_default默认发送窗口大小

#### 1.8.1. 测试缓冲区大小性能影响

设置mem_default为64K，mem_max为64K，size为256K下的写入

![64k-mem](/img/cyboca/clip_image015.gif)

设置mem_default为512K，mem_max为2M，size为256K下的写入

![512k-mem](/img/cyboca/clip_image017.gif)

设置mem_default为1M，mem_max为4M，size为256K下的写入

![1m-mem](/img/cyboca/clip_image019.gif)

## 二、pv使用nfs

创建pv时，在mountOptions中指定挂载参数

```
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-nas
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 2Gi
  mountOptions:
  - vers=3
  - tcp
  - sync
  - nolock
  nfs:
    path: /default
    server: 192.168.10.100
  persistentVolumeReclaimPolicy: Retain

```
参考挂载优化中rsize/wsize、max_block_size和sync/async调整
