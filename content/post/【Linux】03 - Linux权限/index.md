---

date: 2026-03-30T00:00:00+08:00
lastmod: 2026-04-07T00:00:00+08:00
title: '【Linux】03 - Linux权限'

mermaid: true
math: true
tags:
  - 基础命令
  - 权限

categories:
  - Linux
   

---


# Linux权限

## shell
操作系统内核会包裹一个外壳程序，统称为shell，外壳程序在内核和用户之间沟通，对于windows系统，外壳程序就是图形化界面，用户通过图形化界面操作系统，外壳程序shell把用户的操作翻译给内核，把内核的处理结果翻译给用户；和windows相似，Linux系统里外壳程序就是命令行界面，用户通过命令行来操作。  
shell会创建子进程，让子进程进行命令的解释，如果子进程执行命令出问题了也不影响父进程。

Linux里的shell叫bash，用户的指令都通过bash传给内核。


## 用户的分类
Linux中里面有两种用户，一种是root超级管理员用户，一种是其他普通用户。root用户拥有最高权限，命令行末尾的字符为#，例如
```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z test]# 
```
代表这是root用户。


普通用户命令行末尾的字符为$，例如
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]\$ 
```
代表这是一个普通用户。

### 提权su指令
普通用户的权限有限

```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ cd /usr/bin/
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ pwd
/usr/bin
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ touch test.txt
touch: cannot touch ‘test.txt’: Permission denied
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ 
```
/usr/bin/是系统目录，普通用户无法修改里面的内容，有时安装命令或软件需要对系统目录进行操作，这时普通用户可以使用`su`指令来提升权限
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ su
Password: 
[root@iZ2zeh5i3yddf3p4q4ueo7Z bin]# 
```
使用`su`指令后，会要求输入root用户的密码，输入成功后权限会提高为root，末尾的字符也变成了#。  
提权后若要变回普通用户可以使用ctrl+d快捷键
```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z bin]# exit
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ 
```
这时权限就从root用户变成了普通用户。

我们也可以使用`su -`指令提权，输入root用户的密码，权限也会提高为root。
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ su -
Password: 
Last login: Mon Mar 30 22:23:10 CST 2026 on pts/1
[root@iZ2zeh5i3yddf3p4q4ueo7Z ~]# pwd
/root
[root@iZ2zeh5i3yddf3p4q4ueo7Z ~]# who
root     pts/0        2026-03-30 20:50 (223.101.60.101)
user1    pts/1        2026-03-30 22:10 (223.101.60.101)
[root@iZ2zeh5i3yddf3p4q4ueo7Z ~]# 
```


> [!TIP]
> `su`指令不会让root重新登录，只是身份切换，不影响所处目录，`su -`指令是让我们以root的身份重新登录，会导致用户所处的目录变化


---

root用户也可以变成普通用户，使用`su 用户名`指令可以切换为指定的普通用户。
```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z test]# pwd
/root/test
[root@iZ2zeh5i3yddf3p4q4ueo7Z test]# su user1
[user1@iZ2zeh5i3yddf3p4q4ueo7Z test]$ pwd
/root/test
[user1@iZ2zeh5i3yddf3p4q4ueo7Z test]$ 
```
root切换为普通用户不需要输入密码。


---
有时在多人协作中我们无法每次都输入root的密码来提权，但是又必须创建或修改文件，这时我们可以在要执行的命令前加上`sudo`来短暂提权，这时会要求输入当前用户的密码，输入后就可以执行需要root权限的操作了，比如软件安装等。
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ touch test.c
touch: cannot touch ‘test.c’: Permission denied
[user1@iZ2zeh5i3yddf3p4q4ueo7Z bin]$ sudo touch test.c

We trust you have received the usual lecture from the local System
Administrator. It usually boils down to these three things:

    # 1) Respect the privacy of others.
    # 2) Think before you type.
    # 3) With great power comes great responsibility.

[sudo] password for user1: 
Sorry, try again.
[sudo] password for user1: 
user1 is not in the sudoers file.  This incident will be reported.
```
第一次使用时可以发现系统提示`user1 is not in the sudoers file.  This incident will be reported.`，用户不在白名单中，需要让root用户添加。


