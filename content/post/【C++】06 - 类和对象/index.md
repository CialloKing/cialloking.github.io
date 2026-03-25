---

date: 2026-03-24
lastmod: 2026-03-26
title: '【C++】06 - 类和对象'


tags:
  - 基础语法
  - 类和对象

categories:
  - C++
   

---

# 类和对象

## 类的定义

### C 语言的结构体
C 语言的结构体只能包含数据：
```c
struct Student {
    char name[20];
    int age;
    int id;
};

void printStudent(const struct Student* s) {
    printf("姓名: %s, 年龄: %d, 学号: %d\n", s->name, s->age, s->id);
}

int main() {
    struct Student stu = {"张三", 18, 1001};
    printStudent(&stu);
    return 0;
}
```
不能包含函数，只能在其他地方定义

###  C++ 的类

C++中使用`class`作为定义类的关键字。
Student是类名，`{};`内定义类的内容,类体中内容称为类的成员：类中的变量称为类的属性或成员变量；类中的函数称为类的方法或者成员函数。一般情况下成员函数的定义在上面，成员变量的定义在下面。
为了方便区分成员变量，习惯上会在成员变量上加上标识符，比如在开头加上`_`或`m`,标识符不是必加的，只是为了方便使用，推荐加上。


```cpp
#include <iostream>
#include <string>
using namespace std;

class Student {
public:
    // 成员函数
    void setName(const string& name) { _name = name; }  //成员变量前加上了_，就容易区分_name = name中哪个是成员变量了
    void setAge(int age) { _age = age; }
    void setId(int id) { _id = id; }
    void print() const {
        cout << "姓名: " << _name << ", 年龄: " << _age << ", 学号: " << _id << endl;
    }

private:
    // 成员变量
    string _name;  //成员变量加上_方便区分
    int _age;
    int _id;
};

int main() {
    Student stu;
    stu.setName("张三");
    stu.setAge(18);
    stu.setId(1001);
    stu.print();
    return 0;
}
```
定义在类里面的函数默认内联`inline`,如果声明和定义分离则不默认内联。  
类定义了一个新的作用域，类的所有成员都在类的作用域中，在类体外定义成员时，需要使用::作用域操作符指明成员属于哪个类域。
类域影响的是编译的查找规则，下面程序中`setName`如果不指定类域`Student`，那么编译器就把`setName`当成全局函数，那么编译时，找不到`_name`等成员的声明/定义在哪里，就会报错。指定类域`Student`，就是知道`setName`是成员函数，当前域找不到的`_name`成员，就会到类域中去查找。
```cpp
class Student {  
public:

    void setName(const string& n);  //声明和定义分离则不默认内联

    void print() const {       //定义在类里面的函数默认内联
        cout << "姓名: " << _name  << endl;
    }
private:
    // 成员变量
    string _name;  
};

    //使用 :: 访问类域Student
    void Student::setName(const string& n)  
    {
     _name = n;
    }
```






C++中也可以使用`struct`定义类，`struct`中也可以定义成员函数了。


```cpp
struct Student {  
public:
    // 在C++中struct里也可以定义成员函数
    void setName(const string& n) { _name = n; }
    void print() const {
        cout << "姓名: " << _name  << endl;
    }
private:
    // 成员变量
    string _name;  
};
```


C语言中结构体名称不能代表类型，`struct`加上结构体名称才能代表类型
```c
struct ListNode {
    int val;
    //ListNode* next;  C语言中无法这样使用,编译不通过
    struct ListNode* next;
};
```
或者加上`typedef`
```c
typedef struct ListNode {
    int val;
    struct ListNode* next;  
}ListNode;
```


C++中可以支持这样做，同时也兼容C语言原来的写法
```cpp
struct ListNode {
    int val;
    ListNode* next;  //C++中两种方式都支持
    //struct ListNode* next;
};
```




### 访问限定符
C++一种实现封装的方式，用类将对象的属性与方法结合在一块，让对象更加完善，通过访问权限选择性的将其接口提供给外部的用户使用。
C++中类有三个访问限定符，分别为公有`public`，保护`protected`和私有`private`，一般情况下，我们将成员变量设为私有，通过公有的成员函数来访问和修改，这样可以控制数据的合法性。
在C语言的`struct`中，不通过指定的接口函数，也可以直接操作结构体`struct`里面的成员变量，可能会导致数据合法性问题，出现bug，在C++的类中，把成员变量设置为私有后，外面就访问不到了。
访问限定符的作用范围是从当前限定符开始到下一个访问限定符或者类的结尾`};`。
class定义成员没有被访问限定符修饰时默认为`private`，`struct`默认为`public`。
```cpp
class A {


    // class类没有访问限定符默认私有

public:
    // 公有成员（对外接口）
protected:
    // 保护成员（供派生类访问）
private:
    // 私有成员（仅本类内部访问）

public:
    // 公有成员，访问限定符public作用范围到类的结尾

};  // 注意分号

struct B {

    // struct类没有访问限定符默认公有

public:
    // 公有成员（对外接口）
protected:
    // 保护成员（供派生类访问）
private:
    // 私有成员（仅本类内部访问）

public:
    // 公有成员，访问限定符public作用范围到类的结尾

};
```

## 类的实例化

### 实例化的概念
一个类可以实例化出多个对象，实例化出的对象才占用实际的物理空间。
类的定义就像造房子的图纸，根据图纸可以造很多房子。就像,`int`和`char`可以创建出许多对象一样，`int`和`char`是C++的内置类型，我们定义出的类就是新的自定义类型，可以实例化出许多对象。
```cpp
class Student {  
public:

    void setName(const string& n) 
    {
     _name = n;
    }

    void print() const {       
        cout << "姓名: " << _name  << endl;
    }
private:
    string _name;  
};
int main()
{    
    Student A;  //实例化出A和B两个对象
    Student B;
    return 0;
}
```

### 对象大小
C语言中，对象大小只需要考虑成员对象，C++中多了成员函数，同一个类的对象使用的成员函数是相同的，如果每个对象都要再存储一份相同的成员函数指针是不是有些浪费空间，成员函数被编译后是一段指令，编译器在链接时就找到了成员函数指令储存的地址，不在运行时查找，只有动态多态是在运行时查找。

C++中类的对象大小只包含成员变量，不考虑成员函数，内存对齐逻辑和C语言的`struct`一样。
**内存对齐规则**
- 第一个成员在与结构体偏移量为0的地址处。
- 其他成员变量要对齐到某个数字（对齐数）的整数倍的地址处。注意：对齐数=编译器默认的一个对齐数与该成员大小的较小值。
- VS中默认的对齐数为8
- 结构体总大小为：最大对齐数（所有变量类型最大者与默认对齐参数取最小）的整数倍。
- 如果嵌套了结构体的情况，嵌套的结构体对齐到自己的最大对齐数的整数倍处，结构体的整体大小就是所有最大对齐数（含嵌套结构体的对齐数）的整数倍。


{{< details summary="为什么要内存对齐" >}}
CPU读取数据时不能从内存的任意位置开始读取，必须从整数倍位置开始读，如果不进行内存对齐CPU读取对象数据时就需要读取两次内存，再拼接数据，速度大幅下降。内存对齐的空间浪费实际上是在用空间换时间，如果提前设计好成员变量的位置和数量可以减少空间浪费。
{{< /details >}}


<!-- <details>
<summary>为什么要内存对齐</summary>
CPU读取数据时不能从内存的任意位置开始读取，必须从整数倍位置开始读，如果不进行内存对齐CPU读取对象数据时就需要读取两次内存，再拼接数据，速度大幅下降。内存对齐的空间浪费实际上是在用空间换时间，如果提前设计好成员变量的位置和数量可以减少空间浪费。
</details> -->


```cpp
class A {  
    char ch;
    int i;
};
```
类`A`中，`char`占1字节，`int`4字节比VS默认对齐数8小，所以`char`后面空3字节，整数倍对齐`int`，共占8字节，满足最大对齐数8的整数倍，不需要再填空字节，所以类A的1个对象占8字节。

```cpp
class B {  
};
B b;
```
类`B`中一个成员变量也没有，默认对象占1个字节，如果占0个字节，无法表示对象存在过,空类的大小为 1，是为了让对象有唯一地址。


