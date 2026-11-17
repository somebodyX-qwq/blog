---
title: "线段树"
published: 2023-05-11
publishedAt: 2023-05-11T21:54:00+08:00
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

开新坑力 （好耶

经历了很多比赛，感觉一个比一个寄，确实自己的思维能力很差，还很容易钻牛角尖，甚至干一些蠢事（ THUSC 直接手搓与异或门）

### **警钟长鸣** 

脑子跟不上，只能用笨办法了（悲

于是有了这篇总结，主要用于知识总结与技巧积累。
___

线段树是一种数据结构，我们通常用来维护 **信息**，来回答题目中的问题。

我们会把 **信息** 储存到一段区间中，而如何用已知的几个小区间的信息得到需要回答的信息的答案，则需要 **合并**。在构思需要维护的 **信息** 时必须思考这种 **信息** 是否可以 **合并**，如何 **合并**，在此基础上还要满足对答案的需求。

可只是如此需要线段树并不是首选，而当有了 **修改** 操作时线段树可以有更多的操作区间。需要修改时，我们可以找到需要修改的空间对应的在线段树上的几个区间，并对这几个区间的 **信息** 进行 **修改**。

可是小区间的 **信息** 会影响其上的大区间 **信息**，我们只改了小区间，如何保证大区间 **信息** 的正确性呢？这个也很好解决，只要在 **修改** 小区间后回溯时再重新进行一次 **合并** 即可。

可单点修改还好，要是一个区间的话，一个一个单点修改仍然很暴力，这时我们便需要 **标记**（$lazytage$）。顾名思义（~~就是懒~~），当当前找到的这个区间已经被包含在我们要修改的区间中，就不需要再往下传了，并直接进行 **修改**。

为什么这时正确的？仔细想想，我们对这一区间的数其实进行的是同一种操作，因此只需一种 **标记** 记录。更重要的是，也正是此操作可以实现操作的减少！ 

>对一个区间加 $2$，再对其加 $3$，其实就是对它一起加了 $5$，所以本质上几次一样的操作都可以整成一次操作。

有了 **标记**，我们不仅需要使它发挥本来的作用——**下传操作**，还需要保证 **标记** 是可以进行 **合并** 的，以此来减小操作次数。

那 **标记** 何时起到作用呢？当然是用到才用啦！~~（突出的就是懒）~~ 询问一个区间时，下放该区间的 **标记** 到它的子区间，然后 **标记** 清零。

说了这么多，其实线段树的灵魂其实就是加粗的这几个字——

### 储存可以合并的信息，在修改时使用标记记录并实现标记的合并，在合适时下传标记。