使用`vim /etc/sudoers`指令来编辑白名单。
```bash

## Allow root to run any commands anywhere 
root    ALL=(ALL)       ALL                #复制这一行，粘贴并修改需要加入名单的用户名
需要添加的用户名    ALL=(ALL)       ALL
```



## Linux权限管理
权限本质是能做或不能做什么事，Linux的权限是为了控制用户的行为，防止错误的发生。权限要求目标必须具备对应的属性，比如一个非可执行文件没有可执行的属性，谁来了都无法运行。  

### 文件访问者的分类
文件权限角色分三类，分别是
- 拥有者
- 所属组
- 其他other


```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z ~]# ll
total 4
drwxr-xr-x 4 root root 4096 Mar 30 00:11 test
[root@iZ2zeh5i3yddf3p4q4ueo7Z ~]# 
```
对应`drwxr-xr-x 4 root root 4096 Mar 30 00:11 test`这个文件来说，第一个root是拥有者，第二个root是所属组，既不是拥有者又不是所属组就是other。同一个用户对于不同文件可能属于不同的角色。

---

Linux系统使用所属组来在多人协作中实现更精细化的权限管理，假如有AB两个人同时在同一台Linux机器上工作，AB之间的文件相互没有权限读写，有一天上级领导要浏览A的工作文件，如果没有所属组的话A只能把other所属组开放读权限，这时包括B在内的所有人都可以浏览；有了所属组A可以把上级领导设置到所属组里，开放读权限，other权限不变，这样就实现了精细化的权限管理。


### rwx
Linux中一切皆文件，描述一个文件的权限时，可以说这个文件的什么角色组可以执行什么操作，Linux在文件属性部分分别使用`rwx`来分别代表读，写，执行这三个权限。  


`drwxr-xr-x 4 root root 4096 Mar 30 00:11 test`这个文件中，前面属性当中第一个字符代表文件类型，`rwxr-xr-x`代表文件权限，三三分组对应角色权限，`rwx`代表拥有者有读写执行权限，`r-x`代表所属组有读和执行权限，`r-x`，代表其他other有读和执行权限，没有对应的权限无法对文件进行相应的操作。



### 修改权限chmod指令

使用`chmod`指令可以修改权限。

符号模式使用 u（拥有者）、g（所属组）、o（其他）、a（所有用户）配合 +（添加）、-（移除）、=（精确设置）。
```bash
# 给所有者添加执行权限
chmod u+x script.sh

# 移除所属组的写权限
chmod g-w file.txt

# 给其他用户设置只读（覆盖原有权限）
chmod o=r file.txt

# 同时给所有用户添加执行权限
chmod a+x script.sh
```





```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 0
-rw-rw-r-- 1 user1 user1 0 Mar 30 23:51 file.txt     
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ chmod u+x file.txt   # 给所有者添加执行权限
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 0
-rwxrw-r-- 1 user1 user1 0 Mar 30 23:51 file.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ chmod u-x file.txt   # 移除所有者的执行权限
total 0
-rw-rw-r-- 1 user1 user1 0 Mar 30 23:51 file.txt
```


同时权限可以表示为八进制的数字，每个权限位对应一个数字：r=4、w=2、x=1。将一组权限的三位相加得到一个数字，按顺序（所有者、组、其他）组成三位数。


| 数字 | 权限 | 含义     |
| ---- | ---- | -------- |
| 7    | rwx  | 读写执行 |
| 6    | rw-  | 读写     |
| 5    | r-x  | 读+执行  |
| 4    | r--  | 只读     |
| 3    | -wx  | 写+执行  |
| 2    | -w-  | 只写     |
| 1    | --x  | 只执行   |
| 0    | ---  | 无权限   |


```bash
# 所有者读写执行，组和其他读+执行（755）
chmod 755 script.sh

# 所有者读写，组和其他只读（644）
chmod 644 file.txt

# 所有用户都可读写执行（777，通常不推荐）
chmod 777 shared_dir
```



