---
title: "笛卡尔树"
published: 2025-04-23
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

给定一个 $1$ ~ $n$ 的排列 ，构建一棵二叉树，满足：

1. 每个节点的编号满足二叉搜索树的性质。
2. 节点 $i$ ** 的权值为 $p_i$，每个节点的权值满足小根堆的性质。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e7+5;
int st[M],top=0,lc[M],rc[M],h[M];
int main()
{
    long long ans1,ans2;
    int n,tmp;
    cin>>n;
    for(int i=1;i<=n;i++) cin>>h[i];
    for(int i=1;i<=n;i++)
    {
        tmp=top;
        while(tmp&&h[st[tmp]]>h[i]) tmp--;
        if(tmp) rc[st[tmp]]=i;
        if(top>tmp) lc[i]=st[tmp+1];
        top=tmp,top++,st[top]=i;
    }
    return 0;
}
```