##  this指针
所有成员对象用的都是同一个成员函数，函数体中没有关于不同对象的区分，成员函数是如何知道自己访问的是哪个成员对象？
- 编译器编译后，类的成员函数默认都会在形参第一个位置，增加一个当前类类型的指针，叫做`this`指针。 
- 比如`Student`类的`setName`的真实原型为，`void setName(Student* const this,const string& n)`
- 类的成员函数中访问成员变量，本质都是通过this指针访问的，如setName函数中给_name赋值，this->_name = n;
- C++规定不能在实参和形参的位置显示的写this指针（编译时编译器会处理），但是可以在函数体内显示使用this指针。
```cpp
class Student {  
public:

    void setName(const string& n) 
    {
    //this->_name = n;
     _name = n;   //通过this指针访问
    }

    void print() const {       
        cout << "姓名: " << _name  << endl;
    }
private:
    string _name;  
};
Student A;
Student B;

A.setName("张三");  //隐含了this指针
B.setName("李四");
A.print();
B.print();

```


> [!TIP]
> `this`指针不是存在对象里面的，是存在内存的栈区或根据编译器优化存在寄存器中
>


---

如果通过空指针调用成员函数，只要函数内没有访问成员变量（即没有使用 `this` 去解引用），程序不会崩溃。

```cpp
class A {
public:
    void Func() {
        cout << "Func called" << endl;   // 没有使用 this，可以正常运行
    }
    void Func2() {
        cout << _a << endl;   // 访问了成员变量，相当于 this->_a，会崩溃
    }
private:
    int _a;
};

int main() {
    A* p = nullptr;
    p->Func();   // 输出 "Func called"，正常运行
    p->Func2();  // 运行时崩溃（访问空指针）
    return 0;
}
```


## C++ 与 C 语言实现 Stack 对比

### C 语言实现 Stack
在 C 语言中，我们需要定义一个结构体来存储栈的数据，再编写一系列函数来操作这个结构体。使用时，必须显式地初始化结构体，并在使用结束后释放资源。
```c
#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdbool.h>

typedef int STDataType;

typedef struct Stack {
    STDataType* a;
    int top;
    int capacity;
} ST;

void STInit(ST* ps) {
    assert(ps);
    ps->a = NULL;
    ps->top = 0;
    ps->capacity = 0;
}

void STDestroy(ST* ps) {
    assert(ps);
    free(ps->a);
    ps->a = NULL;
    ps->top = ps->capacity = 0;
}

void STPush(ST* ps, STDataType x) {
    assert(ps);
    if (ps->top == ps->capacity) {
        int newcapacity = ps->capacity == 0 ? 4 : ps->capacity * 2;
        STDataType* tmp = (STDataType*)realloc(ps->a, newcapacity * sizeof(STDataType));
        if (tmp == NULL) {
            perror("realloc fail");
            return;
        }
        ps->a = tmp;
        ps->capacity = newcapacity;
    }
    ps->a[ps->top++] = x;
}

void STPop(ST* ps) {
    assert(ps);
    assert(ps->top > 0);
    ps->top--;
}

STDataType STTop(ST* ps) {
    assert(ps);
    assert(ps->top > 0);
    return ps->a[ps->top - 1];
}

bool STEmpty(ST* ps) {
    assert(ps);
    return ps->top == 0;
}


```
使用示例
```c
int main() {
    ST s;
    STInit(&s);          // 必须手动初始化
    STPush(&s, 1);
    STPush(&s, 2);
    STPush(&s, 3);
    while (!STEmpty(&s)) {
        printf("%d\n", STTop(&s));
        STPop(&s);
    }
    STDestroy(&s);       // 必须手动释放资源
    return 0;
}
```
C 语言实现的缺点：
- 数据和操作分离：结构体只存数据，函数独立于结构体，逻辑分散。
- 忘记初始化或释放：如果忘记调用 `STInit`，程序可能崩溃；忘记 `STDestroy` 会导致内存泄漏。
- 参数繁琐：每个函数都要传递结构体指针，代码重复。
- 封装性差：结构体的成员（如 `a`、`top`）完全暴露，外部可以直接修改，容易破坏栈的状态（例如直接修改 `top` 而不通过函数）。


### C++ 实现 Stack

C++ 利用类将数据和操作封装在一起，并通过构造函数和析构函数自动管理资源。
```cpp
#include <iostream>
#include <cstdlib>
#include <cassert>
using namespace std;

typedef int STDataType;

class Stack {
public:
    // 构造函数：初始化对象
    Stack(int n = 4) {
        _a = (STDataType*)malloc(sizeof(STDataType) * n);
        if (_a == nullptr) {
            perror("malloc fail");
            return;
        }
        _capacity = n;
        _top = 0;
    }

    // 析构函数：释放资源
    ~Stack() {
        free(_a);
        _a = nullptr;
        _top = _capacity = 0;
    }

    void Push(STDataType x) {
        if (_top == _capacity) {
            int newcapacity = _capacity * 2;
            STDataType* tmp = (STDataType*)realloc(_a, newcapacity * sizeof(STDataType));
            if (tmp == nullptr) {
                perror("realloc fail");
                return;
            }
            _a = tmp;
            _capacity = newcapacity;
        }
        _a[_top++] = x;
    }

    void Pop() {
        assert(_top > 0);
        _top--;
    }

    STDataType Top() const {
        assert(_top > 0);
        return _a[_top - 1];
    }

    bool Empty() const {
        return _top == 0;
    }

private:
    STDataType* _a;
    size_t _capacity;
    size_t _top;
};
```

使用示例

```cpp
int main() {
    Stack s;               // 自动调用构造函数初始化
    s.Push(1);
    s.Push(2);
    s.Push(3);
    while (!s.Empty()) {
        cout << s.Top() << endl;
        s.Pop();
    }
    // 离开作用域时，自动调用析构函数释放资源
    return 0;
}
```


C++中数据和函数都放到了类里面，通过访问限定符进行了限制，不能再随意通过对象直接修改数据，这是C++封装的一种体现，这个是最重要的变化。这里的封装的本质是一种更严格规范的管理，避免出现乱访问修改的问题。当然封装不仅仅是这样的，我们后面还需要不断的去学习。C++中有一些相对方便的语法，比如`Init`给的缺省参数会方便很多，成员函数每次不需要传对象地址，因为`this`指针隐含的传递了，方便了很多，使用类型不再需要`typedef`用类名就很方便。

## 类的默认成员函数

默认成员函数 是指用户没有显式定义时，编译器会自动生成的成员函数。
C++98 标准中，一个类有 6 个默认成员函数：
- 构造函数
- 析构函数
- 拷贝构造函数
- 赋值运算符重载
- 取地址运算符重载（普通版本）
- const 取地址运算符重载
C++11 之后又增加了两个：移动构造函数 和 移动赋值运算符

C++98 标准中6个默认成员函数中最重要的是，构造函数，析构函数，拷贝构造函数，赋值运算符重载。


## 构造函数

构造函数是特殊的成员函数，构造函数的主要任务不是开空间创建对象（我们常使用的局部对象是栈帧创建时，空间就开好了），而是对象实例化时初始化对象。构造函数的本质是要替代我们以前`Stack`类中写的`Init`函数的功能，构造函数自动调用的特点就完美的替代的了`Init`。

构造函数的特点：
1. 函数名与类名相同。
2. 无返回值。(返回值啥都不需要给，也不需要写void，不要纠结，C++规定如此)
3. 对象实例化时系统会自动调用对应的构造函数。
4. 构造函数可以重载。
5. 如果类中没有显式定义构造函数，则C++编译器会自动生成一个无参的默认构造函数，一旦用户显式定义编译器将不再生成。
6. 无参构造函数、全缺省构造函数、我们不写构造时编译器默认生成的构造函数，都叫做默认构造函数。但是这三个函数有且只有一个存在，不能同时存在。无参构造函数和全缺省构造函数虽然构成函数重载，但是调用时会存在歧义。要注意很多同学会认为默认构造函数是编译器默认生成那个叫默认构造，实际上无参构造函数、全缺省构造函数也是默认构造，总结一下就是不传实参就可以调用的构造就叫默认构造。
7. 我们不写，编译器默认生成的构造，对内置类型成员变量的初始化没有要求，也就是说是是否初始化是不确定的，看编译器。对于自定义类型成员变量，要求调用这个成员变量的默认构造函数初始化。如果这个成员变量，没有默认构造函数，那么就会报错，我们要初始化这个成员变量，需要用初始化列表才能解决。
   
