---

date: 2026-04-29T00:00:00+08:00
lastmod: 2026-05-01T00:00:00+08:00
title: '【Linux】11 - 进程信号'


tags:
  - 信号

categories:
  - Linux
   

---


# 进程信号

信号和信号量是什么关系？关系就相当于老婆和老婆饼，Java和JavaScript，雷锋和雷峰塔，印度和印度尼西亚，总之就是毫无关系。

---

生活中处处都有信号，上课铃，红绿灯等都是信号。信号可能会中断我们正在做的事，比如上课铃响了张三要中断正在进行的斗地主，红灯亮了李四要中断前进状态并停车。信号本质是一种给进程发送的，用来进行事件**异步通知**的机制。  
上课上到一半，广播通知所有教师集中开会，暂停上课，等老师回来再继续上课，这就是同步。上课到一半张三拉肚子去厕所了，不等张三回来，继续正常上课，这就是异步。异步的特征就是两件事情同时发生互不干扰。张三在斗地主，广播在等待播放上课铃的时间，两者互不干扰，当广播响起上课铃了才会通知张三，所以信号的产生，相对于进程的运行是异步的。广播是发给同学们通知的，信号也是发给进程的。

1. 上课铃没响的时候张三就知道上课铃响了应该干什么，红灯没亮时李四就知道红灯亮了应该干什么。进程在信号没有产生的时候，早就知道信号该如何处理了。
2. 张三手上有一对王炸，上课铃响了他要把这局斗地主打完再收拾，所以信号的处理，不是立即处理，而是可以等一会，在合适的时候才进行信号的处理。
3. 张三能识别上课铃信号，是提前被"教育"过的，进程也是如此，进程是被操作系统工程师设计出来的，进程早已经内置了对于信号的识别和处理方式。
4. 张三在学校里接收的信号不只有广播，年级主任，校长等都有可能会给张三发信号；李四开车在路上接收的也不止红绿灯的信号，也包括交警手势，路牌等等信号。所以生活中信号源非常多，那么同样的，在计算机里给进程产生信号的信号源也非常多。

## 信号的产生与处理

信号的产生的方式非常多，比如键盘产生的信号，`ctrl + c`快捷键是给目标进程发送信号的。  
有相当一部分信号的处理动作，就是让自己终止。使用`kill -l`命令可以查看有哪些信号。

```bash
user1@iZ2zeh5i3yddf3p4q4ueo7Z:~$ kill -l
 1) SIGHUP	 2) SIGINT	 3) SIGQUIT	 4) SIGILL	 5) SIGTRAP
 6) SIGABRT	 7) SIGBUS	 8) SIGFPE	 9) SIGKILL	10) SIGUSR1
11) SIGSEGV	12) SIGUSR2	13) SIGPIPE	14) SIGALRM	15) SIGTERM
16) SIGSTKFLT	17) SIGCHLD	18) SIGCONT	19) SIGSTOP	20) SIGTSTP
21) SIGTTIN	22) SIGTTOU	23) SIGURG	24) SIGXCPU	25) SIGXFSZ
26) SIGVTALRM	27) SIGPROF	28) SIGWINCH	29) SIGIO	30) SIGPWR
31) SIGSYS	34) SIGRTMIN	35) SIGRTMIN+1	36) SIGRTMIN+2	37) SIGRTMIN+3
38) SIGRTMIN+4	39) SIGRTMIN+5	40) SIGRTMIN+6	41) SIGRTMIN+7	42) SIGRTMIN+8
43) SIGRTMIN+9	44) SIGRTMIN+10	45) SIGRTMIN+11	46) SIGRTMIN+12	47) SIGRTMIN+13
48) SIGRTMIN+14	49) SIGRTMIN+15	50) SIGRTMAX-14	51) SIGRTMAX-13	52) SIGRTMAX-12
53) SIGRTMAX-11	54) SIGRTMAX-10	55) SIGRTMAX-9	56) SIGRTMAX-8	57) SIGRTMAX-7
58) SIGRTMAX-6	59) SIGRTMAX-5	60) SIGRTMAX-4	61) SIGRTMAX-3	62) SIGRTMAX-2
63) SIGRTMAX-1	64) SIGRTMAX	
user1@iZ2zeh5i3yddf3p4q4ueo7Z:~$ 
```
这些信号本质都是整数，被定义成了宏。这里没有32和33号信号，所以总计有62个信号。34到64号信号被称为实时信号，这里目前不讨论。1到31号信号被称为普通信号。  
进程收到信号后处理的动作有三种：
1. 可以按照默认动作处理.
2. 也可以自定义处理动作，如张三听到上课铃了不执行回教室的默认动作，自定义动作为去厕所.
3. 进程收到信号后还可以忽略处理，如老师听到下课铃后忽略，继续讲下一题。