---

chmod指令也不是什么文件的权限都能修改
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 0
-rw-rw-r-- 1 user1 user1 0 Mar 30 23:51 file.txt
-rw-r--r-- 1 root  root  0 Mar 31 00:02 root.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ chmod u+x  root.txt 
chmod: changing permissions of ‘root.txt’: Operation not permitted
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ 
```
可以看到无法修改root.txt，普通用户只能修改自己文件的权限，不能修改其他用户创建的文件权限。


### 角色只确定一次

```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 4
-rw-rw-r-- 1 user1 user1 6 Mar 31 00:09 file.txt
-rw-r--r-- 1 root  root  0 Mar 31 00:02 root.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ cat file.txt 
hello
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ chmod u-r file.txt 
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 4
--w-rw-r-- 1 user1 user1 6 Mar 31 00:09 file.txt
-rw-r--r-- 1 root  root  0 Mar 31 00:02 root.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ cat file.txt 
cat: file.txt: Permission denied
```

通过上面的例子，我们可以看到移除所有者user1的读文件权限后，就无法读取了，可是所属组也是user1，也拥有读文件的权限，为什么无法读取呢?  
确定权限信息时，系统会先确定用户是拥有者，所属组还是其他，在目前所处的环境下（CentOS），系统只会按拥有者，所属组，其他的顺序确定用户角色，只确定一次。

### root用户不受权限约束

root用户不受权限约束，可以随意读写执行。

```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z 111]# ll
total 4
--w-rw---- 1 user1 user1 6 Mar 31 00:09 file.txt
-rw-r--r-- 1 root  root  0 Mar 31 00:02 root.txt
[root@iZ2zeh5i3yddf3p4q4ueo7Z 111]# cat file.txt 
hello
[root@iZ2zeh5i3yddf3p4q4ueo7Z 111]# 
```
可以看到，root是other组，没有读权限，一样可以读取文件。  
文件在运行时Linux会有保护机制保护起来，这时root无法操作，除此之外root干什么都可以。


### 可执行权限

即使拥有可执行权限（x），文件本身也必须包含可执行的机器代码或脚本解释器才能运行。例如，一个文本文件即使加了 x 权限，也无法执行。

### 更改拥有者和所属组

#### chown指令
使用chown指令可以更改拥有者和所属组。
```bash
# 只更改所有者为 bob
sudo chown bob file.txt

# 同时更改所有者和所属组
sudo chown bob:developers file.txt

# 只更改所属组（使用 :group 形式）
sudo chown :developers file.txt

# 递归更改目录及其内部所有文件的所有者
sudo chown -R bob /home/bob/project
```




```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ll
total 4
--w-rw---- 1 user1 user1 6 Mar 31 00:09 file.txt
-rw-r--r-- 1 root  root  0 Mar 31 00:02 root.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ chown root file.txt 
chown: changing ownership of ‘file.txt’: Operation not permitted
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ 
```
但是拥有者不是想改就改的，系统默认不允许把文件给其他用户（例如把有bug的代码文件改成别人的来甩锅），想给其他用户必须提高权限，使用`su`或`sudo`切换root权限。



#### chgrp指令

修改文件或目录的所属组，最直接的命令是 chgrp
```bash
# 将 file.txt 的所属组改为 developers
sudo chgrp developers file.txt

# 递归将 project 目录及其下所有内容的所属组改为 staff
sudo chgrp -R staff /shared/project
```




### 目录文件的权限


如果想进入一个目录，需要的是`x`可执行权限


```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ ll
total 4
drwxrwxr-x 2 user1 user1 4096 Mar 31 00:02 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ chmod a-x 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ ll
total 4
drw-rw-r-- 2 user1 user1 4096 Mar 31 00:02 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ cd 111
bash: cd: 111: Permission denied
```
可以看到移除执行权限后就无法进入目录了。

---

如果想查看目录内的文件，需要`r`读权限
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ ll
total 4
drwxrwxr-x 2 user1 user1 4096 Mar 31 00:02 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ chmod a-r 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ cd 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ ls
ls: cannot open directory .: Permission denied
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ 
```
可以看到移除读权限后就无法读取目录内的文件了。