![lxl 的精辟总结](https://cdn.luogu.com.cn/upload/image_hosting/kua7jgmv.png)

*lxl 的精辟总结*

~~然并卵~~ 实际做题是另一种样子了。

___

### 维护复杂信息

[P7706 文文的摄影布置](https://www.luogu.com.cn/problem/P7706)

这道题不是简单的区间和区间最大最小值，所以要先思考我们要维护什么信息。

当一个整区间被分为左右两边时，可以发现有三种情况：

1.吸引度 $A_i$ 在左右两边，大小 $B_i$ 在左边。

2.吸引度 $A_i$ 在左右两边，大小 $B_i$ 在右边。

3.吸引度 $A_i$ 全部在左边或右边。

因此可以维护 $ll_i$ **吸引度左，大小右** 与 $rr_i$ **吸引度右，大小左** 的情况，因为要拼成 $3$ 个数，我们要额外枚举 $ma_i$ **最大值** 来与上述信息合并成答案。

那么如何维护 $ll_i$ 与 $rr_i$ 呢？还是从分开的思路，分为两种情况：

1.吸引度 $A_i$ 在一边，大小 $B_i$ 在另一边。

2.吸引度 $A_i$ 与大小 $B_i$ 全部在左边或右边。

对于第二种情况用子节点的信息维护即可，第一种情况则需要额外维护 $mi_i$ **最小值** 来更新。

到这里时问题已经可以被解决。但在寻找答案时有一些小细节，因为更新答案时的合并操作并不完全由一个数组完成，所以在合并答案区间时其他几个数组的信息也要保存（详情看代码）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=5e5+5;
int a[M],b[M],ma[4*M],mi[4*M],rr[4*M],ll[4*M],tree[4*M];
struct node
{
    int ma,mi,ll,rr,tree;
};
void pushup(int l,int r,int rt)
{
    ma[rt]=max(ma[rt<<1],ma[rt<<1|1]),mi[rt]=min(mi[rt<<1],mi[rt<<1|1]);
    ll[rt]=max(max(ll[rt<<1],ll[rt<<1|1]),ma[rt<<1]-mi[rt<<1|1]);
    rr[rt]=max(max(rr[rt<<1],rr[rt<<1|1]),ma[rt<<1|1]-mi[rt<<1]);
    tree[rt]=max(max(tree[rt<<1],tree[rt<<1|1]),max(ll[rt<<1]+ma[rt<<1|1],ma[rt<<1]+rr[rt<<1|1]));
}
void build(int l,int r,int rt)
{
    if(l==r)
    {
        ma[rt]=a[l],mi[rt]=b[l];
        rr[rt]=-1e9,ll[rt]=-1e9,tree[rt]=-1e9;
        return;
    }
    int mid=(l+r)/2;
    build(l,mid,rt<<1);
    build(mid+1,r,rt<<1|1);
    pushup(l,r,rt);
}
void change(int l,int r,int rt,int x,int val,int flag)
{
    if(l==r)
    {
        if(flag==0) ma[rt]=val;
        else mi[rt]=val;
        return;
    }
    int mid=(l+r)/2;
    if(x<=mid) change(l,mid,rt<<1,x,val,flag);
    else change(mid+1,r,rt<<1|1,x,val,flag);
    pushup(l,r,rt);
}
//如果合并需要好几个信息的话。。。打包成一起再返回就可以啦！
node find(int l,int r,int rt,int x,int y)
{
    node ans={-100000000,100000000,-100000000,-1000000000,-100000000},L,R;
    if(r<x||l>y) return ans;
    if(l>=x&&r<=y)
    {
        ans.ll=ll[rt],ans.rr=rr[rt],ans.tree=tree[rt];
        ans.mi=mi[rt],ans.ma=ma[rt];
        return ans;
    }
    int mid=(l+r)/2;
    L=find(l,mid,rt<<1,x,y),R=find(mid+1,r,rt<<1|1,x,y);
    ans.ma=max(L.ma,R.ma),ans.mi=min(L.mi,R.mi);
    ans.ll=max(max(L.ll,R.ll),L.ma-R.mi),ans.rr=max(max(L.rr,R.rr),R.ma-L.mi);
    ans.tree=max(max(L.tree,R.tree),max(L.ll+R.ma,L.ma+R.rr));
    return ans;
}
int main()
{
    int n,m,x,y,op;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]);
    for(int i=1;i<=n;i++) scanf("%d",&b[i]);
    build(1,n,1);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d",&op,&x,&y);
        if(op==1) change(1,n,1,x,y,0);
        else if(op==2) change(1,n,1,x,y,1);
        else printf("%d\n",find(1,n,1,x,y).tree);
    }
    return 0;
}
```
这种 **维护区间左右信息** 的套路其实还蛮常见的，如 **合并成一段** 的答案通常可以用这种方式解决（感性理解，一个大块可以用左边的一块与右边的一块合并出来）

这类题目还有：

[P4344 [SHOI2015] 脑洞治疗仪](https://www.luogu.com.cn/problem/P4344)

[P2894 [USACO08FEB] Hotel G](https://www.luogu.com.cn/problem/P2894)

[P4513 小白逛公园](https://www.luogu.com.cn/problem/P4513)

___

### 维护单调序列

[P4198 楼房重建](https://www.luogu.com.cn/problem/P4198)

以斜率为权值，转化一下就会发现我们要维护一段从起点出发的单调序列长度。

还是一样的思路，先分成两半，再分别考虑两半的贡献.

>我们可以先查找右区间的左区间的最大值，如果这个最大值比左区间的最大值小，那么有区间的左区间的所有答案一定看不到，所以我们就可以递归查找右区间的右区间。

>如果右区间的左区间的最大值比左区间的最大值大，那么原来被右区间的左区间挡住的现在一样会被挡住，我们就可以加上右区间的答案，所以我们可以递归查找右区间的左区间。

>但是这里有一个坑点，右区间的答案不一定是 $ans$（右区间的右区间），因为右区间的答案可能被左区间挡住，所以右区间的答案一定是 $ans$(右区间)- $ans$ (右区间的左区间)。

*摘自 [Nemlit的题解](https://www.luogu.com.cn/blog/tbr-blog/solution-p4198) ~~懒得写了~~*

```cpp
#include<bits/stdc++.h>
using namespace std;
double tree[400005];
int c[400005];
int pushup(int l,int r,int rt,double val)
{
    if(tree[rt]<val) return 0;
    if(l==r) return tree[rt]>val;
    int ql=rt<<1,qr=rt<<1|1,mid=(l+r)/2;
    if(val>tree[ql]) return pushup(mid+1,r,qr,val);
    else return pushup(l,mid,ql,val)+c[rt]-c[ql];
}
void change(int l,int r,int rt,int x,int val)
{
    if(l==r)
    {
        tree[rt]=1.0*val/x;
        c[rt]=1;
        return;
    }
    int mid=(l+r)/2;
    if(x<=mid) change(l,mid,rt<<1,x,val);
    else change(mid+1,r,rt<<1|1,x,val);
    c[rt]=c[rt<<1]+pushup(mid+1,r,rt<<1|1,tree[rt<<1]);
    tree[rt]=max(tree[rt<<1],tree[rt<<1|1]);
}
int main()
{
    int n,m,x,y;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d",&x,&y);
        change(1,n,1,x,y);
        printf("%d\n",c[1]);
    }
    return 0;
}
```


通过这道题可以发现对于复杂问题可以根据左右区间，分情况讨论，会使问题变简单。

___

### 标记维护

[P2572 [SCOI2010] 序列操作](https://www.luogu.com.cn/problem/P2572)

一眼都是熟悉的操作。。。可是拼在一起就麻烦了。

*本人因为 $lazytag$ 的问题调了一下午 ~~警钟敲烂~~*

信息的维护其实与上文一致，现在主要强调标记问题。

因为区间操作有两种——**区间赋值** 与 **区间取反**，我们要另外考虑这两种标记的相互影响。

如果~~像我一样~~仍然是各传各的标记，便会出现 **循序** 问题——是先该赋值还是先取反呢？

但其实可以发现这两种操作可以互相 **覆盖**。

不仅是同种标记之间可以合并，不同标记之间也可以！

于是仍然可以分为两种情况：

1.对当前 **区间赋值** 时已经有 **区间取反** 标记时，把 **区间取反** 标记取消，因为赋值操作在后，所以赋值操作 **覆盖** 掉取反操作了

2.对当前 **区间取反** 时已经有 **区间赋值** 标记时，把赋值操作取反，不再下传 **区间取反** 标记，就相当于在赋值操作中顺便把取反操作也做了。

这样两种标记只会同时存在一个，便不会互相影响了。

```cpp
#include<bits/stdc++.h>
#define lc rt<<1
#define rc rt<<1|1
using namespace std;
const int M=1e5+5;
struct node
{
    int sum[4*M],ans[4*M],ll[4*M],rr[4*M];
}tree[2];
int a[M],turn[4*M],lazy[4*M];
void pushup(int l,int r,int rt)
{
    int mid=(l+r)/2;
    tree[0].sum[rt]=tree[0].sum[lc]+tree[0].sum[rc];
    tree[1].sum[rt]=tree[1].sum[lc]+tree[1].sum[rc];
    if(tree[0].sum[rc]==r-mid) tree[0].ll[rt]=tree[0].ll[lc]+r-mid;
    else tree[0].ll[rt]=tree[0].ll[rc];
    if(tree[0].sum[lc]==mid-l+1) tree[0].rr[rt]=tree[0].rr[rc]+mid-l+1;
    else tree[0].rr[rt]=tree[0].rr[lc];
    if(tree[1].sum[rc]==r-mid) tree[1].ll[rt]=tree[1].ll[lc]+r-mid;
    else tree[1].ll[rt]=tree[1].ll[rc];
    if(tree[1].sum[lc]==mid-l+1) tree[1].rr[rt]=tree[1].rr[rc]+mid-l+1;
    else tree[1].rr[rt]=tree[1].rr[lc];
    tree[0].ans[rt]=max(tree[0].ans[lc],max(tree[0].ans[rc],tree[0].ll[lc]+tree[0].rr[rc]));
    tree[1].ans[rt]=max(tree[1].ans[lc],max(tree[1].ans[rc],tree[1].ll[lc]+tree[1].rr[rc]));
}
void swapp(int rt)
{
    swap(tree[0].sum[rt],tree[1].sum[rt]);
    swap(tree[0].ans[rt],tree[1].ans[rt]);
    swap(tree[0].ll[rt],tree[1].ll[rt]);
    swap(tree[0].rr[rt],tree[1].rr[rt]);
}
void cover(int id,int rt,int val) {tree[id].sum[rt]=tree[id].ll[rt]=tree[id].rr[rt]=tree[id].ans[rt]=val;}
void merge(int l,int r,int rt)
{
    if(lazy[rt]==1) lazy[rt]=-1,cover(0,rt,r-l+1),cover(1,rt,0);
    else lazy[rt]=1,cover(0,rt,0),cover(1,rt,r-l+1);
}
void pushdown(int l,int r,int rt)
{
    if(l==r||(lazy[rt]==0&&turn[rt]==0)) return;
    int z=lazy[rt],mid=(l+r)/2,t1,t0;
    if(z!=0)
    {
        if(z==1) t1=1,t0=0;
        else t1=0,t0=1;
        cover(t1,lc,mid-l+1),cover(t1,rc,r-mid);
        cover(t0,lc,0),cover(t0,rc,0);
        lazy[lc]=lazy[rc]=z,lazy[rt]=0;
        turn[lc]=turn[rc]=0;
    }
    if(turn[rt])
    {
        if(lazy[lc]!=0) merge(l,mid,lc);
        else turn[lc]^=1,swapp(lc);
        if(lazy[rc]!=0) merge(mid+1,r,rc);
        else turn[rc]^=1,swapp(rc);
        turn[rt]=0;
    }
}
void build(int l,int r,int rt)
{
    if(l==r)
    {
        tree[a[l]].sum[rt]=tree[a[l]].ans[rt]=tree[a[l]].ll[rt]=tree[a[l]].rr[rt]=1;
        return;
    }
    int mid=(l+r)/2;
    build(l,mid,lc);
    build(mid+1,r,rc);
    pushup(l,r,rt);
}
void change(int l,int r,int rt,int x,int y,int val)
{
    if(r<x||l>y) return;
    if(l>=x&&r<=y)
    {
        if(turn[rt]) turn[rt]=0;
        cover(val,rt,r-l+1),cover(val^1,rt,0);
        if(val==1) lazy[rt]=1;
        else lazy[rt]=-1;
        return;
    }
    pushdown(l,r,rt);
    int mid=(l+r)/2;
    change(l,mid,lc,x,y,val);
    change(mid+1,r,rc,x,y,val);
    pushup(l,r,rt);
}
void rotate(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return;
    if(l>=x&&r<=y)
    {
        if(lazy[rt]!=0) {merge(l,r,rt);return;}
        swapp(rt),turn[rt]^=1;
        return;
    }
    pushdown(l,r,rt);
    int mid=(l+r)/2;
    rotate(l,mid,lc,x,y);
    rotate(mid+1,r,rc,x,y);
    pushup(l,r,rt);
}
int findsum(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return 0;
    if(l>=x&&r<=y) return tree[1].sum[rt];
    pushdown(l,r,rt);
    int mid=(l+r)/2;
    return findsum(l,mid,lc,x,y)+findsum(mid+1,r,rc,x,y);
}
int findans(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return 0;
    if(l>=x&&r<=y) return tree[1].ans[rt];
    pushdown(l,r,rt);
    int mid=(l+r)/2;
    if(y<=mid) return findans(l,mid,lc,x,y);
    else if(x>mid) return findans(mid+1,r,rc,x,y);
    else return max(findans(l,mid,lc,x,y),max(findans(mid+1,r,rc,x,y),min(tree[1].ll[lc],mid-x+1)+min(tree[1].rr[rc],y-mid)));
}
int main()
{
    int n,m,op,l,r;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]);
    build(1,n,1);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d",&op,&l,&r);
        l++,r++;
        if(op==0) change(1,n,1,l,r,0);
        else if(op==1) change(1,n,1,l,r,1);
        else if(op==2) rotate(1,n,1,l,r);
        else if(op==3) printf("%d\n",findsum(1,n,1,l,r));
        else if(op==4) printf("%d\n",findans(1,n,1,l,r));
    }
    return 0;
}
```
*代码很长而且很丑，看看得了*

这类题目还有：

[P3373 【模板】线段树 2](https://www.luogu.com.cn/problem/P3373)

___

### 区间最值操作

将区间中的数 $a_i$ 与给定数取 $min$ 或取 $max$ （$a_i=min/max(a_i,x)$）。看样子很不好维护，但是可以通过一个巧妙的转化把区间最值操作转变为区间修改操作。

以区间取 $min$ 操作为例，我们对每个线段树节点维护一个区间最大值 $ma$ 与一个区间次大值 $maa$，将操作分 $3$ 种情况讨论：

- $ma \le x$，此时的修改操作不会对该区间中的数造成影响，直接返回。

- $maa<x<ma$，只会对最大值产生影响，并且最大值经过修改后不会比次大值小（仍是最大值），所以只需要改掉最大值的信息然后返回。

- $x\le maa$，继续向下递归。

这样做可以证明复杂度是 $O(n\log^2n)$ 的。

### 区间历史最值

对一个区间有若干操作，同时对每个数 $a_i$ 维护数组 $b_i=max(b_i,a_i)$，即 $b_i$ 是 $a_i$ 曾经取到过的最大值。

对于这种操作最重要的考虑**对于同一区间的修改如何把信息传给子区间**，也就是**历史最值的标记设置及其修改**。

既然要维护历史最值，我们不妨设最大值 $max$，与历史最大值 $hmax$。因为涉及到操作的下放，还需要设区间加标记 $add$，与历史最大加值的标记 $hadd$。

直接说太抽象力，画个图考虑一下：

![](https://cdn.luogu.com.cn/upload/image_hosting/rqmt9xkw.png)

黑色线段是现在已进行的操作，前半部分是已经下放到该节点的操作，所以现在有一个最大值 $max$ 与历史最大值 $hmax$，$add$ 是未下放的所有操作，$hadd$ 是**未下放操作中前缀和最大的一段**，也就是历史最值标记。

而现在我们要下放 $add$ 与 $hadd$ 这两个标记。$add$ 标记直接加上就好，重点是 $hadd$ 标记。可以发现**历史最大值**就是**前缀和最大的一段操作序列**，于是历史最大值可以被表示为：

$$hmax=max(hmax,max+hadd)$$

便是上面红色蓝色加起来的一长段与下面蓝色的小段的最大值。

然后就可以像普通 $tag$ 一样维护就好了！时间复杂度 $O(n\log n)$。但这里要注意维护的顺序（先维护 $hmax$ 再维护 $max$）。在实际问题中可能还会维护更多的东西，因此一定要注意**什么标记维护哪几个值**，**标记下放的先后顺序**等等。

___

[P4314 CPU监控](https://www.luogu.com.cn/problem/P4314)

这道题便是典型的维护区间历史最值的例题~~ 按操作维护即可。

但要注意这道题有区间加与区间覆盖操作，在写代码时要对这两种操作分开去维护，因此两种标记会有覆盖与下放先后次序情况。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5;
int a[M];
struct node
{
    int ma,hma,add,hadd,cov,hcov,flag;
}tree[4*M];
void downcov(int rt,int val,int hval)
{
    tree[rt].flag=1,tree[rt].add=0;
    tree[rt].cov=val,tree[rt].hcov=max(tree[rt].hcov,hval);
    tree[rt].ma=val,tree[rt].hma=max(tree[rt].hma,hval);
}
void downadd(int rt,int val,int hval)
{
    if(!tree[rt].flag)
    {
        tree[rt].hadd=max(tree[rt].hadd,tree[rt].add+hval);
        tree[rt].add+=val;
        tree[rt].hma=max(tree[rt].hma,tree[rt].ma+hval);
        tree[rt].ma+=val;
    }
    else downcov(rt,val+tree[rt].cov,hval+tree[rt].cov);
}
void pushup(int rt)
{
    tree[rt].ma=max(tree[rt<<1].ma,tree[rt<<1|1].ma);
    tree[rt].hma=max(tree[rt<<1].hma,tree[rt<<1|1].hma);
}
void pushdown(int rt)
{
    int z=tree[rt].add,hz=tree[rt].hadd;
    downadd(rt<<1,z,hz),downadd(rt<<1|1,z,hz);
    tree[rt].add=tree[rt].hadd=0;
    if(!tree[rt].flag) return;
    z=tree[rt].cov,hz=tree[rt].hcov;
    downcov(rt<<1,z,hz),downcov(rt<<1|1,z,hz);
    tree[rt].cov=tree[rt].hcov=tree[rt].flag=0;
}
void build(int l,int r,int rt)
{
    if(l==r)
    {
        tree[rt].ma=tree[rt].hma=a[l];
        return;
    }
    int mid=(l+r)/2;
    build(l,mid,rt<<1);
    build(mid+1,r,rt<<1|1);
    pushup(rt);
}
void add(int l,int r,int rt,int x,int y,int val)
{
    if(r<x||l>y) return;
    if(l>=x&&r<=y) {downadd(rt,val,val);return;}
    pushdown(rt);
    int mid=(l+r)/2;
    add(l,mid,rt<<1,x,y,val);
    add(mid+1,r,rt<<1|1,x,y,val);
    pushup(rt);
}
void cov(int l,int r,int rt,int x,int y,int val)
{
    if(r<x||l>y) return;
    if(l>=x&&r<=y) {downcov(rt,val,val);return;}
    pushdown(rt);
    int mid=(l+r)/2;
    cov(l,mid,rt<<1,x,y,val);
    cov(mid+1,r,rt<<1|1,x,y,val);
    pushup(rt);
}
int find_max(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return -2e9;
    if(l>=x&&r<=y) return tree[rt].ma;
    pushdown(rt);
    int mid=(l+r)/2;
    return max(find_max(l,mid,rt<<1,x,y),find_max(mid+1,r,rt<<1|1,x,y));
}
int find_hmax(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return -2e9;
    if(l>=x&&r<=y) return tree[rt].hma;
    pushdown(rt);
    int mid=(l+r)/2;
    return max(find_hmax(l,mid,rt<<1,x,y),find_hmax(mid+1,r,rt<<1|1,x,y));
}
int main()
{
    char op;
    int n,q,x,y,z;
    scanf("%d",&n);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]);
    build(1,n,1),scanf("%d",&q);
    for(int i=1;i<=q;i++)
    {
        scanf(" %c",&op);
        if(op=='Q')
        {
            scanf("%d%d",&x,&y);
            printf("%d\n",find_max(1,n,1,x,y));
        }
        else if(op=='A')
        {
            scanf("%d%d",&x,&y);
            printf("%d\n",find_hmax(1,n,1,x,y));
        }
        else if(op=='P')
        {
            scanf("%d%d%d",&x,&y,&z);
            add(1,n,1,x,y,z);
        }
        else
        {
            scanf("%d%d%d",&x,&y,&z);
            cov(1,n,1,x,y,z);
        }
    }
    return 0;
}
```
___

