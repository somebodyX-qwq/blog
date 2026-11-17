---
title: "凸包"
published: 2025-04-23
tags: ["计算几何", "算法"]
category: "算法"
draft: false
---

# 1.二维凸包

给定一些点，求其凸包。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5;
const double eps=1e-9;
bool v[M];
int com(double x)
{
    if(fabs(x)<eps) return 0;
    else if(x>0) return 1;
    else return -1;
}
struct Point
{
    double x,y;
    int id;
    Point operator +(const Point &p) {return Point{p.x+x,p.y+y};}
    Point operator -(const Point &p) {return Point{x-p.x,y-p.y};}
    Point operator *(double p) {return Point{x*p,y*p};}
    Point operator /(double p) {return Point{x/p,y/p};}
    bool operator <(const Point &p)
    {
        if(com(x-p.x)==0) return y<p.y;
        else return x<p.x;
    }
}p[M],st[M];
double spot(Point p,Point q) {return p.x*p.y+q.x*q.y;}
double cross(Point p,Point q) {return p.x*q.y-p.y*q.x;}
double dis(Point p,Point q) {return sqrt((q.x-p.x)*(q.x-p.x)+(q.y-p.y)*(q.y-p.y));}
int turn(Point p1,Point p2,Point p3)
{
    Point v1=p2-p1,v2=p3-p1;
    return com(cross(v1,v2));
}
int main()
{
    double ans=0;
    int n,top=0;
    scanf("%d",&n);
    for(int i=1;i<=n;i++) scanf("%lf%lf",&p[i].x,&p[i].y),p[i].id=i;
    sort(p+1,p+n+1);
    for(int i=1;i<=n;i++)
    {
        while(top>1&&turn(st[top-1],st[top],p[i])<0) top--;
        top++,st[top]=p[i];
    }
    for(int i=1;i<=top;i++)
    {
        v[st[i].id]=1;
        if(i>1) ans+=dis(st[i-1],st[i]);
    }
    top=0,v[p[1].id]=0;
    for(int i=n;i;i--)
    {
        //if(v[p[i].id]) continue;
        while(top>1&&turn(st[top-1],st[top],p[i])<0) top--;
        top++,st[top]=p[i];
    }
    for(int i=2;i<=top;i++) ans+=dis(st[i-1],st[i]);
    printf("%.2lf",ans);
    return 0;
}
```

# 2.旋转卡壳

```cpp
#include<bits/stdc++.h>
using namespace std;
const double eps=1e-9;
const int M=5e4+5;
bool v[M];
int com(double x)
{
    if(fabs(x)<eps) return 0;
    else if(x>0) return 1;
    else return -1;
}
struct Point
{
    double x,y;
    int id=0;
    Point operator +(const Point &p) {return Point{x+p.x,y+p.y};}
    Point operator -(const Point &p) {return Point{x-p.x,y-p.y};}
    Point operator *(double p) {return Point{x*p,y*p};}
    bool operator <(const Point &p)
    {
        if(com(x-p.x)==0) return y<p.y;
        else return x<p.x;
    }
}p[M],st[M];
double spot(Point p,Point q) {return p.x*q.x+p.y*q.y;}
double cross(Point p,Point q) {return p.x*q.y-p.y*q.x;}
double area(Point p1,Point p2,Point p3) {return cross(p2-p1,p3-p1);}
double dis(Point p,Point q) {return (p.x-q.x)*(p.x-q.x)+(p.y-q.y)*(p.y-q.y);}
int turn(Point p1,Point p2,Point p3)
{
    Point v1=p2-p1,v2=p3-p1;
    return com(cross(v1,v2));
}
int main()
{
    Point p1,p2;
    int n,t=3,top=0,tmp;
    double ans=0;
    scanf("%d",&n);
    for(int i=1;i<=n;i++) scanf("%lf%lf",&p[i].x,&p[i].y),p[i].id=i;
    sort(p+1,p+n+1);
    for(int i=1;i<=n;i++)
    {
        while(top>1&&turn(st[top-1],st[top],p[i])<=0) top--;
        top++,st[top]=p[i];
    }
    tmp=top;////ATENTION!!!
    for(int i=2;i<=top;i++) v[st[i].id]=1;
    for(int i=n;i;i--)
    {
        //if(v[p[i].id]) continue;
        while(top>tmp&&turn(st[top-1],st[top],p[i])<=0) top--;
        top++,st[top]=p[i];
    }
    if(top==2)
    {
        printf("%.0f",dis(st[1],st[2]));
        return 0;
    }
    for(int i=1;i<top;i++)
    {
        p1=st[i],p2=st[i+1];
        ans=max(ans,dis(p1,p2));
        while(com(fabs(area(st[t],p1,p2))-fabs(area(st[t+1],p1,p2)))<0) t=t%(top-1)+1;
        ans=max(ans,dis(p1,st[t])),ans=max(ans,dis(p2,st[t]));
    }
    printf("%.0lf",ans);
    return 0;
}
```