---

如果想在目录新建文件，需要`w`写权限
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ ll
total 4
drwxrwxr-x 2 user1 user1 4096 Mar 31 00:02 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ chmod a-w 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ ll
total 4
dr-xr-xr-x 2 user1 user1 4096 Mar 31 00:02 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z ~]$ cd 111
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ touch newfile
touch: cannot touch ‘newfile’: Permission denied
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 111]$ 
```
可以看到移除写权限后就无法在目录内新建文件了。


---

默认情况下，我们新建一个目录rws权限都要有。


#### Linux下多用户之间如何隔离

在Linux系统下，每新建一个用户系统就在/home目录下新建一个以用户名为名的新目录作为这个新用户的家目录。
```bash
[root@iZ2zeh5i3yddf3p4q4ueo7Z home]# ll
total 8
drwx------ 3 admin admin 4096 Mar 27 23:06 admin
drwx------ 3 user1 user1 4096 Mar 30 23:51 user1
[root@iZ2zeh5i3yddf3p4q4ueo7Z home]# 
```
可以看到，每个家目录的权限都对相应用户拉满，所属组和其他组一点权限不给，这就做到了用户无法访问其他用户的家目录，只能访问自己的家目录，从而实现了多用户下的文件隔离。


#### 缺省权限

```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ mkdir 333
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ touch newfile.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ ll
total 4
drwxrwxr-x 2 user1 user1 4096 Mar 31 00:56 333
-rw-rw-r-- 1 user1 user1    0 Mar 31 00:56 newfile.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ 
```
可以看到，新建一个文件起始权限为 666，显示 `rw-rw-r--`；新建一个目录起始权限为 777，显示 `rwxrwxr-x`。这与起始权限不一致，是因为系统存在权限掩码（umask）。


系统中存在权限掩码可以通过umask指令查看
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ umask
0002
[user1@iZ2zeh5i3yddf3p4q4ueo7Z 222]$ 
```
最终权限 = 起始权限 & ~umask（将 umask 按位取反后，再与起始权限进行按位与运算）。

有些人需要个性化修改新建文件的默认权限，可以通过修改权限掩码umask灵活实现，大部分用户不需要修改。



### 删除权限

要删除一个文件（例如 rm file.txt），用户必须对文件所在的父目录拥有 写权限（w） 和 执行权限（x）。
- 写权限：允许修改目录内容（包括添加、删除文件项）。
- 执行权限：允许进入该目录（cd 进去），以便访问其中的文件项。

文件本身的权限（r/w/x）不影响你能否删除它，只影响能否读取、修改或执行其内容。


删除目录（例如 rmdir empty_dir 或 rm -r dir）同样取决于父目录的写和执行权限。此外，对于 rm -r 递归删除目录时，还需要对目录本身及其内部内容有适当的访问权限才能遍历和删除。
- 对目录本身的执行权限：进入目录并读取其内容。
- 对目录本身的写权限：删除目录项时，实际是在父目录中删除该目录的条目，所以父目录需要写权限。
- 如果使用 rm -r，你还必须能够递归地删除目录内所有文件和子目录，因此你需要对目录树中的所有子目录拥有写和执行权限。



### 多人文件协作权限
每个用户的家目录其他用户无法访问，为了让所有人都能进行协作，我们可以在根目录`/`下新建一个共享的目录文件来进行多人协作。  
每个人都不想让自己的文件被其他人以为删除，但是如何让任何一个人能在共享目录下新建，但是不能让非拥有者删除呢？

为了实现这个需要，我们可以使用粘滞位来解决。

```bash
sudo chmod +t /shared/collab
```
此时权限变为 drwxrwxrwt，末尾变成了t代表可创建了不可删除他人文件的共享目录。  
粘滞位常用于共享目录（如 /tmp），保证用户只能删除自己的文件，提高协作安全性。