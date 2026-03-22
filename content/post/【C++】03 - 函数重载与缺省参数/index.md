---

date: 2026-03-22
lastmod: 2026-03-22
title: '【C++】03 - 函数重载与缺省参数'


tags:
  - 基础语法

categories:
  - C++
   

---


# 函数重载与缺省参数

## 缺省参数
C++ 允许在函数声明时为参数提供默认值。调用时如果没有传递该参数，就使用默认值。
这叫做缺省参数（也叫默认参数）。

**基本用法**
```cpp
#include <iostream>
using namespace std;

void greet(string name = "World") {
    cout << "Hello, " << name << "!" << endl;
}

int main() {
    greet();          // 输出 Hello, World!
    greet("Alice");   // 输出 Hello, Alice!
    return 0;
}
```

1. 缺省参数的位置规则

- 缺省参数必须从右向左连续设置，不能跳跃
```cpp
void f(int a, int b = 10, int c = 20);   // 正确
void f(int a = 10, int b, int c = 20);   // 错误，b 没有默认值却放在了中间
```
- 调用时，实参从左向右依次匹配，不能跳过缺省参数。
```cpp
f(5);      // a=5, b=10, c=20
f(5, 6);   // a=5, b=6, c=20
f(5, 6, 7);// a=5, b=6, c=7
```
2. 如果函数的声明和定义分开，缺省参数必须写在声明中，定义中不能再写缺省值。
```cpp
// 声明（放在头文件中或者其他位置）
void init(int size = 100);

// 定义（放在源文件中）
void init(int size) {
    // 实现代码
}
```










## 函数重载

在 C 语言中，同一个作用域里不允许出现两个同名的函数。  
但有时候，我们希望用同一个名字表达一组功能相似的操作，比如“加法”：

- 两个整数相加：`int add(int a, int b)`
- 两个浮点数相加：`double add(double a, double b)`

在 C 语言里，我们只能起不同的名字，比如 `add_int` 和 `add_double`，既不优雅，也不方便记忆。

C++ 允许我们在同一作用域中定义多个同名函数，只要它们的**参数列表不同**（参数个数、参数类型或参数顺序不同）。这就叫做**函数重载**。

### 重载的规则

重载函数必须满足以下条件之一：

1. 参数个数不同 
```cpp
void f() { /* ... */ }
void f(int a) { /* ... */ }
void f(int a, int b) { /* ... */ }
```

2. 参数类型不同
```cpp
int add(int a, int b) { return a + b; }
double add(double a, double b) { return a + b; }
```

3. 参数顺序不同
```cpp
void show(int a, char b) { /* ... */ }
void show(char b, int a) { /* ... */ }
```
> [!IMPORTANT]
> 注意：返回值类型不能作为重载的条件。因为调用时无法根据返回值类型判断应该调用哪个函数。
> ```cpp
>double f(int a) { /* ... */ }
>int f(int a) { /* ... */ }
>// 返回值类型不同不能作为重载
> ```
> 因此，设计重载时要注意避免这种歧义。








> [!WARNING]
> 如果两个函数参数个数相同，但一个使用了缺省参数，可能会造成二义性：
> ```cpp
>void f(int a) { /* ... */ }
>void f(int a, int b = 0) { /* ... */ }
>f(10);   // 错误！编译器不知道调用 f(int) 还是 f(int,0)
> ```
> 因此，设计重载时要注意避免这种歧义。
> 
> 



**示例：加法函数的重载**
```cpp
#include <iostream>
using namespace std;

int add(int a, int b) {
    cout << "int add" << endl;
    return a + b;
}

double add(double a, double b) {
    cout << "double add" << endl;
    return a + b;
}

int main() {
    cout << add(3, 5) << endl;      // 调用 int 版本add函数
    cout << add(3.14, 2.71) << endl; // 调用 double 版本add函数
    return 0;
}
```