> [!TIP]
> C++把类型分成内置类型（基本类型）和自定义类型。内置类型就是语言提供的原生数据类型，如：int/char/double/指针等，自定义类型就是我们使用class/struct等关键字自已定义的类型。


```cpp
class Date
{
public:
// 1.无参构造函数
 
// Date()
// {
// _year = 1;
// _month = 1;
// _day = 1;
// }
// // 2.带参构造函数
 
// Date(int year, int month, int day)
// {
// _year = year;
// _month = month;
// _day = day;
// }


// 3.全缺省构造函数
//写了全缺省就不需要写无参了，同时存在会构成函数重载歧义，同时也不需要写带参的了，全缺省可以完美代替
Date(int year = 1, int month = 1, int day = 1)
{
_year = year;
_month = month;
_day = day;
}
void Print()
{
cout << _year << "/" << _month << "/" << _day << endl;
}
private:
int _year;
int _month;
int _day;
};
```


```cpp
int main()
{
    Date A;             //调用无参构造，不需要写括号(),否则编译器无法区分这里是函数声明还是实例化对象
    Date B(1979,1,1);   //调用带参构造
}
```

```cpp
int main()
{                             
    Date C;            //无参构造，不需要写括号()
    Date D(1979,1,1); //全缺省构造函数，无参，带一半参数，全参数都可以应对
    Date E(1999); 

}
```

大多数情况构造函数需要自己实现，应写尽写，少数情况如实现两个栈实现一个队列时，可以使用编译器自动生成的构造函数。



## 析构函数

析构函数与构造函数功能相反，析构函数不是完成对对象本身的销毁，比如局部对象是存在栈帧的，函数结束栈帧销毁，他就释放了，不需要我们管，C++规定对象在销毁时会自动调用析构函数，完成对象中资源的清理释放工作。析构函数的功能类比我们之前`Stack`类实现的`Destroy`功能，而像`Date`没有`Destroy`，其实就是没有资源需要释放，所以严格说`Date`是不需要析构函数的。

析构函数的特点：
1. 析构函数名是在类名前加上字符~。
2. 无参数无返回值。(这里跟构造类似，也不需要加`void`)
3. 一个类只能有一个析构函数。若未显式定义，系统会自动生成默认的析构函数。
```cpp
//Date类
~Date()   //析构函数，在类名前加上字符~
{}        
```

4. 对象生命周期结束时，系统会自动调用析构函数。
```cpp
Stack ss; 
int main() {
    {
        Stack s;      // 构造
    }                 // 离开作用域，s 的析构函数自动调用
    Stack* p = new Stack;   // 构造
    delete p;                // 析构
    return 0;
}              //程序结束ss析构
```

1. 跟构造函数类似，我们不写编译器自动生成的析构函数对内置类型成员不做处理，自定义类型成员会调用他的析构函数。
2. 还需要注意的是我们显示写析构函数，对于自定义类型成员也会调用他的析构，也就是说自定义类型成员无论什么情况都会自动调用析构函数。
```cpp
class A{
~A(){}

Date _D;   //即使类A的析构什么都不处理，或者不写类A的析构，也会自动调用Date的析构
int _i;   
};      
```
7. 如果类中没有申请资源时，析构函数可以不写，直接使用编译器生成的默认析构函数，如`Date`；如果默认生成的析构就可以用，也就不需要显示写析构，如`MyQueue`；但是有资源申请时，一定要自己写析构，否则会造成资源泄漏，如`Stack`。
```cpp
//动态内存管理需要写析构
class String {
public:
    String(const char* s = "") {
        _data = new char[strlen(s) + 1];
        strcpy(_data, s);
    }

    ~String() {
        delete[] _data;   // 必须释放
    }

private:
    char* _data;
};    
```
```cpp
//文件操作需要写析构
class FileHandler {
public:
    FileHandler(const char* filename) {
        _file = fopen(filename, "r");
        if (!_file) throw runtime_error("open file failed");
    }

    ~FileHandler() {
        if (_file) fclose(_file);
    }
private:
    FILE* _file;
};  
```

8. 一个局部域的多个对象，C++规定后定义的先析构。
```cpp
{
Date D1;   
Date D2;   
}      //先析构D2再析构D1
```



## 拷贝构造函数

如果一个构造函数的第一个参数是自身类类型的引用，且任何额外的参数都有默认值，则此构造函数也叫做拷贝构造函数，也就是说拷贝构造是一个特殊的构造函数。
```cpp
class Date {
public:
    // 拷贝构造函数的声明
    Date(const Date& d);   // 参数为本类类型的 const 引用
    // ...
};
```
拷贝构造的特点：
1. 拷贝构造函数是构造函数的一个重载。 
2. 拷贝构造函数的第一个参数必须是类类型对象的引用，使用传值方式编译器直接报错，如果参数是传值（如 `Date d`），那么在传递实参时，又会调用拷贝构造函数，导致无限递归。因此，C++ 规定拷贝构造函数的第一个参数必须是引用，通常还加上 const 修饰，防止在拷贝过程中意外修改源对象。拷贝构造函数也可以多个参数，但是第一个参数必须是类类型对象的引用，后面的参数必须有缺省值。
```cpp
// 错误！会导致无穷递归
Date(const Date d);   // 传值，编译错误
// 正确
Date(const Date& d);  // 传引用
```
3. C++规定自定义类型对象进行拷贝行为必须调用拷贝构造，所以这里自定义类型传值传参和传值返回都会调用拷贝构造完成。
```cpp
//用已有对象初始化新对象
Date d2(d1);       // 拷贝构造
Date d3 = d1;      // 也是拷贝构造（等号在这里是初始化，不是赋值）

//函数传值传参
void func(Date d) { ... }
Date d1;
func(d1);   // 实参 d1 拷贝构造形参 d

//函数传值返回
Date func() {
    Date tmp;
    return tmp;   // 返回时拷贝构造一个临时对象
}
```
4. 若未显式定义拷贝构造，编译器会生成自动生成拷贝构造函数。自动生成的拷贝构造对内置类型成员变量会完成值拷贝/浅拷贝（一个字节一个字节的拷贝），对自定义类型成员变量会调用他的拷贝构造。
5. 像Date这样的类成员变量全是内置类型且没有指向什么资源，编译器自动生成的拷贝构造就可以完成需要的拷贝，所以不需要我们显示实现拷贝构造。像`Stack`这样的类，虽然也都是内置类型，但是`_a`指向了资源，编译器自动生成的拷贝构造完成的值拷贝/浅拷贝不符合我们的需求，所以需要我们自己实现深拷贝（对指向的资源也进行拷贝）。像`MyQueue`这样的类型内部主要是自定义类型`Stack`成员，编译器自动生成的拷贝构造会调用`Stack`的拷贝构造，也不需要我们显示实现`MyQueue`的拷贝构造。这里还有一个小技巧，如果一个类显示实现了析构并释放资源，那么他就需要显示写拷贝构造，否则就不需要。
```cpp
//当类中有指针成员指向动态内存时，默认拷贝构造的浅拷贝会带来严重问题
class Stack {
public:
    Stack(int n = 4) {
        _a = new int[n];
        _capacity = n;
        _top = 0;
    }
    ~Stack() { delete[] _a; }
    // 没有自定义拷贝构造
private:
    int* _a;
    size_t _capacity;
    size_t _top;
};

int main() {
    Stack s1;
    s1.Push(1);
    Stack s2 = s1;   // 默认拷贝构造，浅拷贝
    // s1 和 s2 的 _a 指向同一块内存
    // 析构时，先析构 s2，释放内存；再析构 s1，再次释放同一块内存 -> 崩溃！
}
```
```cpp
//对于有资源管理的类，必须自己实现 深拷贝：为每个对象分配独立的内存，并复制源对象的内容。
class Stack {
public:
    // 构造函数
    Stack(int n = 4) {
        _a = new int[n];
        _capacity = n;
        _top = 0;
    }

    // 深拷贝的拷贝构造
    Stack(const Stack& st) {
        // 为新对象分配同样大小的内存
        _a = new int[st._capacity];
        // 复制数据
        for (size_t i = 0; i < st._top; ++i) {
            _a[i] = st._a[i];
        }
        _top = st._top;
        _capacity = st._capacity;
    }

    // 析构函数
    ~Stack() {
        delete[] _a;
    }

    // 其他成员函数...
private:
    int* _a;
    size_t _capacity;
    size_t _top;
};
```


