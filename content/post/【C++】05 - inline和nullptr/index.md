---

date: 2026-03-23T00:01:30+08:00
lastmod: 2026-03-23
title: '【C++】05 - inline和nullptr'


tags:
  - 基础语法

categories:
  - C++
   

---

# inline

## 什么是 `inline`？

在 C 语言中，如果要执行一个简单的操作（比如求两个数的最小值），通常有两种方式：

- 写一个函数：代码清晰，但每次调用都有函数调用开销（压栈、跳转、返回）。
- 写一个宏：没有调用开销，但宏很容易出错，且无法调试。

C++ 引入了 **`inline` 关键字**，用来向编译器发出“建议”：**将这个函数在调用处展开，而不是生成函数调用代码**。这样既能保持函数的清晰性，又可能获得宏一样的效率。

```cpp
inline int max(int a, int b) {
    return a > b ? a : b;
}
```
当编译器决定内联时，`max(3, 5)` 会直接替换为 `3 > 5 ? 3 : 5`，没有函数调用开销。

## inline 与宏的对比

宏（`#define`）在预处理阶段进行文本替换，虽然快，但存在诸多问题：
```cpp
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int main() {
    int x = 3, y = 5;
    int z = MAX(++x, y);   // 宏展开后：((++x) > (y) ? (++x) : (y))
    // x 被++两次，结果错误！
    return 0;
}
```
而 `inline` 函数是真正的函数，参数只求值一次，不会出现上述副作用，且支持类型检查、作用域、调试等。


## inline 只是建议，不是强制

编译器可以忽略 inline 建议。通常：

- 函数体较大、递归函数、或包含循环的函数，编译器不会内联。
- 函数定义在类内部的成员函数，会隐式成为 inline 候选（但编译器同样可以拒绝）。

```cpp
// 在类内定义的函数默认为 inline 候选
class A {
public:
    int getValue() { return value; }   // 隐式 inline
private:
    int value;
};
```

## inline 与声明/定义分离


`inline`不建议声明和定义分离到两个文件，分离会导致链接错误。因为`inline`被展开，就没有函数地址，链接时会出现报错。

> [!TIP]
> 现代 C++ 观点：`inline` 已经不再主要用于性能优化（编译器比人更懂何时内联），而是用于在头文件中定义函数，避免链接错误。尤其是当你想在头文件中实现非模板函数时，必须加上 `inline`，否则多个源文件包含会导致多重定义。
>


# nullptr

## `NULL` 的困扰

在 C 语言中，`NULL` 实际是⼀个宏，通常被定义为 `((void*)0) `或 `0`。在 C++ 中，为了避免类型转换问题，`NULL` 通常被定义为字面常量 `0`。这会导致一个尴尬的问题：
```cpp
void f(int x) { cout << "int" << endl; }
void f(int* p) { cout << "pointer" << endl; }

int main() {
    f(0);     // 调用 f(int)
    f(NULL);  // 本意想调用 f(int*)，但 NULL 是 0，实际调用 f(int)
    return 0;
}
```
这种歧义使得程序员无法通过 NULL 明确地调用指针版本的重载函数。

## `nullptr` 的诞生

C++11 引入了 nullptr，它是一个关键字，代表空指针常量。nullptr 可以隐式转换为任何指针类型，但不能转换为整数类型。
```cpp
void f(int x) { cout << "int" << endl; }
void f(int* p) { cout << "pointer" << endl; }

int main() {
    f(nullptr);   // 调用 f(int*)
    // int n = nullptr;   // 错误！不能转换为整数
    return 0;
}
```

`nullptr` 的优势：`nullptr` 只能转换为指针类型，避免误匹配整数重载。