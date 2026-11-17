---
title: "STL库总结"
published: 2023-05-11
publishedAt: 2023-05-11T21:54:00+08:00
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

这个东西还蛮重要的。。。就是在考场上正解想不出来，打暴力需要用一些工具这时又发现忘了怎么用了，这就很尴尬了。。。
# 1.set
实用性很高，所以放最前面啦~
> set 内部通常采用红黑树实现。平衡二叉树的特性使得 set 非常适合处理需要同时兼顾查找、插入与删除的情况。
——摘自OI wiki

set 中的元素默认从小到大自动排序，但比起堆来支持的操作更多。
其中 multiset 支持插入重复数字，而 set 不能，除此以外操作基本相同。
## 指针
定义是这样式儿的：
```cpp
set<int>::iterator it1;
multiset<int>::iterator it2;
set<pair<int,int> >::iterator it3;
```
支持 * 解除引用（就是将指针变为指针指向的东西）
```cpp
it=s.lower_bound(val);
int x=*it;
```
set 的迭代器为**双向访问迭代器** ，指针仅可以左移或右移（也就是 ++ 或 --），会移到从小到大排序该数的上/下一个，时间复杂度 $O(\log n)$。
```cpp
it=--s.lower_bound(val);
```
## 函数
### begin()/end()
`begin()` 返回首元素的迭代器，也就是指向首元素的指针，s.begin() 就是集合中最小的一个。

但由于 set 是左闭右开的，`end()` 返回的便是**尾元素再向后一位的位置**，或者说集合中最大元素的下一个位置的迭代器（*引自算阶*），也就是说是没有元素的，使用要注意。

`rbegin()` 与 `rend()` 是指向**逆向数组**的迭代器，通俗讲 rbegin() $\approx$ end()，rend() $\approx$ begin()。~~然并卵~~

> rbegin() 返回指向逆向数组的首元素的逆向迭代器，可以理解为正向容器的末元素。

> rend() 返回指向逆向数组末元素后一位置的迭代器，对应容器首的前一个位置，没有元素。

>——引自 OI wiki

函数名前加 c 为**只读迭代器**，通常情况下是等义的，例如 begin() $=$ cbegin()，end() $=$ cend()，但不能通过只读迭代器修改集合中的值（*引自OI wiki*）。

另外 end() 中存的是 set 的 size 大小。

~~所以基本上会用begin()与end()就行~~ 时间复杂度 $O(1)$。
### insert()
插入操作。当使用 set 时如果插入的是重复数字，那么什么也不会发生，所以说有可重复的数字就要用 multiset。

insert 函数会返回一个 pair<iterator,bool> 的值，即返回一个 pair 变量，first 的迭代器会指向刚插入的元素，second 表示是否插入成功。

如果是把一个相同的元素插入到 set 中，first 会指向那个相同元素的位置，second 会返回 false。

时间复杂度 $O(\log n)$。
### find()
在集合中查找等于 $x$ 的元素，并返回指向该元素的迭代器。若不存在，则返回 s.end()（*引自算阶*）。时间复杂度 $O(\log n)$。
### erase()
可以调用指针，删去当前指针所引向元素，这样**会删去一个元素**。通常  s.erase(s.find(x)) 配合食用。时间复杂度 $O(\log n)$。

也可以调用元素，删去这个值，这样**会删去所有等于该元素的值**，返回删除元素的个数。时间复杂度 $O(k+\log n)$，其中 $k$ 为被删除的元素个数。

还可以区间操作。erase(s,t) 删除迭代器在 $[ s,t)$ 范围内的所用元素（*引自OI wiki*）。

返回值是删去元素的下一个元素对应的指针。

### lower_bound()/upper_bound()
与平常用的一样，但只需要调用查找的关键值就行。函数返回值是迭代器，如果不存在，返回 s.end()。时间复杂度 $O(\log n)$。
### 其他函数
`size()` 返回集合内元素个数。

`empty()` 返回集合是否为空，空返回$0$，否则返回$1$。

`clear()` 为清空操作。