### 信号的默认处理

`ctrl + c`快捷键发送的是2号SIGINT信号，默认动作就是让进程终止。  
使用`man 7 signal`指令查看进程对不同信号的默认处理动作。
```bash
user1@iZ2zeh5i3yddf3p4q4ueo7Z:~/sig$ man 7 signal


   Standard signals
       Linux  supports  the  standard signals listed below.  The second column of the table indicates which standard
       (if any) specified the signal: "P1990" indicates that the signal is described in  the  original  POSIX.1-1990
       standard; "P2001" indicates that the signal was added in SUSv2 and POSIX.1-2001.

       Signal      Standard   Action   Comment
       ────────────────────────────────────────────────────────────────────────
       SIGABRT      P1990      Core    Abort signal from abort(3)
       SIGALRM      P1990      Term    Timer signal from alarm(2)
       SIGBUS       P2001      Core    Bus error (bad memory access)
       SIGCHLD      P1990      Ign     Child stopped or terminated
       SIGCLD         -        Ign     A synonym for SIGCHLD
       SIGCONT      P1990      Cont    Continue if stopped
       SIGEMT         -        Term    Emulator trap
       SIGFPE       P1990      Core    Floating-point exception
       SIGHUP       P1990      Term    Hangup detected on controlling terminal
                                       or death of controlling process
       SIGILL       P1990      Core    Illegal Instruction
       SIGINFO        -                A synonym for SIGPWR
       SIGINT       P1990      Term    Interrupt from keyboard

       SIGIO          -        Term    I/O now possible (4.2BSD)
       SIGIOT         -        Core    IOT trap. A synonym for SIGABRT
       SIGKILL      P1990      Term    Kill signal
       SIGLOST        -        Term    File lock lost (unused)
       SIGPIPE      P1990      Term    Broken pipe: write to pipe with no
                                       readers; see pipe(7)
       SIGPOLL      P2001      Term    Pollable event (Sys V).
                                       Synonym for SIGIO
       SIGPROF      P2001      Term    Profiling timer expired
       SIGPWR         -        Term    Power failure (System V)
       SIGQUIT      P1990      Core    Quit from keyboard
       SIGSEGV      P1990      Core    Invalid memory reference
       SIGSTKFLT      -        Term    Stack fault on coprocessor (unused)
       SIGSTOP      P1990      Stop    Stop process
       SIGTSTP      P1990      Stop    Stop typed at terminal
       SIGSYS       P2001      Core    Bad system call (SVr4);
                                       see also seccomp(2)
       SIGTERM      P1990      Term    Termination signal
       SIGTRAP      P2001      Core    Trace/breakpoint trap
       SIGTTIN      P1990      Stop    Terminal input for background process
       SIGTTOU      P1990      Stop    Terminal output for background process
       SIGUNUSED      -        Core    Synonymous with SIGSYS
       SIGURG       P2001      Ign     Urgent condition on socket (4.2BSD)
       SIGUSR1      P1990      Term    User-defined signal 1
       SIGUSR2      P1990      Term    User-defined signal 2
       SIGVTALRM    P2001      Term    Virtual alarm clock (4.2BSD)
       SIGXCPU      P2001      Core    CPU time limit exceeded (4.2BSD);
                                       see setrlimit(2)
       SIGXFSZ      P2001      Core    File size limit exceeded (4.2BSD);
                                       see setrlimit(2)
       SIGWINCH       -        Ign     Window resize signal (4.3BSD, Sun)

       The signals SIGKILL and SIGSTOP cannot be caught, blocked, or ignored.

```

进程对信号的默认处理方式（即信号的 disposition，也叫默认动作）主要有以下 5 种：

| 默认动作 | 含义                                                                    |
| -------- | ----------------------------------------------------------------------- |
| Term     | 终止进程（不生成 core dump），例如：SIGINT、SIGTERM、SIGALRM            |
| Ign      | 忽略信号，进程不做任何反应，例如：SIGCHLD、SIGURG、SIGWINCH             |
| Core     | 终止进程，并生成 core dump 文件，例如：SIGQUIT、SIGSEGV、SIGFPE、SIGILL |
| Stop     | 暂停（停止）进程的执行，例如：SIGTSTP、SIGTTIN、SIGTTOU                 |
| Cont     | 继续一个已停止的进程，例如：SIGCONT                                     |




