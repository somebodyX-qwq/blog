---
title: "可并堆"
published: 2025-04-23
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

支持维护许多堆，堆的查找，删除最大/最小值和合并。

```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005],f[100005],dep[100005],lc[100005],rc[100005];
bool v[100005];
int get(int x)
{
    if(f[x]==x) return x;
    else return f[x]=get(f[x]);
}
int merge(int x,int y)
{
    if(!x||!y) return x+y;
    if(a[x]>a[y]) swap(x,y);
    rc[x]=merge(rc[x],y);
    if(dep[lc[x]]<dep[rc[x]]) swap(lc[x],rc[x]);
    dep[x]=dep[rc[x]]+1;
    return x;
}
int main()
{
    int n,m,op,x,y,xx,yy;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]),f[i]=i;
    for(int i=1;i<=m;i++)
    {
        scanf("%d",&op);
        if(op==1)
        {
            scanf("%d%d",&x,&y),xx=get(x),yy=get(y);
            if(xx==yy||v[x]||v[y]) continue;
            f[xx]=f[yy]=merge(xx,yy);
        }
        else
        {
            scanf("%d",&x),xx=get(x);
            if(v[x]) {printf("-1\n");continue;}
            printf("%d\n",a[xx]);
            v[xx]=1,f[xx]=merge(lc[xx],rc[xx]);
            if(lc[xx]) f[lc[xx]]=f[xx];
            if(rc[xx]) f[rc[xx]]=f[xx];
        }
    }
    return 0;
}
```