6. 传值返回会产生一个临时对象调用拷贝构造，传值引用返回，返回的是返回对象的别名（引用），没有产生拷贝。但是如果返回对象是一个当前函数局部域的局部对象，函数结束就销毁了，那么使用引用返回是有问题的，这时的引用相当于一个野引用，类似一个野指针一样。传引用返回可以减少拷贝，但是一定要确保返回对象，在当前函数结束后还在，才能用引用返回。
```cpp
// 传值返回：拷贝构造临时对象
Date getDate() {
    Date tmp(2024, 7, 5);
    return tmp;   // 拷贝构造临时对象,返回的是局部对象,必须采用传值返回
}

// 传引用返回：不拷贝，但要确保对象生命周期
Date& getDateRef(Date& d) {
    return d;     // 返回参数本身，没有拷贝
}
```



## 赋值运算符重载

### 运算符重载
在 C++ 中，运算符（如 `+`、`-`、`=`、`<<` 等）可以作用于内置类型。当我们需要让这些运算符也能用于**类类型**对象时，可以通过 运算符重载 来赋予它们新的含义。

运算符重载本质上是一个具有特殊名称的函数，函数名为 `operator` 后跟要重载的运算符（如` operator+`、`operator=`）。
它和其他函数一样，有返回类型、参数列表和函数体。


### 运算符重载的规则

- 参数个数：重载函数的参数个数与该运算符作用的运算对象数量相同。一元运算符有一个参数，二元运算符有两个参数。
- 如果重载为成员函数，则第一个运算对象通过隐式的 this 指针传递，因此参数比运算对象少一个。如果重载为全局函数，则参数个数与运算对象数量相同。
- 优先级和结合性：重载后，运算符的优先级和结合性保持不变。
- 不能创建新运算符：只能重载已有的运算符，不能发明新符号（如 operator@）。
- 不能重载的运算符（重要，常考）：
    - `.`（成员访问）
    - `.*`（成员指针访问）
    - `::`（作用域解析）
    - `?:`（三目运算符）
    - `sizeof`（长度运算符）
- 至少一个类类型参数：不能改变内置类型的运算符行为（如 `int operator+(int, int)` 非法）。

#### 重载哪些运算符有意义？
并不是所有运算符都需要重载。只有当运算符对类类型有明确语义时，才应该重载。
例如，对 `Date` 类重载 `-` 可以表示日期差，但重载 `+` 没有明确含义（日期加日期无意义）。
应根据类的设计需求，只重载那些自然且有意义的运算符。

#### 前置++ 与 后置++ 的重载
C++ 规定：
- 前置`++`：重载为 `operator++()`，无额外参数。
- 后置`++`：重载为 `operator++(int)`，其中 `int` 参数仅用于区分，实际调用时传递一个 `0`
```cpp
class Counter {
public:
    // 前置++
    Counter& operator++() {
        ++_value;
        return *this;   // 返回自身引用
    }

    // 后置++
    Counter operator++(int) {
        Counter tmp = *this;
        ++(*this);      // 复用前置++
        return tmp;     // 返回旧值
    }
private:
    int _value = 0;
};
```

#### 重载 << 和 >> 输入输出运算符
对于自定义类型，我们希望像内置类型一样使用 `<<` 和 `>>` 进行输入输出。
例如，我们可能希望 `cout << d1`; 输出日期。

如果重载为成员函数，函数原型为：`ostream& operator<<(ostream& out); // 成员函数`那么调用时将是 `d1 << cout`，不符合常规使用习惯（我们期望 `cout << d1`）。
因此，必须将 `<<` 和 `>>` 重载为全局函数，左侧参数为 `ostream&` 或 `istream&`，右侧参数为类类型对象。
```cpp
class Date {
public:
    // 需要将友元声明放在类内，以便访问私有成员
    friend ostream& operator<<(ostream& out, const Date& d);
    friend istream& operator>>(istream& in, Date& d);
    // ...
private:
    int _year, _month, _day;
};

// 全局重载 <<
ostream& operator<<(ostream& out, const Date& d) {
    out << d._year << "-" << d._month << "-" << d._day;
    return out;   // 返回 out 以支持连续输出
}

// 全局重载 >>
istream& operator>>(istream& in, Date& d) {
    in >> d._year >> d._month >> d._day;
    return in;
}
```


### 赋值运算符重载

#### 拷贝构造 vs 赋值重载

| 操作     | 拷贝构造函数                       | 赋值运算符重载             |
| -------- | ---------------------------------- | -------------------------- |
| 场景     | 用已有对象初始化新对象             | 两个已存在的对象之间赋值   |
| 对象状态 | 新对象尚未构造                     | 两个对象都已经构造完成     |
| 调用时机 | `Date d2(d1);` 或  `Date d2 = d1;` | `d1 = d2;`                 |
| 资源管理 | 分配新资源                         | 先释放旧资源，再分配新资源 |


```cpp
Date d1(2024, 7, 5);
Date d2(d1);   // 拷贝构造（初始化）
Date d3;
d3 = d1;       // 赋值重载（赋值）
```

#### 赋值运算符重载的特点

- 赋值运算符 = 必须重载为成员函数，不能是全局函数。它的函数名为 `operator=`。
- 参数通常写成 `const 类名&` 形式，避免传值传参时调用拷贝构造，同时 `const` 可以保护源对象不被修改。
- 返回 `*this` 的引用，可以支持连续赋值（如 `a = b = c`），同时避免不必要的拷贝，提高效率。
```cpp
Date& operator=(const Date& d);   // 正确
// Date operator=(const Date& d); // 可以，但会多一次拷贝
```

- 如果没有显式定义，编译器会自动生成一个默认的赋值运算符重载。默认行为与默认拷贝构造类似：
    - 对内置类型成员进行浅拷贝（逐字节复制）
    - 对自定义类型成员调用其赋值运算符


```cpp
class Date {
    int _year, _month, _day;
    string _note;   // 自定义类型
};
// 默认赋值运算符会逐字节复制 _year, _month, _day，并调用 _note 的赋值运算符
``` 

#### 浅拷贝的隐患
当类中有指针成员指向动态内存时，默认赋值运算符的浅拷贝会导致严重问题：
```cpp
class Stack {
public:
    Stack(int n = 4) {
        _a = new int[n];
        _capacity = n;
        _top = 0;
    }
    ~Stack() { delete[] _a; }
    // 没有自定义赋值运算符
private:
    int* _a;
    size_t _capacity;
    size_t _top;
};

int main() {
    Stack s1, s2;
    s1.Push(1);
    s2 = s1;        // 默认赋值：浅拷贝，s2._a 与 s1._a 指向同一块内存
    // 析构时，先析构 s2，释放内存；再析构 s1，再次释放同一块内存 -> 崩溃！
}
``` 
问题根源：浅拷贝只复制了指针的值，没有复制指针指向的内容。两个对象的 _a 指向同一块动态内存，析构时重复释放。

---

如果一个类显式定义了析构函数（意味着它管理资源），那么通常也需要显式定义拷贝构造函数和赋值运算符。
- 像 `Date` 这样所有成员都是内置类型且没有指向资源的类，不需要自定义。
- 像 `Stack` 这样有动态内存的类，必须自定义。
- 像 `MyQueue` 这样内部成员都是自定义类型且这些类型已实现深拷贝，编译器生成的默认赋值运算符会自动调用成员类的赋值运算符，因此不需要自定义。
  
```cpp
class MyQueue {
    Stack pushst;
    Stack popst;
};
// 默认生成的 MyQueue 赋值运算符会调用 Stack 的赋值运算符，如果 Stack 已正确实现，则 MyQueue 的赋值是安全的
``` 

## 取地址运算符重载

### const成员函数
在 C++ 中，我们可以定义 `const` 对象，表示该对象的数据不可修改。
但 `const` 对象只能调用那些承诺不会修改对象的成员函数。
如果一个成员函数没有声明为 `const`，编译器会认为它可能修改对象，因此不允许 `const` 对象调用。
为了能让 `const` 对象调用某些只读操作（如打印、获取属性），我们需要将这些成员函数声明为 `const`

将 `const` 关键字放在成员函数的参数列表之后、函数体之前,定义 `const` 成员函数：
```cpp
class Date {
public:
    // 声明为 const 成员函数，表示不会修改成员变量
    void Print() const {
        cout << _year << "-" << _month << "-" << _day << endl;
    }

    // 非 const 成员函数，可以修改成员
    void SetYear(int year) {
        _year = year;
    }

private:
    int _year, _month, _day;
};
``` 

