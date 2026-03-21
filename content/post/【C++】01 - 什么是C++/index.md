---

date: 2026-03-21
lastmod: 2026-03-21
title: '【C++】01 - 什么是C++'

mermaid: true
math: true
tags:
  - 基础语法

categories:
  - C++
   

---


# C++入门


## C++的诞生


C++之父：Bjarne Stroustrup（比雅尼·斯特劳斯特鲁普）
1979年，Bjarne贝尔实验室（Bell Labs）工作，当时他正在研究分布式系统的仿真。他需要一种语言既能像C语言那样高效、底层，又能像Simula那样支持面向对象编程（Simula是第一个面向对象语言）。他的最初作品被称为 “带类的C”（C with Classes），后来在1983年正式改名为 C++

## C++的特点

C++之父Bjarne为C++制定了几个核心原则：
- 对C语言完全兼容：C语言是当时系统编程的事实标准，兼容C意味着可以复用海量的C代码和工具链。
- 零开销抽象：高级特性（如类、虚函数、模板）在编译后不应带来超出必要的手工代码的额外开销。
- 多种编程范式：C++既支持面向过程，也支持面向对象、泛型编程，后来还引入了函数式编程的元素。
- 不强迫使用任何特定特性：你只需要为你用到的特性付费（“你只用你需要的”）。


## 如何动手

C++文件的后缀为.cpp，C++兼容C，在Visual Studio（简称 VS）使用相同的工作流创建即可

## hello world

```cpp
#include<iostream>
int main()
{
    std::cout<<"hello world"<<endl;
    return 0;
}
```

这段代码会输出hello world