`count(x)` 返回集合中$x$的个数。
## 其他
### 自定义比较方式
特殊情况下用到。
```cpp
struct cmp {
  bool operator()(int a, int b) { return a > b; }
};

set<int, cmp> s;
```
(*引自OI wiki*）
这样就能实现从大到小排序了~
# 2.vector
> vector 是 STL 提供的**内存连续的、可变长度**的数组（亦称列表）数据结构。能够提供线性复杂度的插入和删除，以及常数复杂度的随机访问。
——摘自OI wiki

我们一般使用 vector 是因为它**可以动态分配内存**，空间有多大开多大，就可以在每个储存长度未知但总长度已知的情况下使用了。它也能支持很多操作。
## 指针
定义是这样式儿的：
```cpp
vector<int>::iterator it
```
支持 * 解除引用。

vector 的指针能提供的骚操作更多，例如与一个整数相加减：
```cpp
for(int i=1;i<=10;i++) v.push_back(i);
it=v.begin();
it+=2;
cout<<*it;
```
> 结果输出3。

把 vector 的两个指针（迭代器）相减，得到两个迭代器对应下标之间的距离：
```cpp
for(int i=1;i<=10;i++) v.push_back(i);
it1=v.begin(),it2=--v.end();
cout<<it2-it1;
```
> 结果输出9。

## 函数
这里一些函数与 set 一样就不提啦。
### front()/back()
`front()` 返回 vector 中的第一个元素，`back()` 返回最后一个元素。
### push_back/pop_back()
在末尾插入/删除元素，时间复杂度为线性。

> 2023.5.30 update:进行操作后会重新分配内存。[详见](https://www.luogu.com.cn/blog/hhhhqwq/jing-zhong-zhang-ming)

### insert()
相当于链表的插入操作，$insert( pos , x )$ 表示在 $pos$ 对应的元素**之前**插入了一个值为 $x$ 的元素（ $pos$ 为指针），时间复杂度为线性。
### erase()
相当于链表的删除操作。$erase( pos )$表示删除 $pos$ 位置的数，$erase( l,r )$ 表示删除 $[ l,r )$ 区间内的数（$pos$，$l$，$r$ 均为指针），时间复杂度为线性。

### remove()
并不是 vector 中自带的函数，但有特殊的用法。$remove( l,r,x )$ 可以实现删除 $l$ 到 $r$ 区间中值为 $x$ 的数（左闭右开）。可以这样具体实现：
```cpp
v.erase(remove(v.begin()+x-1,v.begin()+y,z),v.begin()+y);
//删除区间[X,Y]中值为Z的数。
```
## 其他
放几个可能用的到的。
### 访问
`at(pos)` 返回容器中下标为 pos 的引用。如果数组越界抛出 `std::out_of_range` 类型的异常。

与直接数组访问同理，但不执行越界检查。

`data()` 返回指向数组第一个元素的指针。（*引自OI wiki*)。
### 长度
`resize()` 改变 vector 的长度，多退少补。改变之后就跟普通数组一样了。
```cpp
v.resize(len);
```
`max_size()` 返回容器的最大可能长度。
```cpp
cout<<v.max_size();
```
> 输出很怪的值：4611686018427387903。

### 比较
vector 还能直接比较（没想到吧）。内部重载了 $<$ 和 $>$，按字典序比较大小。
```cpp
if(v[x]>v[y]) swap(v[x],v[y]);
```

# 3.map
> map 是有序键值对容器，它的元素的键是唯一的。搜索、移除和插入操作拥有对数复杂度。map 通常实现为红黑树。
——摘自OI wiki

就是哈希啦~ 懒得手写哈希可以用这个。

定义方式：
```cpp
map<key_type,value_type> m;//key 和 value 可以是任意类型。
map<int,int> m;
map<pair<int,int>,vector<int> > m1;
```
（*引自算阶*）
map 的指针与 set 的指针类型是一样的，解除引用后，将得到一个二元组 `pair<key_type,value_type>`。
## 函数
### insert()/erase()
元素的插入/删除。`insert()` 的参数是 `pair<key_type,value_type>`，`erase()` 的参数可以是 key 或者是迭代器（*引自算阶*）。
### $\left[ \right] $ 操作符
map 支持像数组那样的访问、查找。但如果查找的值不存在则会新建一个空的二元组，因此要配合 find() /count() 使用。

map 还有其他函数，但不常用就不说了。
## 其他
### unordered_map
> 无序关联式容器则采用哈希方式存储元素，内部元素不以任何特定顺序进行排序，所以访问无序关联式容器中的元素时，访问顺序也没有任何保证。
> ——摘自OI wiki

因为没有排序，unordered_map 通常会比 map 快一些。但在特殊情况下会被卡，需要酌情使用。
# 4.bitset
一些卡内存的题可能用到。能够用很小的空间储存 $01$ 串（每 $8$ 位占一个字节），且支持操作多，十分方便。

bitset 的复杂度一般被认为是 $O(\dfrac{n}{\omega})$，其中  $\omega=32$（计算机的位数）（*引自OI wiki*）。

*话说 bitset 严格来讲并不属于 STL （大惊*

定义方式：
```cpp
bitset<4000> bit
```
其中 $4000$ 是 bitset 的位数。
## 位运算
`~bit` 按位取反。

`&` `|` `^` 与、或、异或。

`<<` `>>` 左移右移。

支持数组下标读取方式。（下标从 $0$ 开始）
```cpp
s=13;
cout<<s<<endl;
s=~s;
cout<<s<<endl;
s>>=1;
cout<<s<<endl;
s^=1;
cout<<s<<endl;
cout<<s[3];
```
> 输出：
01101 10010 01001 01000 1

## 函数
`count()` 返回 $1$ 的个数。

`any()` : 若存在某一位是 $1$ 则返回 $1$，否则返回 $0$。

`none()` : 若所有位都是 $0$ 则返回 $1$，否则返回 $0$。

`set()` 把所有位变为 $1$。set($k$,$v$) 把第 $k$ 位改为 $v$。

`reset()` 把所有位变为 $0$。reset($k$) 把第 $k$ 位变为 $0$。

`flip()` 把所有位取反，flip($k$)同理（*引自OI wiki 与 算阶*）。

其他函数不常见就不写了~
# 5.queue
这个用法更简单了~ 来写一下 priority_queue 的用法。

用堆也可以实现很多操作，常用的如对顶堆。
```cpp
priority_queue<int> q1//大根堆
priority_queue<int,vector<int>,greater<int> >q2//小根堆
```
小根堆也可以用重载小于号来实现。

更方便的用法是当成负数存进去~

如果是套 pair 的话会按第一位优先排序。

deque 是双端队列，支持头与尾的插入、弹出。

- update：NOI后deque已死，能不用就不要用了吧（防暴毙

***
总结得差不多了，如有需要再补充~