---

在成员函数内部，有一个隐含的 `this` 指针指向当前对象,`const` 修饰的是 `this` 指针。
- 普通成员函数中，`this` 的类型是 `类名* const`，即指针本身是常量，但指向的内容可以修改。
- `const` 成员函数中，this 的类型是 `const 类名* const`，即指针本身是常量，且指向的内容也是常量，因此不能修改成员变量。
```cpp
// 非 const 成员函数，this 类型为 Date* const
void SetYear(int year) {
    this->_year = year;   // 可以修改
}

// const 成员函数，this 类型为 const Date* const
void Print() const {
    cout << this->_year;  // 只能读取，不能修改
    // this->_year = 2024; // 错误！不能修改
}
``` 

---

普通成员函数和 `const` 成员函数可以构成重载。
当通过 `const` 对象调用时，会调用 `const` 版本；通过非 `const` 对象调用时，会调用非 `const` 版本（如果存在）。
这允许我们为 `const` 和非 `const` 对象提供不同的行为。
```cpp
class Array {
public:
    // 非 const 版本，返回引用，允许修改元素
    int& operator[](size_t index) {
        return _data[index];
    }

    // const 版本，返回 const 引用，只读
    const int& operator[](size_t index) const {
        return _data[index];
    }

private:
    int _data[10];
};

int main() {
    Array arr;
    arr[0] = 10;           // 调用非 const 版本

    const Array carr;
    cout << carr[0];       // 调用 const 版本
    // carr[0] = 20;       // 错误，不能修改 const 对象
}
``` 


--- 

- `const` 成员函数内部不能调用非 `const` 成员函数（因为非 `const` 函数可能修改对象）。
- 非 `const` 成员函数可以调用 `const` 成员函数（权限缩小是安全的）。
- 如果成员变量是指针，`const` 成员函数保证指针本身不被修改，但不保证指针指向的内容不被修改（除非指针也指向 `const` 对象）。

```cpp
class A {
public:
    void ConstFunc() const {
        _ptr = nullptr;   // 错误！不能修改指针本身
        *_ptr = 10;       // 可以！指针指向的内容可以被修改（因为指针指向的是非 const int）
    }
private:
    int* _ptr;
};
``` 

### 取地址运算符重载

取地址运算符 `&` 也是一个可以重载的运算符。
编译器默认为每个类生成了两个版本的取地址运算符重载：
```cpp
class Date {
public:
    Date* operator&() { return this; }
    const Date* operator&() const { return this; }
};
``` 
这两个默认版本通常已经满足需求，我们很少需要自定义。


在某些特殊场景下，我们可能不希望外部代码获取到对象的真实地址，或者想在某些条件下返回不同的地址。
例如，单例模式中希望隐藏对象地址，或者某些调试场景下想要拦截取地址操作。
自定义取地址运算符的示例：
```cpp
class Secret {
public:
    // 永远返回 nullptr，让外界无法获取有效地址
    Secret* operator&() {
        return nullptr;
    }

    const Secret* operator&() const {
        return nullptr;
    }

private:
    int _data;
};

int main() {
    Secret s;
    Secret* p = &s;   // p 得到 nullptr
    // 无法通过 p 访问对象，但 s 本身仍然可以正常使用
}
``` 
注意：重载取地址运算符后，`&` 的行为就由我们定义，可能会破坏一些依赖地址的代码（如 `std::addressof` 函数）。
在实际开发中，几乎不需要重载它，除非有极特殊的需求（例如某些智能指针或代理类）。

## 初始化列表

### 初始化列表的写法

我们熟悉的构造函数写法，是在函数体内对成员变量赋值：
```cpp
class Date {
public:
    Date(int year, int month, int day) {
        _year = year;
        _month = month;
        _day = day;
    }
private:
    int _year, _month, _day;
};
``` 
这种方式下，成员变量先被默认初始化（内置类型不初始化，自定义类型调用默认构造），然后才在函数体内被赋值。
对于 `int` 等内置类型，这没有问题；但对于自定义类型，先默认构造再赋值，多了一次操作，效率稍低。

初始化列表是构造函数的一种特殊语法，在函数体执行**之前**对成员变量进行初始化。
它的形式是：在构造函数的参数列表后跟一个冒号，然后列出成员变量及其初始值，用逗号分隔。
```cpp
class Date {
public:
    // 初始化列表
    Date(int year, int month, int day)
        : _year(year), _month(month), _day(day)
    {
        // 函数体可以为空
    }
private:
    int _year, _month, _day;
};
``` 
**尽量使用初始化列表初始化**  
初始化列表是真正的初始化阶段，而函数体内的操作是赋值。
对于自定义类型成员，初始化列表直接调用其构造函数，避免了先默认构造再赋值的开销。  
无论是否显示写初始化列表，每个构造函数都有初始化列表；  
无论是否在初始化列表显示初始化成员变量，每个成员变量都要走初始化列表初始化。


### 必须使用初始化列表的场景

有些成员变量不能在函数体内赋值，必须放在初始化列表中初始化。主要包括以下三类：

1. 引用成员变量,引用必须在定义时初始化，不能先定义再赋值。因此，引用成员必须在初始化列表中初始化。
```cpp
class A {
public:
    A(int& ref) : _ref(ref) {}   // 必须使用初始化列表
private:
    int& _ref;
};
``` 
2. `const` 成员变量,`const` 变量必须在定义时初始化，不能在构造函数的函数体内赋值（因为函数体内的赋值是修改，而 `const` 不允许修改）。
```cpp
class B {
public:
    B(int n) : _n(n) {}   // 必须使用初始化列表
private:
    const int _n;
};
``` 
3. 没有默认构造函数的自定义类型成员,如果某个成员变量是类类型，且该类没有提供默认构造函数（无参构造），那么必须在初始化列表中显式调用其带参构造。
```cpp
class Time {
public:
    Time(int hour) : _hour(hour) {}   // 没有默认构造
private:
    int _hour;
};

class Date {
public:
    Date(int hour) : _t(hour) {}      // 必须用初始化列表初始化 _t
private:
    Time _t;
};
``` 
### 初始化列表的语法细节

1. 在初始化列表中，每个成员变量只能初始化一次，不能重复。
```cpp
class A {
public:
    A(int a, int b) : _a(a), _a(b) {}   // 错误！_a 重复初始化
private:
    int _a;
};
``` 
2. 成员变量的初始化顺序与它们在类中声明的顺序一致，与初始化列表中的顺序无关。因此，建议初始化列表的顺序与成员声明顺序保持一致，避免依赖顺序导致的错误。
```cpp
class C {
public:
    C(int a) : _b(a), _a(_b) {}   // 看起来 _b 先，_a 后
    void Print() { cout << _a << " " << _b << endl; }
private:
    int _a;   // 先声明
    int _b;   // 后声明
};

int main() {
    C c(5);
    c.Print();   // 输出：随机值 5       （_a 先初始化，此时 _b 还未初始化，_a = _b 是未定义行为）
    return 0;
}
``` 

3. 静态成员变量不属于某个对象，不能在初始化列表中初始化，必须在类外单独定义和初始化。
```cpp
class D {
public:
    static int _count;   // 声明
};
int D::_count = 0;       // 定义并初始化
``` 

### 成员变量声明时的缺省值（C++11）
C++11 允许在成员变量声明时直接给缺省值，这些缺省值会被用于那些没有在初始化列表中初始化的成员。
```cpp
class Date {
public:
    Date(int year) : _year(year) {}   // _month、_day 使用缺省值
private:
    int _year;
    int _month = 1;    // 缺省值
    int _day = 1;      // 缺省值
};
``` 
- 如果成员在初始化列表中显式初始化，则使用列表中的值。
- 否则，如果声明时有缺省值，则使用缺省值。
- 否则，内置类型成员不初始化（值随机），自定义类型成员调用默认构造函数（如果没有默认构造则报错）。

## 类型转换
C++支持内置类型隐式类型转换为类类型对象，需要有相关内置类型为参数的构造函数。构造函数前面加explicit就不再支持隐式类型转换。
类类型的对象之间也可以隐式转换，需要相应的构造函数支持。

