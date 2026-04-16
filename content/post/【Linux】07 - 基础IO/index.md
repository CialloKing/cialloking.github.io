---

date: 2026-04-14T00:00:00+08:00
lastmod: 2026-04-14T00:00:00+08:00
title: '【Linux】07 - 基础IO'


tags:
  - IO

categories:
  - Linux
  
---


## 文件



一个大小为0的空文件在磁盘上也要占据空间。文件=内容+属性，虽然内容为空，但是文件的创建时间，权限等属性还是需要存储的，所以还是要占磁盘空间。所有的文件操作本质是文件内容操作和文件属性操作。

文件在磁盘上，磁盘是个外设，磁盘是永久性存储介质，和内存不同，内存断电就会丢失所有数据，磁盘不会，因此文件在磁盘上的存储是永久性的。访问文件本质就是在系统和外设之间进行IO（输入输出）操作，读写文件就是读写磁盘。

Linux里一切皆文件，Linux系统里把显示器，键盘，网卡等外设全部抽象成文件。

文件按加载情况可以分为两类，一类是在内存中被打开的文件，另一类是在磁盘中没被打开的文件。  
访问文件，需要先打开文件，可执行程序执行了打开文件的代码这个文件才算打开，是进程在打开文件。对文件的操作本质是进程在对文件操作。操作系统负责管理所有的硬件，磁盘的管理者是操作系统，C语言或者其他语言提供的库函数底层是封装了系统提供的系统调用来打开文件。  
一个进程可能会打开多个文件，系统里又在同时运行多个进程，被打开的文件数量可能会非常多，所以操作系统要对这些文件进行管理，怎么管理？**先描述，再组织**。

## C语言文件接口


### 打开文件

```c
#include <stdio.h>
int main()
{
    FILE *fp = fopen("hello.txt", "w");   //打开失败则返回空指针
    if(!fp){
        printf("fopen error!\n");
    }
    fclose(fp);
    return 0;
}
```
执行`fopen`时会默认在程序的当前工作路径下查找文件。



### 写文件
```c
#include <stdio.h>
#include <string.h>
int main()
{
    FILE *fp = fopen("hello.txt", "w");   //打开失败则返回空指针
    if(!fp){
        printf("fopen error!\n");
    }
    const char *msg ="hello log: ";
    int c = 10;
    while(c)
    {
        char buff[128];
        snprintf(buff,sizeof(buff),"%s%d\n",msg,c--);
        fwrite(buff, strlen(buff), 1, fp);
    }
    fclose(fp);
    return 0;
}
```


### 读文件

```c
#include <stdio.h>

int main() {
    FILE *fp = fopen("hello.txt", "r");
    if (!fp) {
        perror("fopen");
        return 1;
    }

    char line[128];
    while (fgets(line, sizeof(line), fp)) {
        printf("%s", line);   // line 已含换行符，printf 不需要再加 \n
    }

    fclose(fp);
    return 0;
}
```

修改一下我们可以写一个自己的cat命令。
```c
#include <stdio.h>

int main(int argc, char *argv[]) {
    char line[128];

    // 无参数：从标准输入读取
    if (argc == 1) {
        while (fgets(line, sizeof(line), stdin))
            printf("%s", line);
        return 0;
    }

    // 有参数：逐个打开文件并输出内容
    for (int i = 1; i < argc; i++) {
        FILE *fp = fopen(argv[i], "r");
        if (!fp) continue;          // 打开失败，直接跳过（不报错）
        while (fgets(line, sizeof(line), fp))
            printf("%s", line);
        fclose(fp);
    }
    return 0;
}
```


### 输出消息到显示器上的几种方法

```c
#include <stdio.h>
#include <string.h>
int main() {
    printf("hello printf\n");
    fprintf(stdout, "hello fprintf\n");

    const char *msg = "hello fwrite\n";
    fwrite(msg, strlen(msg), 1, stdout);
    return 0;
}
```
向显示器打印，本质就是向显示器文件写入，因为Linux里一切皆文件。

### stdin stdout stderr


C默认会打开三个输入输出流，分别是`stdin`，`stdout`，`stderr`，仔细观察发现，这三个流的类型都是`FILE*`，`fopen`返回值类型是文件指针。  
`stdin`叫标准输入，对应键盘文件，`stdout`叫标准输出，`stderr`叫标准错误，这两个都对应显示器文件。

