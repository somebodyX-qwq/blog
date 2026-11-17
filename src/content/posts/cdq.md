---
title: "CDQ 分治"
published: 2025-04-23
tags: ["离线算法", "算法"]
category: "算法"
draft: false
---

模板题：三维偏序

```cpp
#include<bits/stdc++.h>
using namespace std;
int tree[200005],k,anss[100005];
#define lowbit(x) ((x)&(-x))
struct node
{
    int a,b,c,val,ans;
}q[100005],p[100005];
bool cmp(node x,node y)
{
    if(x.a==y.a)
    {
        if(x.b==y.b) return x.c<y.c;
        else return x.b<y.b;
    }
    return x.a<y.a;
}
void add(int x,int val)
{
    for(int i=x;i<=k;i+=lowbit(i))
        tree[i]+=val;
}
int sum(int x)
{
    int ans=0;
    for(int i=x;i;i-=lowbit(i))
        ans+=tree[i];
    return ans;
}
void cdq(int l,int r)
{
    if(l==r) return;
    int t1,t2,tt=l-1,mid=(l+r)/2;
    cdq(l,mid),cdq(mid+1,r);
    t1=l,t2=mid+1;
    while(t1<=mid&&t2<=r)
    {
        if(p[t1].b<=p[t2].b)
        {
            add(p[t1].c,p[t1].val);
            tt++,q[tt]=p[t1],t1++;
        }
        else
        {
            p[t2].ans+=sum(p[t2].c);
            tt++,q[tt]=p[t2],t2++;
        }
    }
    while(t1<=mid) tt++,q[tt]=p[t1],add(p[t1].c,p[t1].val),t1++;
    while(t2<=r) p[t2].ans+=sum(p[t2].c),tt++,q[tt]=p[t2],t2++;
    for(int i=l;i<=mid;i++) add(p[i].c,-p[i].val);
    for(int i=l;i<=r;i++) p[i]=q[i];
}
int main()
{
    int n,tot=0;
    scanf("%d%d",&n,&k);
    for(int i=1;i<=n;i++) scanf("%d%d%d",&q[i].a,&q[i].b,&q[i].c),q[i].val=1,q[i].ans=0;
    sort(q+1,q+n+1,cmp);
    for(int i=1;i<=n;i++)
    {
        if(q[i].a==p[tot].a&&q[i].b==p[tot].b&&q[i].c==p[tot].c) p[tot].val++;
        else tot++,p[tot]=q[i];
    }
    cdq(1,tot);
    for(int i=1;i<=tot;i++) p[i].ans+=p[i].val-1,anss[p[i].ans]+=p[i].val;
    for(int i=0;i<n;i++) printf("%d\n",anss[i]);
    return 0;
}
```

应用：静态区间第 $k$ 小

给定 $n$ 个整数构成的序列 $a$，将对于指定的闭区间 $[l,r]$ 查询其区间内的第 $k$ 小值。

```cpp
#include<bits/stdc++.h>
using namespace std;
#define lowbit(x) (x)&(-(x))
int a[200005],inf=2e5,ans[200005],c[200005],b[200005];
struct node
{
    int l,r,k,id,op;
}q[400005],q1[400005],q2[400005];
void add(int x,int val)
{
    for(int i=x;i<=inf;i+=lowbit(i))
        c[i]+=val;
}
int sum(int x)
{
    int ans=0;
    for(int i=x;i;i-=lowbit(i))
        ans+=c[i];
    return ans;
}
void f(int l,int r,int ll,int rr)
{
    if(ll>rr) return;
    if(l==r)
    {
        for(int i=ll;i<=rr;i++)
            if(q[i].op==2) ans[q[i].id]=l;
        return;
    }
    int mid=(l+r)/2,tot1=0,tot2=0,x;
    for(int i=ll;i<=rr;i++)
    {
        if(q[i].op==1)
        {
            if(q[i].l<=mid) tot1++,q1[tot1]=q[i],add(q[i].id,1);//注意是位置
            else tot2++,q2[tot2]=q[i];
        }
        else
        {
            x=sum(q[i].r)-sum(q[i].l-1);
            if(q[i].k<=x) tot1++,q1[tot1]=q[i];
            else q[i].k-=x,tot2++,q2[tot2]=q[i];
        }
    }
    for(int i=1;i<=tot1;i++)
        if(q1[i].op==1) add(q1[i].id,-1);
    for(int i=1;i<=tot1;i++) q[ll+i-1]=q1[i];
    for(int i=1;i<=tot2;i++) q[ll+i+tot1-1]=q2[i];//标号问题
    f(l,mid,ll,ll+tot1-1);
    f(mid+1,r,ll+tot1,rr);
}
int main()
{
    int n,m,nn,tot=0,x;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++)
    {
        tot++,scanf("%d",&a[i]);
        q[tot].l=a[i];
        q[tot].op=1,q[tot].id=i;
    }
    sort(a+1,a+n+1);
    nn=unique(a+1,a+n+1)-a-1;
    for(int i=1;i<=n;i++) 
    {
        x=lower_bound(a+1,a+nn+1,q[i].l)-a;
        b[x]=q[i].l,q[i].l=x;
    }
    for(int i=1;i<=m;i++)
    {
        tot++;
        scanf("%d%d%d",&q[tot].l,&q[tot].r,&q[tot].k);
        q[tot].id=i,q[tot].op=2;
    }
    f(-inf,inf,1,tot);
    for(int i=1;i<=m;i++) printf("%d\n",b[ans[i]]);
    return 0;
}
```