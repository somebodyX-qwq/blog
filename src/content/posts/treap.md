---
title: "平衡树"
published: 2025-04-23
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

动态地维护一个可重集合 $M$，并且提供以下操作：

1. 向 $M$ 中插入一个数 $x$。
2. 从 $M$ 中删除一个数 $x$（若有多个相同的数，应只删除一个）。
3. 查询 $M$ 中有多少个数比 $x$ 小，并且将得到的答案加一。
4. 查询如果将 $M$ 从小到大排列后，排名位于第 $x$ 位的数。
5. 查询 $M$ 中 $x$ 的前驱（前驱定义为小于 $x$，且最大的数）。
6. 查询 $M$ 中 $x$ 的后继（后继定义为大于 $x$，且最小的数）。

# 1.FHQ Treap

```cpp
#include<bits/stdc++.h>
using namespace std;
int tot=0,tree[100005],rd[100005],siz[100005],ch[100005][2],root=0;
void add(int val)
{
    tot++;
    tree[tot]=val;
    rd[tot]=rand();
    siz[tot]=1;
}
void pushup(int rt) {siz[rt]=siz[ch[rt][0]]+siz[ch[rt][1]]+1;}
void split(int rt,int val,int &x,int &y)
{
    if(!rt) {x=y=0;return;}
    if(tree[rt]<=val) {x=rt,split(ch[rt][1],val,ch[rt][1],y);}
    else {y=rt,split(ch[rt][0],val,x,ch[rt][0]);}
    pushup(rt);
}
int merge(int x,int y)
{
    if(!x||!y) return x+y;
    if(rd[x]<rd[y])
    {
        ch[x][1]=merge(ch[x][1],y);
        pushup(x);
        return x;
    }
    else
    {
        ch[y][0]=merge(x,ch[y][0]);
        pushup(y);
        return y;
    }
}
int find(int rt,int val)
{
    if(siz[ch[rt][0]]+1==val) return tree[rt];
    else if(val<=siz[ch[rt][0]]) return find(ch[rt][0],val);
    else return find(ch[rt][1],val-siz[ch[rt][0]]-1);
}
int main()
{
    int n,op,val,x,y,z;
    scanf("%d",&n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d",&op,&val);
        if(op==1)
        {
            add(val);
            split(root,val-1,x,y);
            root=merge(merge(x,tot),y);
        }
        else if(op==2)
        {
            split(root,val-1,x,y);
            split(y,val,y,z);////
            y=merge(ch[y][0],ch[y][1]);
            root=merge(merge(x,y),z);////
        }
        else if(op==3)
        {
            split(root,val-1,x,y);
            printf("%d\n",siz[x]+1);////
            root=merge(x,y);
        }
        else if(op==4) printf("%d\n",find(root,val));
        else if(op==5)
        {
            split(root,val-1,x,y);
            printf("%d\n",find(x,siz[x]));
            root=merge(x,y);
        }
        else if(op==6)
        {
            split(root,val,x,y);
            printf("%d\n",find(y,1));
            root=merge(x,y);
        }
    }
    return 0;
}
```

# 2.Splay

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=3e5+5;
int f[M],siz[M],cnt[M],ch[M][2],root,v[M],tot=0,pre;
void add(int val)
{
    tot++,siz[tot]=1;
    v[tot]=val,cnt[tot]=1;
}
int pan(int x)
{
    if(ch[f[x]][0]==x) return 0;
    else return 1;
}
void pushup(int x) {siz[x]=siz[ch[x][0]]+siz[ch[x][1]]+cnt[x];}
void connect(int x,int fa,int p)
{
    if(x) f[x]=fa;
    if(fa) ch[fa][p]=x;
}
void rotate(int x)
{
    int y=f[x],z=f[y],w,p=pan(x),pp=pan(y);
    w=ch[x][p^1];
    connect(w,y,p),connect(x,z,pp),connect(y,x,p^1);//注意顺序关系
    pushup(y),pushup(x);
}
void splay(int x)
{
    while(f[x])
    {
        int fa=f[x];
        if(f[fa])
        {
            if(pan(x)==pan(fa)) rotate(fa);
            else rotate(x);
        }
        if(f[x]) rotate(x);
    }
    root=x;
}
void insert(int x,int fa,int p,int now)
{
    if(!x) {connect(now,fa,p);return;}
    if(v[x]>v[now]) insert(ch[x][0],x,0,now);
    else if(v[x]<v[now]) insert(ch[x][1],x,1,now);
    else cnt[x]++,pre=x;
    pushup(x);
}
int findrk(int x,int val)
{
    if(v[x]>val) return findrk(ch[x][0],val);
    else if(v[x]<val) return findrk(ch[x][1],val)+siz[ch[x][0]]+cnt[x];
    else {pre=x;return siz[ch[x][0]]+1;}
}
int find(int x,int val)
{
    int now=siz[ch[x][0]]+cnt[x];
    if(val<=siz[ch[x][0]]) return find(ch[x][0],val);//注意是<=
    else if(val>now) return find(ch[x][1],val-now);
    else return x;
}
void erase()
{
    if(cnt[root]>1) {cnt[root]--;return;}
    if(!ch[root][0]||!ch[root][1])
    {
        root=ch[root][0]+ch[root][1];
        f[root]=0;return;//根节点的父亲设置为0
    }
    int x=find(ch[root][0],siz[ch[root][0]]),y=ch[root][1];
    f[ch[root][0]]=0,ch[root][0]=ch[root][1]=0;
    splay(x),connect(y,x,1),pushup(x);
}
int main()
{
    int n,op,x;
    scanf("%d",&n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d",&op,&x);
        if(op==1)
        {
            add(x);
            if(!root) {root=tot;continue;}
            pre=0,insert(root,0,0,tot);//插入节点如果有相同值的节点要splay那个值一样的节点，而不是当前节点tot
            if(!pre) pre=tot;
            splay(pre);
        }
        else if(op==2) findrk(root,x),splay(pre),erase();
        else if(op==3)
        {
            printf("%d\n",findrk(root,x));
            splay(pre);
        }
        else if(op==4)
        {
            x=find(root,x),printf("%d\n",v[x]);
            splay(x);
        }
        else if(op==5)
        {
            add(x),pre=0,insert(root,0,0,tot);
            if(!pre) pre=tot;
            splay(pre);
            printf("%d\n",v[find(ch[root][0],siz[ch[root][0]])]);
            erase();
        }
        else if(op==6)
        {
            add(x),pre=0,insert(root,0,0,tot);
            if(!pre) pre=tot;
            splay(pre);
            printf("%d\n",v[find(ch[root][1],1)]);
            erase();
        }
    }
    return 0;
}
```