### 前台后台进程

键盘发送的信号只能给前台进程。  
进程有前台和后台，直接运行可执行程序`./sigtest`，默认是前台进程，运行时在命令后加上`&`，让`./sigtest &`，就是让进程后台运行。没有运行任何可执行程序时命令行shell进程就是前台进程，键盘发送的信号只能发给前台进程。只有前台进程能从标准输入中获取键盘输入的内容，后台进程无法获取，但是前后台进程都能向标准输出（显示器）输出内容。键盘只有一个，输入数据一定是给一个确定的进程的，前台进程的本质就是要从键盘获取数据，所以前台进程只能有一个。
假如父进程比子进程先退出了，那么子进程会变成孤儿进程，被1号进程领养，这个过程中子进程会被自动切换成后台进程，这时`ctrl + c`快捷键就无法杀掉子进程，只能使用`kill`指令来给子进程发送信号。


加上`&`，让下面循环打印hello world的代码后台运行。
```cpp
#include <iostream>
#include <unistd.h>
#include <sys/types.h>
#include <unistd.h>

int main()
{

    for (int i = 0; i < 180; i++)
    {
        std::cout << "pid: " << getpid() << "  hello world :" << i << std::endl;
        sleep(1);
    }
    return 0;
}
```

`jobs`指令可以查看所有后台进程，`fg 任务号`可以把特点的进程提到前台。`ctrl + z`快捷键可以让进程暂停，前台进程无法被暂停，因为前台进程只有一个，暂停了就无法从键盘获取输入，就像电脑死机了一样，所以按下`ctrl + z`快捷键是让前台进程自动切换到后台暂停，使用`jobs`指令查看时会发现进程处于Stopped状态。使用`bg 任务号`可以让后台暂停状态的进程继续运行。

### 信号的发送与保存

张三在打游戏的时候收到了快递的消息，快递已送达至菜鸟驿站。张三没法中断游戏，选择稍后再处理快递，那么他就要自己记住有个快递在菜鸟驿站需要处理。同样的，进程收到信号后，不是立即处理的就要把信号记录下来，等到合适的时候再处理。进程的PCB里会记录收到的信号，使用一个整数按照位图的方式记录收到的信号，比如收到2号信号就把对应的比特位由0变为1等等。给进程发送信号就是是向目标进程写信号，本质是修改位图。修改位图需要进程的pid和信号编号，所以使用`kill`命令时需要带上进程pid和信号编号。  
进程PCB是操纵系统内核数据结构，只有操作系统可以修改，不管信号是如何产生的，在底层发送信号都是由操纵系统发送的，操纵系统也要提供发送信号的系统调用。`kill`命令也是一个可执行程序，本质就是调用了发送信号的系统调用。  
操作系统负责管理软硬件资源，`ctrl + c`快捷键先被操作系统获取到，然后再由操作系统给前台进程发送2号信号。

#### 系统调用发送信号
除了通过键盘发送信号，还可以使用系统调用来发送信号。
系统调用`kill()`可以用来给进程发送信号。
```c
#include <sys/types.h>
#include <signal.h>
int kill(pid_t pid, int sig);
```
参数`pid`就是进程pid，参数`sig`就是要发送的信号编号。


使用`raise()`可以用来给进程自己发送信号。
```c
#include <signal.h>
int raise(int sig);
```
参数`sig`就是要发送的信号，成功返回0，失败返回非0。`raise()`等价于`kill(getpid(), sig)`。


使用`abort()`可以用来给进程自己发送SIGABRT信号。
```c
#include <stdlib.h>
void abort(void);
```
`abort()`要求进程必须处理信号，发送SIGABRT信号给当前进程，通常导致进程终止并生成 `core dump`（除非信号被捕获且处理函数不返回）。







#### 实现mykill


我们可以实现一个自己的`mykill`程序来模拟`kill`命令。

```cpp
#include <iostream>
#include <string>
#include <sys/types.h>
#include <signal.h>

int main(int argc, char *argv[])
{
    if (argc != 3)
    {
        std::cerr << "用法: " << argv[0] << " <信号编号> <pid>" << std::endl;
        return 1;
    }

    int sig  = std::stoi(argv[1]);
    pid_t pid = std::stoi(argv[2]);

    if (kill(pid, sig) == -1)
    {
        perror("kill");
        return 1;
    }

    std::cout << "成功发送信号 " << sig << " 给进程 " << pid << std::endl;
    return 0;
}
```

### 信号的自定义处理

使用`signal()`系统调用可以自定义信号处理。

