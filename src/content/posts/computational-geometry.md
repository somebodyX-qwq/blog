---
title: "计算几何"
published: 2025-04-23
tags: ["计算几何", "算法"]
category: "算法"
draft: false
---

# 1.常用模板

```cpp
#include<bits/stdc++.h>
#define pi acos(-1)
using namespace std;
const double eps=1e-8;
int com(double x)
{
    if(fabs(x)<eps) return 0;
    if(x>0) return 1;
    else return -1;
}
struct Point
{
    double x,y;
    Point operator +(const Point &p) {return Point{p.x+x,p.y+y};}
    Point operator -(const Point &p) {return Point{x-p.x,y-p.y};}
    Point operator *(double p) {return Point{x*p,y*p};}
    Point operator /(double p) {return Point{x/p,y/p};}
    bool operator <(const Point &p)
    {
        if(com(x-p.x)==0) return y<p.y;
        else return x<p.x;
    }
};
struct line
{
    Point x,y,v;
};
struct circle
{
    Point o;
    double r;
};
double spot(Point q,Point p) {return q.x*p.x+q.y*p.y;}
double length(Point q) {return sqrt(spot(q,q));}
double dis(Point p,Point q) {return length(p-q);}
double project(Point a,Point b,Point c) {return spot(b-a,c-a)/length(b-a);}
double cross(Point p,Point q) {return p.x*q.y-p.y*q.x;}
double area(Point a,Point b,Point c) {return cross(b-a,c-a);}
bool online(Point p,line l)
{
    if(com(cross(p,l.v))==0) return 1;
    else return 0;
}
bool onsegment(Point p,line l)
{
    if(com(cross(p,l.v))==0&&com(spot(p-l.x,p-l.y))<=0) return 1;
    else return 0;
}
Point rotate(Point p,double delta)
{
    return Point{p.x*cos(delta)-p.y*sin(delta),p.x*sin(delta)+p.y*cos(delta)};
}
//point's shadow on the line
Point pointline(Point p,line l)
{
    return l.x+l.v*(spot(p-l.x,l.v)/spot(l.v,l.v));
}
//distant of point and line
double pointlinedis(Point p,line l)
{
    return cross(p-l.x,l.v)/length(l.v);
}
//两条直线交点
Point lineline(line l1,line l2)
{
    if(com(cross(l1.v,l2.v))==0) return Point{-1,-1};
    double x=cross(l2.v,l1.x-l2.x)/cross(l1.v,l2.v);
    return l1.x+l1.v*x;
}
int turn(Point p1,Point p2,Point p3)
{
    Point v1=p2-p1,v2=p3-p1;
    if(com(cross(v1,v2))>0) return 1;
    else if(com(cross(v1,v2))<0) return -1;
    else return 0;
}
//circle
int in_circle(line l,circle c)
{
    double dis=pointlinedis(c.o,l)-c.r;
    return com(dis);
}
circle get_circle(Point p1,Point p2,Point p3)
{
    Point p=(p1+p2)/2,q=(p1+p3)/2,o;
    line l1=line{p,p+rotate(p1-p2,pi/2),rotate(p1-p2,pi/2)};
    line l2=line{q,q+rotate(p1-p3,pi/2),rotate(p1-p3,pi/2)};
    o=lineline(l1,l2);
    return circle{o,dis(o,p1)};
}
```

# 2.最近平面点对

将平面随机旋转一个角度再排序，查找每个点附近的 $10$ 个点。

```cpp
#include<bits/stdc++.h>
using namespace std;
const double eps=1e-9;
const int M=2e5+5;
int com(double x)
{
    if(fabs(x)<eps) return 0;
    if(x>0) return 1;
    else return -1;
}
struct Point
{
    double x,y;
    Point operator +(const Point &p) {return Point{x+p.x,y+p.y};}
    Point operator -(const Point &p) {return Point{x-p.x,y-p.y};}
    bool operator <(const Point &p)
    {
        if(com(x-p.x)==0) return y<p.y;
        else return x<p.x;
    }
}p[M];
Point rotate(Point p,int rad)
{
    return Point{p.x*cos(rad)-p.y*sin(rad),p.x*sin(rad)+p.y*cos(rad)};
}
double dis(Point p,Point q) {return sqrt((p.x-q.x)*(p.x-q.x)+(p.y-q.y)*(p.y-q.y));}
int main()
{
    double ans=1e9;
    int n,rad;
    scanf("%d",&n),rad=rand();
    for(int i=1;i<=n;i++) scanf("%lf%lf",&p[i].x,&p[i].y),p[i]=rotate(p[i],rad);
    sort(p+1,p+n+1);
    for(int i=1;i<=n;i++)
        for(int j=1;j<=10&&i+j<=n;j++) ans=min(ans,dis(p[i],p[i+j]));
    printf("%.4lf",ans);
    return 0;
}
```