---
title: "模拟退火"
published: 2025-04-23
tags: ["随机化", "算法"]
category: "算法"
draft: false
---

退！

```cpp
#include<bits/stdc++.h>
using namespace std;
int a[1005],b[1005],w[1005],n;
double ansx=0,ansy=0,ansz;
double calc(double x,double y)
{
    
}
void f()
{
    double x,y,z,T=3000,cha;
    while(T>1e-15)
    {
        x=ansx+(rand()*2-RAND_MAX)*T;
        y=ansy+(rand()*2-RAND_MAX)*T;
        z=calc(x,y),cha=ansz-z;
        if(cha>0) ansx=x,ansy=y,ansz=z;
        else if(exp(cha/T)*RAND_MAX>rand()) ansx=x,ansy=y;
        T*=0.998244353;
    }
}
int main()
{
    scanf("%d",&n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d",&a[i],&b[i],&w[i]);
        ansx+=a[i],ansy+=b[i];
    }
    ansx/=n,ansy/=n,ansz=calc(ansx,ansy);
    srand(time(0)),f(),f();
    printf("%.3lf %.3lf",ansx,ansy);
    return 0;
}
```