我们使用编译器编译代码时，编译器会往代码里面加一些东西，就是把`stdin`，`stdout`，`stderr`这三个文件依次打开。程序是做数据处理的，要有一种默认的输入和输出，打开这三个文件就提供了默认的数据源和数据结果。


### 打开文件的方式
使用`man fopen`指令可以看到`fopen`打开文件的各种方式。
```bash
       r      Open text file for reading.  The stream is positioned at the beginning of the file.

       r+     Open for reading and writing.  The stream is positioned at the beginning of the file.

       w      Truncate  file  to zero length or create text file for writing.  The stream is positioned at the begin‐
              ning of the file.

       w+     Open for reading and writing.  The file is created if it does not exist,  otherwise  it  is  truncated.
              The stream is positioned at the beginning of the file.

       a      Open  for appending (writing at end of file).  The file is created if it does not exist.  The stream is
              positioned at the end of the file.

       a+     Open for reading and appending (writing at end of file).  The file is created if  it  does  not  exist.
              The initial file position for reading is at the beginning of the file, but output is always appended to
              the end of the file.
```

以r只读方式打开文件时，文件必须存在。  
以r+读写方式打开文件时，文件必须存在。打开后指针在开头，你可以在任意位置**覆盖**已有数据，但不能自动扩展文件大小。

以w只写方式打开文件时，如果文件不存在会创建文件，默认会清空文件，写文件时会从文件开头开始写。输出重定向操作`>`第一步是打开文件，打开时会清空，所以每次重定向操作内容都是全新的。  
以w+读写方式打开文件时，如果文件不存在会创建文件，默认会清空文件，写文件时会从文件开头开始写，写完后，再把指针移到开头读取刚才写的内容。

以a追加方式打开文件时，文件不存在则新建文件，写文件会向文件结尾写入。追加重定向`>>`的本质其实也是以a方式打开。  
以a追加方式打开文件时，读取位置在开头，写入位置强制在末尾。



把字符串写入文件时就不需要把`\0`也写入文件，因为`\0`是C语言的关系，和文件没关系。

## 系统文件IO

文件在磁盘上，硬件设备由操作系统管理，操作系统才能对文件进行读写操作，Linux提供了系统调用`open`来打开文件。

### 传递标志位的方法


一个int整型有4个字节32个比特位，可以在二进制的int整型里每一个比特位都只放一个1，其他位置全部放0，这样我们就得到了32个标志位，与32个比特位一一对应。由于标志位的二进制里只要一个1，所以转换为10进制时结果都是2的幂。

### 文件的系统调用
#### open

Linux提供的系统调用`open`有两种，`int open(const char *pathname, int flags);`是打开已存在的文件，`int open(const char *pathname, int flags, mode_t mode);`是创建新文件或打开文件（当`flags`包含`O_CREAT`时）。`const char *pathname`:是要打开或创建的文件路径。成功时返回一个非负整数，即文件描述符 (File Descriptor, fd)，失败时返回-1。`int flags`是标志位，有`O_RDONLY`只读打开，`O_WRONLY`只写打开，`O_RDWR`读写打开，`O_APPEND`每次写操作前，文件偏移量自动移至文件末尾，也就是在末尾写入，`O_TRUNC`	若文件存在且以写方式打开，将长度截为0，也就是清空文件内容，`O_CREAT`是若文件不存在则创建，还有一些其他的标志位这里没有展示。这些标志位其实都是宏，背后都是整数。