```c
#include <signal.h>

typedef void (*sighandler_t)(int);
sighandler_t signal(int signum, sighandler_t handler);
```
参数`signum`是要捕获或修改的信号编号，参数`handler`是指定对该信号的处理方式，有三种:
1. 用户自定义函数：一个接受 `int` 参数的函数指针，如 `void my_handler(int sig)`。
2. `SIG_IGN`：忽略该信号。
3. `SIG_DFL`：恢复该信号的默认处理动作。
成功则返回之前的信号处理函数指针，失败返回`SIG_ERR`


运行以下代码自定义`ctrl + c`快捷键发送的2号信号信号处理。
```cpp
#include <iostream>
#include <string>
#include <cstdlib>
#include <csignal>
#include <unistd.h>

// 信号处理函数（仅演示，非异步安全）
void handler(int sig) {
    std::cout << "获得了一个信号: " << sig << std::endl;
    std::exit(1);
}

int main() {
    // 注册信号处理函数
    std::signal(SIGINT,  handler);
    std::signal(SIGTERM, handler);

    std::cout << "程序已启动 (PID: " << getpid() << ")" << std::endl;
    std::cout << "按 Ctrl+C 发送 SIGINT，或执行 kill " << getpid() 
              << " 发送 SIGTERM" << std::endl;

    // 循环等待信号
    while (true) {
        pause();
    }
    return 0;
}
```

按下`ctrl + c`快捷键就会收到2号信号

```bash
user1@iZ2zeh5i3yddf3p4q4ueo7Z:~/sig$ ./sigtest 
程序已启动 (PID: 78365)
按 Ctrl+C 发送 SIGINT，或执行 kill 78365 发送 SIGTERM
^C获得了一个信号: 2
```


既然进程可以自定义信号处理，假如某个病毒进程把所有信号都自定义处理为不让进程终止，那这个病毒进程是不是就刀枪不入了？进程再刀枪不入也有弱点，9号信号`SIGKILL`无法被自定义处理，发送9号信号就能让进程终止。  
运行下面的模拟病毒代码。
```cpp
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>

void handlerSig(int sig)
{
    std::cout << "获得了一个信号：" << sig << std::endl;
}

int main()
{
    for (int i = 1; i < 32; i++) {
        signal(i, handlerSig);
    }
    int cnt = 0;
    while (true)
    {
    std::cout << "pid: " << getpid() << "  我是病毒进程，刀枪不入 :" << cnt++ << std::endl;
    sleep(1);
    }
}
```
使用`kill -9 pid`就能杀掉这个进程，9号信号`SIGKILL`和19号信号`SIGSTOP`无法自定义处理，发送9号信号`SIGSTOP`让进程终止，发送19号信号`SIGSTOP`让进程暂停并进入后台，可以使用`jobs`查看。






### 硬件异常发送信号
除了进程和系统调用可以发送信号，硬件异常也会发送信号。  
代码运行出错时往往会崩溃，比如尝试修改常量字符串，除0错误，访问野指针等等。
```cpp
#include <iostream>
#include <unistd.h>
#include <signal.h>
#include <sys/types.h>

void handlerSig(int sig)
{
    std::cout << "获得了一个信号：" << sig << std::endl;
    exit(1);
}

int main()
{
    for (int i = 1; i < 32; i++) {
        signal(i, handlerSig);
    }

    std::cout << "pid: " << getpid() << "  hello world :" << cnt << std::endl;
    //除0错误
    //int a = 10; a = a/0;  break;  
    //访问野指针
    //int *p=nullptr; int b =*p;  break;
    //修改常量字符串
    //char *ch ="helloworld"; *ch ='H';  break;

}
```
在编译命令中加入 -Wno-write-strings 即可忽略警告。  
除0错误会发送8号信号，访问野指针会发送11号信号，修改常量字符串也会发送11号信号。

> [!TIP]
> 使用`ps aux | grep 可执行文件名`来查看进程pid


信号都是由操纵系统发送的，当操纵系统发现进程犯错了就会发送对应的信号。进程是由CPU执行的，CPU里有许多部件，其中有一个状态寄存器，当出错时状态寄存器就会记录下来，操作系统根据状态寄存器记录的内容就能知道进程是否出错。CPU里还有CR3寄存器用来保存页表的物理地址，CPU里还有MMU，负责虚拟地址和物理地址的转换，当进程访问野指针时，页表上不存在对应的映射关系，那么MMU进行虚拟地址的和物理地址之间的转换失败了，MMU会进行硬件报错，操作系统知道MMU的报错后就给进程发送11号信号干掉进程。

---

待更新。。。