### 内置类型 → 类类型对象的隐式转换
当类定义了单参数构造函数（或第一个参数有默认值的多参数构造函数）时，C++ 允许将内置类型隐式转换为该类的临时对象。
```cpp
class A {
public:
    A(int x) : _x(x) {}
private:
    int _x;
};

void func(A a) { /* ... */ }

int main() {
    A a1 = 10;      // 隐式转换：先用 10 构造一个临时 A 对象，再拷贝构造 a1（通常会被优化）
    func(20);       // 隐式转换：20 → A 临时对象，然后传递给 func
    return 0;
}
``` 

这种隐式转换在某些场景下非常方便，但也可能带来歧义或意外。例如：
```cpp
class String {
public:
    String(int size) { /* 分配 size 大小的字符串 */ }
    // ...
};

String s = 10;   // 本意是创建包含字符串 "10" 的对象，实际却创建了长度为 10 的字符串
``` 
为了禁止这种隐式转换，可以在构造函数前加上 `explicit` 关键字。
```cpp
class String {
public:
    explicit String(int size) { /* ... */ }
};

String s = 10;   // 错误！不能隐式转换
String s(10);    // 正确，显式调用
func(20);        // 错误！20 无法隐式转换为 String
``` 
C++11 之后，多参数构造函数也可以用于隐式转换，只要使用 `{}` 列表初始化。例如 `A a = {1, 2};`，这时 `explicit` 同样会阻止这种转换。

### 类类型对象 → 类类型对象的转换

两个不同的类之间也可以进行隐式转换，前提是目标类提供了以源类对象为参数的构造函数（或者源类提供了到目标类的转换运算符）。
```cpp
class B {
public:
    B() {}
    // 接受 A 对象的构造函数
    B(const class A& a) { /* 从 A 构造 B */ }
};

class A {
    // ...
};

void func(B b) {}

int main() {
    A a;
    B b = a;       // 隐式转换：a → B 临时对象，再拷贝构造 b
    func(a);       // 同样隐式转换
    return 0;
}
``` 
同样，`explicit` 可以阻止这种隐式转换。
```cpp
class B {
public:
    explicit B(const A& a) { /* ... */ }
};

B b = a;   // 错误！
B b(a);    // 正确，显式调用
``` 


## static 成员

### 静态成员变量

用 `static` 修饰的成员变量称为**静态成员变量**，具有以下特点
- 共享：静态成员变量不属于某个具体的对象，而是属于整个类，所有对象共享同一份数据。
- 存储位置：静态成员变量存放在静态存储区（也称全局区），不随对象的创建和销毁而改变。
- 初始化：静态成员变量必须在类外单独定义和初始化（不能在类内初始化，除非是 `const` 整型或 `constexpr`）。
- 访问方式：可以通过 类名::变量名 或 对象.变量名 访问（受访问限定符限制）。
- 生命周期：从程序启动到结束，与全局变量类似。

#### 定义与初始化
```cpp
class Counter {
public:
    static int count;   // 声明静态成员变量
};

// 类外定义并初始化
int Counter::count = 0;
``` 
注意：
- 类内声明时不能赋初值（除非是 `const static int` 或 `constexpr static`，C++17 起允许 `inline static` 在类内初始化）。
- 定义必须放在一个源文件中（通常与类实现放在一起），避免重复定义。


#### 访问方式
```cpp
#include <iostream>
using namespace std;

class Counter {
public:
    static int count;   // 静态成员变量
    Counter() { ++count; }
    ~Counter() { --count; }
};

// 类外定义
int Counter::count = 0;

int main() {
    cout << Counter::count << endl;   // 通过类名访问，输出 0
    Counter c1, c2;
    cout << Counter::count << endl;   // 输出 2
    cout << c1.count << endl;         // 通过对象访问，输出 2（推荐用类名访问）
    return 0;
}
``` 

### 静态成员函数

用 `static` 修饰的成员函数称为**静态成员函数**，具有以下特点
- 没有 `this` 指针：因此静态成员函数不能访问非静态成员变量和非静态成员函数（因为没有具体的对象）。
- 可以访问静态成员：可以访问类的静态成员变量和其他静态成员函数。
- 访问方式：同样可以通过 `类名::函数名` 或 `对象.函数名` 调用。
- 不受访问限定符限制：静态成员函数也受 `public/protected/private` 控制。

```cpp
#include <iostream>
using namespace std;

class Counter {
private:
    static int count;   // 私有静态成员
public:
    Counter() { ++count; }
    ~Counter() { --count; }
    static int getCount() { return count; }   // 静态成员函数，返回私有静态成员
};

int Counter::count = 0;

int main() {
    cout << Counter::getCount() << endl;   // 输出 0
    Counter c1, c2;
    cout << Counter::getCount() << endl;   // 输出 2
    // cout << Counter::count << endl;     // 错误！count 是私有成员
    return 0;
}
``` 


静态成员函数中不能访问非静态成员
```cpp
class Test {
    int x;
    static int y;
public:
    static void func() {
        // x = 10;      // 错误！不能访问非静态成员
        y = 20;         // 正确，可以访问静态成员
    }
};
``` 


## 友元
考虑一个简单的场景：有两个类 `Point` 和 `Line`，`Line` 需要计算两个 `Point` 之间的距离，而距离公式需要直接访问 `Point` 的 x 和 y 坐标。如果将这些坐标设为私有，`Line` 就只能通过公有接口获取，可能不够高效或方便。  
友元提供了一种突破类访问限定符封装的方式，让某些外部函数或类能够直接访问私有成员，同时仍然对其他外部代码保持隐藏。友元分为：友元函数和友元类，在函数声明或者类声明的前面加`friend`，并且把友元声明放到一个类的里面。

### 友元函数
友元函数是一个普通函数（不是类的成员函数），它被声明在类的内部，但可以访问该类的私有和保护成员。
在类内使用 `friend` 关键字声明一个外部函数
```cpp
class A {
private:
    int data;
public:
    friend void showData(const A& a);   // 声明友元函数
};

void showData(const A& a) {
    cout << a.data << endl;   // 可以访问私有成员
}
``` 

- 友元函数可以在类定义的任何地方声明（不受访问限定符影响）。
- 友元函数不是类的成员，因此没有 `this` 指针。
- 友元函数可以是一个全局函数，也可以是另一个类的成员函数
- 一个函数可以是多个类的友元函数。


示例：友元函数计算距离
```cpp
#include <iostream>
#include <cmath>
using namespace std;

class Point {
private:
    double x, y;
public:
    Point(double x = 0, double y = 0) : x(x), y(y) {}
    // 声明友元函数
    friend double distance(const Point& p1, const Point& p2);
};

// 友元函数定义
double distance(const Point& p1, const Point& p2) {
    double dx = p1.x - p2.x;
    double dy = p1.y - p2.y;
    return sqrt(dx*dx + dy*dy);
}

int main() {
    Point a(0, 0), b(3, 4);
    cout << "距离: " << distance(a, b) << endl;   // 输出 5
    return 0;
}
``` 


### 友元类
一个类可以将另一个类声明为它的友元，这样友元类的所有成员函数都可以访问本类的私有和保护成员。
```cpp
class A {
    friend class B;   // 声明 B 是 A 的友元类
private:
    int secret;
};

class B {
public:
    void showA(const A& a) {
        cout << a.secret << endl;   // 可以访问 A 的私有成员
    }
};
``` 
- 友元关系是单向的：如果 `A` 是 `B` 的友元，`B` 不一定是 `A` 的友元。
- 友元关系不能传递：如果 `A` 是 `B` 的友元，`B` 是 `C` 的友元，但 `A` 不是 `C` 的友元。
- 友元类中的成员函数都可以是另一个类的友元函数，都可以访问另一个类中的私有和保护成员。


除了将整个类设为友元，也可以仅将另一个类的某个成员函数设为友元。这样该成员函数就能访问本类的私有成员，而其他成员函数不行。
```cpp
class A {
private:
    int data;
public:
    friend void B::func(const A&);   // 仅将 B 的 func 设为友元
};

class B {
public:
    void func(const A& a) { cout << a.data << endl; }
    void other(const A& a) { /* 不能访问 a.data */ }
};
``` 

---

友元会增加耦合度，破坏了封装，所以友元不宜多用。


## 内部类

### 什么是内部类
内部类是指定义在另一个类内部的类。它本身是一个独立的类，只是其作用域被限定在外部类中，并受外部类的访问限定符控制。
```cpp
class Outer {
public:
    class Inner {   // 内部类
    public:
        void show() { cout << "Inner" << endl; }
    };
};
``` 
- 内部类与外部类是相互独立的，外部类对象中不包含内部类的成员（内部类对象需要单独创建）。
- 内部类只是“寄生”在外部类的域中，它的访问权限受外部类的 `public`、`protected`、`private` 影响。