[P6242 【模板】线段树 3](https://www.luogu.com.cn/problem/P6242)

这道题是区间最值操作与区间历史最值的综合，其实思路就是上述所说，但随之而来的是更加复杂的维护与更麻烦的细节，值得一码~~的好题~~。

```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;
const int M=5e5+5;
int a[M];
struct node
{
    ll sum,ma,mma,hma,add1,hadd1,add2,hadd2;
    int cnt,siz;//最大值 && 次大值
}tree[4*M];
void pushup(int rt)
{
    tree[rt].ma=max(tree[rt<<1].ma,tree[rt<<1|1].ma);
    if(tree[rt<<1].ma==tree[rt<<1|1].ma)
        tree[rt].cnt=tree[rt<<1].cnt+tree[rt<<1|1].cnt,tree[rt].mma=max(tree[rt<<1].mma,tree[rt<<1|1].mma);
    else if(tree[rt<<1].ma>tree[rt<<1|1].ma)
        tree[rt].cnt=tree[rt<<1].cnt,tree[rt].mma=max(tree[rt<<1].mma,tree[rt<<1|1].ma);
    else tree[rt].cnt=tree[rt<<1|1].cnt,tree[rt].mma=max(tree[rt<<1].ma,tree[rt<<1|1].mma);
    //这里的次大值是严格次大值，也就是比最大值小一点的数 
    tree[rt].hma=max(tree[rt<<1].hma,tree[rt<<1|1].hma);
    tree[rt].sum=tree[rt<<1].sum+tree[rt<<1|1].sum;
    tree[rt].siz=tree[rt<<1].siz+tree[rt<<1|1].siz;
}
void change(int rt,ll val1,ll hval1,ll val2,ll hval2)
{
    tree[rt].hadd1=max(tree[rt].hadd1,tree[rt].add1+hval1);
    tree[rt].hma=max(tree[rt].hma,tree[rt].ma+hval1);
    tree[rt].add1+=val1,tree[rt].ma+=val1,tree[rt].sum+=val1*tree[rt].cnt;
    if(tree[rt].siz==tree[rt].cnt) return;
    tree[rt].hadd2=max(tree[rt].hadd2,tree[rt].add2+hval2);
    tree[rt].add2+=val2,tree[rt].sum+=val2*(tree[rt].siz-tree[rt].cnt);
    if(tree[rt].mma!=-1e18) tree[rt].mma+=val2;
    //注意这里在对非最大值修改时别忘了修改次大值
}
void pushdown(int rt)
{
    ll z1=tree[rt].add1,hz1=tree[rt].hadd1,z2=tree[rt].add2,hz2=tree[rt].hadd2,maxn=max(tree[rt<<1].ma,tree[rt<<1|1].ma);
    //注意这里的maxn是左右子树的最大值，因为此时当前节点的最大值已被修改，与左右子树最大值不同 
    if(tree[rt<<1].ma==maxn) change(rt<<1,z1,hz1,z2,hz2);
    else change(rt<<1,z2,hz2,z2,hz2);
    if(tree[rt<<1|1].ma==maxn) change(rt<<1|1,z1,hz1,z2,hz2);
    else change(rt<<1|1,z2,hz2,z2,hz2);
    tree[rt].add1=tree[rt].hadd1=tree[rt].add2=tree[rt].hadd2=0;
}
void build(int l,int r,int rt)
{
    if(l==r)
    {
        tree[rt].ma=tree[rt].hma=tree[rt].sum=a[l];
        tree[rt].cnt=tree[rt].siz=1,tree[rt].mma=-1e18;
        return;
    }
    int mid=(l+r)/2;
    build(l,mid,rt<<1);
    build(mid+1,r,rt<<1|1);
    pushup(rt);
}
void add(int l,int r,int rt,int x,int y,int val)
{
    if(r<x||l>y) return;
    if(l>=x&&r<=y)
    {
        change(rt,val,val,val,val);
        return;
    }
    pushdown(rt);
    int mid=(l+r)/2;
    add(l,mid,rt<<1,x,y,val);
    add(mid+1,r,rt<<1|1,x,y,val);
    pushup(rt);
}
void get_min(int l,int r,int rt,int x,int y,ll val)
{
    if(r<x||l>y||val>=tree[rt].ma) return;
    if(l>=x&&r<=y&&tree[rt].mma<val)
    {
        change(rt,val-tree[rt].ma,val-tree[rt].ma,0,0);
        return;
    }
    pushdown(rt);
    int mid=(l+r)/2;
    get_min(l,mid,rt<<1,x,y,val);
    get_min(mid+1,r,rt<<1|1,x,y,val);
    pushup(rt);
}
ll find_sum(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return 0;
    if(l>=x&&r<=y) return tree[rt].sum;
    pushdown(rt);
    int mid=(l+r)/2;
    return find_sum(l,mid,rt<<1,x,y)+find_sum(mid+1,r,rt<<1|1,x,y);
}
ll find_ma(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return -1e18;
    if(l>=x&&r<=y) return tree[rt].ma;
    pushdown(rt);
    int mid=(l+r)/2;
    return max(find_ma(l,mid,rt<<1,x,y),find_ma(mid+1,r,rt<<1|1,x,y));
}
ll find_hma(int l,int r,int rt,int x,int y)
{
    if(r<x||l>y) return -1e18;
    if(l>=x&&r<=y) return tree[rt].hma;
    pushdown(rt);
    int mid=(l+r)/2;
    return max(find_hma(l,mid,rt<<1,x,y),find_hma(mid+1,r,rt<<1|1,x,y));
}
int main()
{
    int n,m,op,l,r,x;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]);
    build(1,n,1);
    for(int i=1;i<=m;i++)
    {
        scanf("%d",&op);
        if(op==1)
        {
            scanf("%d%d%d",&l,&r,&x);
            add(1,n,1,l,r,x);
        }
        else if(op==2)
        {
            scanf("%d%d%d",&l,&r,&x);
            get_min(1,n,1,l,r,x);
        }
        else if(op==3)
        {
            scanf("%d%d",&l,&r);
            printf("%lld\n",find_sum(1,n,1,l,r));
        }
        else if(op==4)
        {
            scanf("%d%d",&l,&r);
            printf("%lld\n",find_ma(1,n,1,l,r));
        }
        else
        {
            scanf("%d%d",&l,&r);
            printf("%lld\n",find_hma(1,n,1,l,r));
        }
    }
    return 0;
}
```
有些东西写得很繁琐但其实没必要，因为很多操作是可以合并的~~但是我懒~~，写得很烂凑合看看得了。

这类题目还有：

[GSS2 - Can you answer these queries II](https://www.luogu.com.cn/problem/SP1557)
___

感觉最近一直在写线段树，之后有时间可能会看看其他东西（还什么都不会呢。如有需要再更新。