运行下面的代码。
```c
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>

int main() {
    int f = open("hello.txt",O_CREAT | O_WRONLY );
    if(f==-1) {return 1;}
    return 0;
}
```
运行后会创建hello.txt文件，使用`ll`指令查看。
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z cfile]$ ll hello.txt 
-r-S-ws--T 1 user1 user1 0 Apr 16 20:15 hello.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z cfile]$ 
```
这个hello.txt文件的权限怎么回事，全乱套了。原因是新建文件时必须在系统调用`open`里设置权限。也就是设置参数`mode_t mode`
修改一下`open`的参数。
```c
int f = open("hello.txt",O_CREAT | O_WRONLY ,0666);
```
```bash
[user1@iZ2zeh5i3yddf3p4q4ueo7Z cfile]$ ll hello.txt 
-rw-rw-r-- 1 user1 user1 0 Apr 16 20:19 hello.txt
[user1@iZ2zeh5i3yddf3p4q4ueo7Z cfile]$ 
```
再创建文件时权限就是正常的了。眼尖的可能已经发现这不对吧，这权限也不是我们设置的0666啊，系统默认有一个权限掩码umask对权限进行设置，如果需要自定义权限，我们可以使用`umask(0);`来设置自己的掩码为0。


#### close

打开了文件我们需要关闭。使用系统调用`int close(int fd);`来关闭文件。参数`int fd`就是使用`open`打开文件时的返回值（文件描述符）。
```c
int f = open("hello.txt",O_CREAT | O_WRONLY ,0666);
close(f);
```


#### write

打开了文件我们需要向文件内写入。使用系统调用`ssize_t write(int fd, const void *buf, size_t count);`来向文件内写入，参数`int fd`是文件描述符，参数`const void *buf`是指向待写入数据的内存缓冲区指针，参数`size_t count`是期望写入的字节数；返回值是实际写入的字节数。

```c
const char *msg ="hello oldfe666";
int f = open("hello.txt",O_CREAT | O_WRONLY ,0666);
write(fd,msg,strlen(msg));
```

向文件内写入时不需要带上`\0`。  
运行代码结束后我们就得到了一个hello.txt文件，内容为"hello oldfe666"，但是我们修改一下msg然后再写入呢
```c
const char *msg ="666";
```
保存再运行代码，发现hello.txt文件的内容变成了"666lo oldfe666"。这是因为在打开文件时没有告诉系统要清空文件。  
在这里再修改一下`open`的参数。
```c
int f = open("hello.txt",O_CREAT | O_WRONLY | O_TRUNC,0666);
```
这样打开文件时就会清空，hello.txt文件的内容就只有"666"了。  
假如需要追加写入，需要传`O_APPEND`标志位，但是`O_APPEND`和`O_TRUNC`又清空又追加，在一起有矛盾，所以`O_APPEND`和`O_TRUNC`往往是互斥的。
```c
int f = open("hello.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  //追加写
```
C语言的库函数封装了系统调用，所以w选项最后就被转换为`O_WRONLY | O_TRUNC`，a选项最后就被转换为`O_WRONLY | O_APPEND`。

---

`write`的第二个参数是`void *`类型，既可以文本写入也可以二进制写入，直接写入整型变量文件会显示乱码，因为写入的是二进制，要写入整型以文本形式显示需要把整型值转换为字符串再写入。文本写入或二进制写入是语言层的概念，C语言提供的库函数会格式化输入自动转为字符串类型，系统不关心写入类型。

#### read

打开了文件我们需要读取文件内容。使用系统调用`ssize_t read(int fd, void *buf, size_t count);`来读取文件内容，参数`int fd`是文件描述符，参数`void *buf`是向接收数据的内存缓冲区指针，参数`size_t count`是期望读取的最大字节数；成功会返回读取到的字节数，返回0表示读取到文件结尾了，返回-1代表读取失败。

```c
int f = open("hello.txt",O_RDONLY);  
while ((n = read(fd, buffer, sizeof(buffer) - 1)) > 0) {
        buffer[n] = '\0';  
        printf("%s", buffer);
    }
```

打开文件代表文件存在不需要创建，那么也就不需要控制权限，标志位只需要传`O_RDONLY`就行了。


### 文件描述符

使用`open`打开一个文件会返回文件描述符。
```c
int f1 = open("log1.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f1);

int f2 = open("log2.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f1);

int f3 = open("log3.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f1);
```
打开后可以发现，文件描述是从3开始的，后面依次往下递增，0，1，2号文件去哪里了？0，1，2号文件叫做标准输入，标准输出，标准错误，也就是程序启动时自动打开的三个文件。C语言里面的`fopen`函数返回值是，`FILE*`,`*`是指针，`FILE`是C语言提供的一个结构体，里面有文件的各种属性。在操作系统这一层只认识文件描述符，`FILE`里封装了文件描述符。

打印出`stdin`，`stdout`，`stderr`的文件描述符。
```c
printf("%d",stdin->_fileno);
printf("%d",stdout->_fileno);
printf("%d",stderr->_fileno);
```


其他语言里也有类似的东西，都是封装了系统调用，操作系统这一层只认识文件描述符。在语言层封装了系统调用可以提升跨平台可移植性，在不同的系统之间都只需要一样的代码。语言层增加可移植性可以让更多人使用。

---

文件描述符从0开始依次往上增长，很像数组下标。一个进程可能打开多个文件，系统里有很多被打开的文操作系统需要对这些文件进行管理。


类似进程的PCB，操作系统会给每个被打开的文件创建一个结构体对象struct file，包含文件的权限，读写选项位置，文件缓冲区等各种属性。操作系统把每个struct file连起来组成链表，对文件的管理就变成了对链表的增删查改。  
每个文件都有自己的文件缓冲区，加载时文件内容会被加载到缓冲区。  
一个进程可能会打开多个文件，创建新进程时操纵系统除了给进程创建页表，还要给进程创建文件描述符表，会包含一个指针数组，数组内的指针指向文件的struct file，进程PCB里会有个指针`struct file_struct *`指向文件的struct file。这样进程就能找到对应的文件了。

用户使用`open`打开文件时，操作系统会创建一个struct file，然后在文件描述符表里找一个没用过的下标，把struct file的地址填进去。使用`read`读取文件时，系统找到对应的文件，把文件缓冲区里的数据拷贝到用户的buffer里，`read`函数本质是拷贝函数。  
如果要修改文件，CPU会执行指令修改在内存中文件缓冲区的内容，然后再写入到磁盘里。对任何文件内容对任何操作，都必须先把文件加载到操作系统内核对应的文件缓冲区里，加载的过程其实就是磁盘到内存的拷贝。


### 重定向原理

```c
close(0)
int f0 = open("log0.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f0);
close(1)
int f1= open("log1.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f1);
close(2)
int f2 = open("log2.txt",O_CREAT | O_WRONLY | O_APPEND,0666);  
printf("%d",f2);
```
假如把0，1，2号文件关闭了，log0.txt，log1.txt等文件就会使用0，1，2号文件描述符。文件描述符的分配原则是分配最小的，没有被使用的，作为新的fd给用户。  
假如把代表标准输出的1号关闭了，那么打开log1.txt文件时就会被分配1号文件描述符，向显示器打印的内容就会被写入到log1.txt文件里，这个就是重定向的原理。  
重定向是在操纵系统层做的狸猫换太子，重定向其实就是更改文件描述符表的指针指向，数组下标不变。

但是先关闭再打开文件太麻烦了，有没有什么简单又快速的重定向方法。我们可以使用系统调用`int dup2(int oldfd, int newfd);`来完成重定向操作，`int oldfd`是想要重定向的文件描述符表下标，`int newfd`是重定向目标的文件描述符表下标。如`dup2(fd, 1)`就是把文件描述符表里下标为fd的指针拷贝覆盖下标1的指针，最后的结果是下标fd和下标1的指针都指向log1.txt。

常见的重定向有：`>`，`>>`，`<`。这几个重定向的区别都是由`open`的标志位区分的。
- 输出重定向`>`对应的标志位是`O_WRONLY | O_CREAT | O_TRUNC`
- 追加重定向`>>`对应的标志位是`O_WRONLY | O_CREAT | O_APPEND`
- 输入重定向`<`对应的标志位是`O_RDONLY`

重定向=打开文件的方式+`dup2()`。再加上`main`函数的参数我们就可以实现对指定的文件进行重定向操作，也就是实现自己的`>`，`>>`，`<`。



`dup2(fd, 1)`会使用下标为fd的指针拷贝覆盖下标1的指针，那么标准输出标准输出要怎么关闭？文件的struct file内部会维护一个引用计数，一个文件可以被多个进程打开，有进程关闭文件时其实就是引用计数--，使用`dup2(fd, 1)`时会自动给1下标的标准输出的引用计数--，所以不需要手动管理。





## 一切皆文件
待更新。。。