### 内部类的特性

1. 内部类是一个独立的类型，它可以在外部类的作用域外被使用，但需要通过外部类的作用域限定符来访问,如果内部类定义在外部类的 `private` 区域，则外部无法访问该类型。
2. 内部类可以访问外部类的 静态成员，但不能直接访问非静态成员（因为没有外部类对象的实例）。不过，内部类可以通过外部类对象或指针来访问外部类的非静态成员，前提是这些成员是 `public` 或内部类被声明为外部类的友元。
3. 内部类默认是外部类的友元类。也就是说，内部类的成员函数可以访问外部类的私有和保护成员，即使外部类的这些成员是 `private` 的。反过来，外部类不能直接访问内部类的私有成员（除非内部类将外部类声明为友元）。这种单向访问关系符合封装原则。

## 匿名对象

匿名对象是指直接使用 `类名(实参)` 创建的临时对象，没有变量名。它的生命周期仅存在于创建它的那一行表达式（或语句）中，执行完该行后立即被销毁。
```cpp
Date(2024, 7, 5);   // 匿名对象，没有名字
Date d(2024, 7, 5);   // 有名对象，生命周期到作用域结束
``` 

匿名对象常用来直接传递给函数，避免先声明一个变量再传递。
```cpp
void func(const A& a) {
    a.show();
}

int main() {
    func(A(30));   // 传递匿名对象
    return 0;
}
``` 
此时，匿名对象的生命周期会延长到函数调用结束（绑定到 `const` 引用时，生命周期会延长到引用销毁为止）。

## 对象拷贝时的编译器优化

现代编译器会为了尽可能提高程序的效率，在不影响正确性的情况下会尽可能减少一些传参和传返回值的过程中可以省略的拷贝。
```cpp
A makeA() {
    A a;
    return a;
}
int main() {
    A obj = makeA();
    return 0;
}
``` 

如果没有任何优化，执行过程可能是：

1. `makeA` 中构造局部对象 `a`。
2. 返回时拷贝构造一个临时对象（返回值）。
3. 在 `main` 中，再用临时对象拷贝构造 `obj`。
4. 随后销毁临时对象和 `a`。


当前新一些的编译器会省略中间的临时对象，最新的编译器会进行三合一操作
在VS2026环境下运行以下代码
```cpp
#include<iostream>
using namespace std;
class A
{
public:
    A(int a = 0)
        :_a1(a)
    {
        cout << "A(int a)" << endl;
    }
    A(const A& aa)
        :_a1(aa._a1)
    {
        cout << "A(const A& aa)" << endl;
    }
    A& operator=(const A& aa)
    {
        cout << "A& operator=(const A& aa)" << endl;
        if (this != &aa)
        {
            _a1 = aa._a1;
        }
        return *this;
    }
    ~A()
    {
        cout << "~A()" << endl;
    }
private:
    int _a1 = 1;
};

A makeA() {
    A a;
    return a;
}
int main() {
    A obj = makeA();
    return 0;
}
``` 
得到输出结果

```
A(int a)
~A()
``` 

可以看出，VS2026 省略了局部对象 `a` 和返回值临时对象的拷贝构造，将 `a` 直接构造到 `obj` 中，提高了效率。


如果在未启用拷贝省略优化（例如 g++ -fno-elide-constructors）的情况下，则会输出
```
A(int a)
A(const A& aa)
~A()
A(const A& aa)
~A()
~A()
``` 
可以看见调用了三次构造，构造了三个对象。


## 小练习：日期类的实现



经过了上面的学习，我们现在可以实现一个自己的日期类。

### 日期类的成员变量
分别设置年月日，设置为私有，前面加上_方便区分。
```cpp
class Date
{
	private:
		int _year;
		int _month;
		int _day;
};
``` 

### 日期类的成员函数
日期类的所有成员函数可以都设置为公有 `public`

####  默认构造
全缺省默认构造函数，尽量使用显式设置初始化列表。
```cpp
		Date(int year = 1970, int month = 1, int day = 1)
			:_year(year)
			, _month(month)
			, _day(day)
		{
		}
``` 


但是这个构造函数有个问题，没有检查日期的有效性，比如 `(2000,13,32)` 也可以正确初始化，显然正常的一年既没有13个月也没有哪个月有32天，我们需要检查日期是否正确。
`GetMonthDay` 函数用于返回相应月份的天数，2月在闰年有29天，需要额外检查；闰年4年一润，若是整百年则判断能否被400整除。
```cpp
int GetMonthDay(int year,int month) 
{
	assert(month > 0 && month <= 12);                //断言判断月份是否在1~12之间
	static int monthDay[13] = { 0,31,28,31,30,31,30,31,31,30,31,30,31 };  //将1~12月的天数填入数组，因为查找月份天数的操作非常频繁，所以数组设置为静态，避免每次查找时构建，提高效率
	if (month==2&&((year%4==0&&year%100!=0)||year%400==0))  //优先判断是不是2月，如果不是就不用再走后面的判断逻辑，
	{
		return 29;
	}
	return monthDay[month];
}
``` 
判断日期是否合法，若合法则返回 `true`,不合法返回 `false`
```cpp
		bool checkDate() const  //不涉及修改对象，加上const防止代码写错意外修改
		{
			if (_month < 1 || _month>12)    //判断月份是否在1~12之间
			{
				return false;
			}
			if (_day < 1 || _day>GetMonthDay(_year, _month))   //判断传入日期是否在相应月份的正常范围之间
			{
				return false;
			}
			return true;
		}
``` 


这时我们再修改构造函数，当构建出的是非法日期时就在屏幕上打印输出信息。
```cpp
		Date(int year = 1970, int month = 1, int day = 1)
			:_year(year)
			, _month(month)
			, _day(day)
		{
			if (!checkDate())
			{
				cout << "非法日期" << endl;
				print();
				cout << "------" << endl;

			}
		}
``` 

#### 拷贝构造
日期类的成员变量全是内置类型，可不写，使用编译器默认生成的拷贝构造，为了练习在这里展示一下。
传入另一个日期类的引用，形参使用`const`引用，这样`const`引用和非`const`引用都能正常调用
```cpp
		Date(const Date& d)
		{
			_year = d._year;
			_month = d._month;
			_day = d._day;
		}
``` 

#### 赋值运算符重载
日期类的成员变量全是内置类型，可不写，使用编译器默认生成的赋值重载，为了练习在这里展示一下。
```cpp
		Date& operator= (const Date& d2)
		{
			_year = d2._year;
			_month = d2._month;
			_day = d2._day;
			return *this;
		}
``` 

#### 打印函数以及<<重载

这是在类里面的打印函数，可直接使用对象.print()调用。
```cpp
		void print() const
		{
			cout << _year << "-" << _month << "-" << _day << endl;
		}
``` 


由于成员函数的参数隐含了`this`指针，并且无法修改位置，抢占了`ostream`的位置，如果在类内实现的话使用时就需要像 `日期类对象<<cout` 这样使用,不符合使用习惯，所以<<重载函数在类外实现，并在类里面加上友元声明，使得<<重载可以访问私有成员。
```cpp
class Date
{
	friend ostream& operator<<(ostream& out, const Date& d);   //加入友元声明
};


ostream& operator<<(ostream& out, const Date& d)
{
	out << d._year << "-" << d._month << "-" << d._day;
	return out;
}
``` 


#### 日期相关增减运算符重载

##### 日期+=天数
例如`d1 += 10`,
传入正数正常执行，传入负数则调用``-=``处理。  
先直接增加`_day`,然后判断是否大于当前月的最大天数，若大于则减去当月最大天数，月份+1，加到13月则年份+1，进入下一年1月，一直循环到日期合法。
```cpp
		Date& operator+= (int day)
		{
			if (day <0)
			{
				return *this -= (-day);
			}
			_day += day;
			while (_day>GetMonthDay(_year,_month))
			{
				_day -= GetMonthDay(_year, _month);
				_month++;
				if (_month==13)
				{
					_month = 1;
					_year++;
				}
			}
			return *this;
		}
``` 

##### 日期+天数
例如`d2 = d1 + 10`,
日期`+`天数使用传值返回，复用`+=`的代码，为了避免意外bug代码修改`this`指针指向的对象`d1`，函数后加上`const`。
```cpp
		Date operator+ (int day)const
		{
			Date temp = *this;
			temp += day;
			return temp;
		}
``` 
理论上实现完整的日期`+`天数也可以给`+=`重载复用，但是`+`重载需要创建临时变量，`+=`重载不需要，所以`+=`重载运行效率更高，`+`重载复用`+=`更好。


