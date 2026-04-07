---

date: 2026-03-22
lastmod: 2026-03-24
title: '【C++】02 - 从[hello world]开始，走进C++核心概念与基础语法'


tags:
  - 基础语法

categories:
  - C++
---


# hello world如何运行



## C++ 版 Hello World

这是C++写法的hello world
```cpp
#include <iostream>  
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}
```

C++兼容C语言，可以使用继续使用C的写法输出hello world
```cpp
#include <stdio.h>
int main()
{
	printf("Hello, World!\n");
	return 0;
}
```


## 命名空间


### 命名空间的作用

想象一下：你正在开发一个大型项目，有多个团队同时写代码。

- 团队 A 定义了一个函数 log() 用来记录日志。
- 团队 B 也定义了一个函数 log() 用来计算对数。

在 C 语言里，这两个函数无法共存，链接时一定会报错。
为了避免这种冲突，C 程序员只能用各种“丑陋”的前缀，比如 teamA_log()、teamB_log()。
**命名空间**的出现，就是为了彻底解决这个问题。它允许你将一组变量、函数、类等放在一个独立的“盒子”里，让不同盒子中的同名标识符互不干扰。
`namespace`本质是定义出一个域，这个域跟全局域各自独立，不同的域可以定义同名变量，所以即使有同名的变量或函数，不在同一个域里就不会冲突了。
C++中域有函数局部域，全局域，命名空间域，类域；域影响的是编译时语法查找一个变量/函数/类型出处（声明或定义)的逻辑，所有有了域隔离，名字冲突就解决了。局部域和全局域除了会影响编译查找逻辑，还会影响变量的生命周期，命名空间域和类域不影响变量生命周期。
`namespace`只能定义在全局，当然他还可以嵌套定义。
### 命名空间的基本用法

使用关键字 `namespace` 后跟名字，然后用 `{}` 包裹成员，可以在域内定义对象，函数，自定义类型等：
```cpp
namespace teamA {
    int L=10;
    log()
    {
    std::cout <<teamA << std::endl;
    }
}
namespace teamB {
    int L=20;
    log()
    {
    std::cout <<teamB << std::endl;
    }
}
```

要访问命名空间内的成员，需要用 `::` 作用域解析运算符：

```cpp
int main() {
    std::cout <<teamA::L<<teamB::L << std::endl;   // 输出  10   20
    teamA::log();                               // 调用 teamA的log()
    return 0;
}
```




1. 命名空间可以嵌套
```cpp
namespace Outer {
    int a = 1;
    namespace Inner {
        int b = 2;
    }
}
// 访问
Outer::Inner::b;
```


2. 命名空间可以跨文件合并
    - 最终 `MyLib `包含 `func1` 和 `func2`
```cpp
// file1.cpp
namespace MyLib {
    void func1() { ... }
}
```
```cpp
// file2.cpp
namespace MyLib {
    void func2() { ... }
}
```


       


3. 可以为长命名空间起一个短别名
```cpp
namespace VeryLongNamespaceName { ... }
namespace VLN = VeryLongNamespaceName;
VLN::func();   // 等价于 VeryLongNamespaceName::func()
```


4. 当全局域和函数局部域有同名对象时，局部优先
```cpp
int a=0;
int main() {
    int a=10;
    std::cout <<a<< std::endl;   // 输出  10  
    return 0;
}
```




三种访问方式
```cpp
namespace MySpace {
    int value=666;
}
    int a = MySpace::value ;  //指定命名空间 
```

```cpp
namespace MySpace {
    int value=666;
    int abc=233;

}
using MySpace::value;
    int a = value ;  //只引入单个成员，避免全部展开 
    int b = value ; 
    int c = value ; 
    int d = MySpace::abc ; 

```

```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Hello" << endl;   // 省去了std::，但不推荐用于大型项目
    return 0;
}
```



### 标准库命名空间 std

C++ 标准库的所有内容都放在 `std` 命名空间中。
如果不加 std::，编译器会报错，因为它找不到 `cout` 这个标识符。
可以通过 `using namespace std`; 省去前缀，但大型项目慎用
```cpp
#include <iostream>
using namespace std;
int main() {
    cout << "Hello" << endl;   // 省去了std::，但不推荐用于大型项目
    return 0;
}
```



## iostream

`iostream` 是 Input/Output Stream 的缩写，意为“输入输出流”。

它定义了 C++ 中用于输入输出的核心对象和类，主要包括：
- `std::cin`：标准输入流对象`istream`（通常关联键盘）
- `std::cout`：标准输出流对象`ostream`（通常关联屏幕）







在 C 语言中，我们用 `printf` 输出，用 `scanf` 输入：
```c
#include <stdio.h>
int main() {
    int a;
    double b;
    printf("请输入一个整数和一个浮点数：");
    scanf("%d%lf", &a, &b);
    printf("你输入的是：%d 和 %f\n", a, b);
    return 0;
}
```

这里有几个不太方便的地方：

1. 必须使用 格式说明符（`%d`、`%lf` 等），如果写错了类型，结果会乱码甚至崩溃。
2. `scanf` 需要传递变量的地址（`&a`），初学者容易漏掉 `&`。
3. 输入输出语句写起来比较繁琐。

C++ 带来了更简洁、更安全的替代方案。


1. C++ 的标准输出流对象是 `std::cout`，配合流插入运算符 `<<` 使用：
```cpp
#include <iostream>
int main() {
    std::cout << "Hello, C++!" << std::endl;
    int age = 18;
    double height = 1.75;
    char grade = 'A';
    //可以连续输出多个数据，类型自动识别
    std::cout << "年龄：" << age << "，身高：" << height << "，等级：" << grade << std::endl;
    return 0;
}
```
`std::endl`：换行 + 刷新缓冲区  
`"\n"`：只换行，不刷新缓冲区
```cpp
std::cout << "第一行\n";          // 只换行
std::cout << "第二行" << std::endl; // 换行并刷新
```

2. `std::cin` 是标准输入流对象，配合流提取运算符 `>>` 使用：
```cpp
#include <iostream>
int main() {
    int a;
    double b;
    std::cin >> a >> b;   // 从键盘读取两个数
    std::cout << "a = " << a << ", b = " << b << std::endl;
    return 0;
}
```


`>>` 称为流提取运算符，从 `cin` 中提取数据存入变量。
同样可以连续输入多个变量，自动根据变量类型解析（空格、换行作为分隔符）




3. 在MSVC编译器下，没有包含`<stdio.h>`，也可以使用C语言的`printf`和`scanf`,在包含`<iostream>`间接包含了,其他编译器可能会报错
```cpp
#include <iostream>
int main()
{
	printf("Hello, World!\n");
	return 0;
}
```
## Hello World的运行
经过上面的学习，我们已经充分掌握了C++ 版的 Hello World 如何运行
```cpp
#include <iostream>     //包含头文件标准的输⼊、输出流库
int main() {
    std::cout << "Hello, World!" << std::endl; //标准输出流输出Hello, World!
    return 0;
}
```