##### 日期 -= 天数
例如`d1 -= 10`,
具体实现和+=类型，_day先直接减去对应的天数，若_day为负数，则月份-1，若月份为0，则年份-1，然后_day+=当前月份的天数，一直循环至_day为正数。
```cpp
		Date& operator-= (int day)
		{
			if (day < 0)
			{
				return *this += (-day);
			}
			_day -= day;
			while (_day <= 0)
			{
				_month--;
				if (_month == 0)
				{
					_month = 12;
					_year--;
				}
				_day += GetMonthDay(_year, _month);
			}
			return *this;
		}
``` 

##### 日期 - 天数
例如`d2 = d1 - 10`,
实现逻辑和+重载类似。
```cpp
		Date operator- (int day)const
		{
			Date temp = *this;
			return temp -= day;
		}
``` 

##### 日期前置和后置++
为了区分前置`++`和后置`++`，通过在后置`++`参数列表加上`int`区分，这个`int`实际上不需要传入参数。  
前置`++`直接给`*this+=1`,不需要创建临时对象，后置`++`为了返回`++`前的值，需要一个临时对象保持`++`前的值，所以这里实现的日期类前置`++`效率比后置`++`高。
```cpp
		Date& operator++ ()
		{
			*this += 1;
			return *this;
		}

		Date operator++ (int)  //后置++在参数列表加上int
		{
			Date temp = *this;
			*this += 1;
			return temp;
		}
``` 
##### 日期前置和后置--
具体逻辑与++重载类似。
```cpp
		Date& operator-- ()
		{
			*this -= 1;
			return *this;
		}

		Date operator-- (int)  //后置--在参数列表加上int
		{
			Date temp = *this;
			*this -= 1;
			return temp;
		}
``` 


#### 日期大小关系比较运算符重载
`>,>=,<,<=，==,!=,`这6个运算符只需要实现两个就可以了，其他符号可以复用实现好的两个。关系判断都不需要修改对象的内容，所以后面全部加上`const`。
##### ==重载
直接判断年月日是否相等。
```cpp
		bool operator== (const Date& d2)const
		{
			return _year == d2._year && _month == d2._month && _day == d2._day;
		}
``` 

##### !=重载
复用`==`
```cpp
    bool operator!=(const Date& d) const
    {
    	return !(*this == d);
    }
``` 


##### <重载

按照年月日的顺序依次判断，全部小于就返回`true`，否则返回`false`。
```cpp
		bool operator< (const Date& d2)const
		{
			if (_year < d2._year)
				return true;
			else if (_year == d2._year && _month < d2._month)
				return true;
			else if (_year == d2._year && _month == d2._month && _day < d2._day)
				return true;
			else
				return false;
		}
```

##### <=重载
```cpp
		bool operator<= (const Date& d2)const
		{
			return *this < d2 || *this == d2;
		}
```

##### >重载
```cpp
		bool operator> (const Date& d2)const
		{
			return!(*this <= d2);
		}
```
##### >=重载
```cpp
		bool operator>= (const Date& d2)const
		{
			return !(*this < d2);
		}
```




#### 日期 - 日期
例如`int i = d1 - d2`,
日期 - 日期，可以得到两个日期相差的天数，日期 + 日期没有实际意义，不需要实现。  

这里先判断传入的两个日期的大小关系，若`d1`大于`d2`，则`flag = 1`，反之`flag = -1`，让小的日期一直++，直到和大的相等，++的次数就是相差的天数，最后再乘`flag`得到正负。
```cpp
		int operator- (const Date& d2)const
		{
			int flag = 1;
			Date max = *this;
			Date min = d2;
			if (max<min)
			{
				max = d2;
				min = *this;
				flag = -1;
			}
			int days = 0;
			while (min<max)
			{
				min++;
				++days;
			}
			return days * flag;
		}
``` 


### 日期类完整示例
```cpp
class Date
{
	friend ostream& operator<<(ostream& out, const Date& d);  //友元函数可以在类定义的任何地方声明，不受类访问限定符限制。
	public:
    int GetMonthDay(int year,int month) 
    {
    	assert(month > 0 && month <= 12);                //断言判断月份是否在1~12之间
    	static int monthDay[13] = { 0,31,28,31,30,31,30,31,31,30,31,30,31 };  //将1~12月的天数填入数组，因为查找月份天数的操作非常频繁，所以数组设置为静态，避免每次查找时构建，提高效率
    	if (month==2&&((year%4==0&&year%100!=0)||year%400==0))  //优先判断是不是2月，如果不是就不用再走后面的判断逻辑，
    	{
    		return 29;
    	}
    	return monthDay[month];
    }


		bool checkDate() const
		{
			if (_month < 1 || _month>12)    //判断月份是否在1~12之间
			{
				return false;
			}
			if (_day < 1 || _day>GetMonthDay(_year, _month))   //判断传入日期是否在相应月份的正常范围之间
			{
				return false;
			}
			return true;
		}

		Date(int year = 1970, int month = 1, int day = 1)
			:_year(year)
			, _month(month)
			, _day(day)
		{
			if (!checkDate())
			{
				cout << "非法日期" << endl;
				print();
				cout << "------" << endl;

			}
		}

    //拷贝构造，可不写，使用编译器默认生成的效果相同
		Date(const Date& d)
		{
			_year = d._year;
			_month = d._month;
			_day = d._day;
		}
    //赋值重载，可不写，使用编译器默认生成的效果相同
		Date& operator= (const Date& d2)
		{
			_year = d2._year;
			_month = d2._month;
			_day = d2._day;
			return *this;
		}

		void print() const
		{
			cout << _year << "-" << _month << "-" << _day << endl;
		}

		Date& operator+= (int day)
		{
			if (day <0)
			{
				return *this -= (-day);
			}
			_day += day;
			while (_day>GetMonthDay(_year,_month))
			{
				_day -= GetMonthDay(_year, _month);
				_month++;
				if (_month==13)
				{
					_month = 1;
					_year++;
				}
			}
			return *this;
		}

		Date operator+ (int day)const
		{
			Date temp = *this;
			temp += day;
			return temp;
		}

		Date& operator-= (int day)
		{
			if (day < 0)
			{
				return *this += (-day);
			}
			_day -= day;
			while (_day <= 0)
			{
				_month--;
				if (_month == 0)
				{
					_month = 12;
					_year--;
				}
				_day += GetMonthDay(_year, _month);
			}
			return *this;
		}

		Date operator- (int day)const
		{
			Date temp = *this;
			return temp -= day;
		}

		Date& operator++ ()
		{
			*this += 1;
			return *this;
		}

		Date operator++ (int)  //后置++在参数列表加上int
		{
			Date temp = *this;
			*this += 1;
			return temp;
		}

		Date& operator-- ()
		{
			*this -= 1;
			return *this;
		}

		Date operator-- (int)  //后置--在参数列表加上int
		{
			Date temp = *this;
			*this -= 1;
			return temp;
		}

		bool operator== (const Date& d2)const
		{
			return _year == d2._year && _month == d2._month && _day == d2._day;
		}

    bool operator!=(const Date& d) const
    {
    	return !(*this == d);
    }

		bool operator< (const Date& d2)const
		{
			if (_year < d2._year)
				return true;
			else if (_year == d2._year && _month < d2._month)
				return true;
			else if (_year == d2._year && _month == d2._month && _day < d2._day)
				return true;
			else
				return false;
		}

		bool operator<= (const Date& d2)const
		{
			return *this < d2 || *this == d2;
		}

		bool operator> (const Date& d2)const
		{
			return!(*this <= d2);
		}

		bool operator>= (const Date& d2)const
		{
			return !(*this < d2);
		}

		int operator- (const Date& d2)const
		{
			int flag = 1;
			Date max = *this;
			Date min = d2;
			if (max<min)
			{
				max = d2;
				min = *this;
				flag = -1;
			}
			int days = 0;
			while (min<max)
			{
				min++;
				++days;
			}
			return days * flag;
		}

	private:
		int _year;
		int _month;
		int _day;
};

ostream& operator<<(ostream& out, const Date& d)
{
	out << d._year << "-" << d._month << "-" << d._day;
	return out;
}

``` 


