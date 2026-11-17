---
title: "拉格朗日插值"
published: 2022-07-15
publishedAt: 2022-07-15T11:32:00+08:00
tags: ["数论", "算法"]
category: "算法"
draft: false
---

今天学了一手，感觉非常的玄学。。。总结一下。
## 0.我们为什么要学
~~拉插能吃吗学它干什么~~

**插值**是将已知的点值还原为多项式。

在学习之前我们要了解到：**拉格朗日插值是一种求解多项式的算法。** 具体而言，已知$n$个点的坐标，我们便可以求得$n-1$次多项式的表达式，时间复杂度为$O(n^2)$。

但细细一想，FFT 算法中的 IDFT 做的也是这件事，且时间复杂度可以做到更优秀的$O(n\log n)$。但是 IDFT 做的是将特定的点进行插值，拉格朗日插值做的则是给定**任意**$n$个点进行插值，因此会更加实用。

当然了我们同样可以设$n$个未知数列方程来求解，但这样的复杂度是$O(n^3)$，并不优秀。

> 由此可以看出复杂度越高的算法功能越强大，做题时要根据题目要求和数据范围选择合适的算法。

## 1.拉格朗日插值
首先需要思考该怎么做。

通常给定点值后要求这些点值对应的函数在某一位置$t$的取值。那么我们是否可以**在不求出原多项式的情况下，求出$t$的值**？答案是肯定的。

既然不能解方程，那就需要换一种思路。

于是我们考虑**构造**。

由代数基本定理可得：
> $n$个$x$坐标不同的点，可以确定唯一一个最高为$n-1$的多项式。

那么我们只需要构造一个函数，使其在这$n$个点的取值均为对应的$y$，便是原函数了！所以构造的方法是有一定可行性的。

接下来便是要想怎么构造。

对于给定的每个点$k$，设计函数$f_k(i)$的定义如下：

$$f_k(i)=\begin{cases}y_k&i=k\\0&i \ne k\end{cases}$$

每个函数都在对应点满足对应取值，而在其他地方值为$0$，因此这$n$个函数互不干扰。

我们要求的原函数便是：$g=\sum\limits_{k=1}^n f_k$（都满足$n$个点的取值了，又因为互不干扰可以直接加起来~），答案便是$g$在$t$上的取值：

$$ans=g(t)=\sum\limits_{k=1}^n f_k(t)$$
***
再考虑如何设计函数$f$。因为有两个要求，我们先考虑第二个，也就是$f_k(i)=0(k\ne i)$。
于是乎可以这么搞：设函数$h_k$

$$h_k(t)=\prod\limits_{i=1,k\ne i}^n t-x_i$$

这样除了$k$以外的其他点值就都被搞掉了！

然后是第一个点值。我们发现按现在的定义$h_k(x_k)=\prod\limits_{i=1,k\ne i}^n x_k-x_i$，是一个常数。那么便可以除以这个常数，再乘$y_k$就好！（函数在其他位置上值为$0$，因此除以一个常数不影响）最终函数便是 $f_k(t)=y_k \frac{h_k(t)}{h_k(x_k)}$

再整合一下，我们要求的便是：

$$ans=g(t)=\sum\limits_{k=1}^n y_k \prod\limits_{i=1,k\ne i}^n \frac{t-x_i}{x_k-x_i}$$

然后这样就完成了！时间复杂度$O(n^2)$。
[模板题](https://www.luogu.com.cn/problem/P4781)
```cpp
#include<bits/stdc++.h>
using namespace std;
int x[2005],y[2005],mod=998244353;
int poww(int a,int b)
{
	long long ans=1,x=a;
	while(b)
	{
		if(b&1) ans=(ans*x)%mod;
		x=(x*x)%mod;
		b>>=1;
	}
	return ans;
}
int main()
{
	long long s1,s2,ans=0;
	int n,kk,xx,yy;
	scanf("%d%d",&n,&kk);
	for(int i=1;i<=n;i++) scanf("%d%d",&x[i],&y[i]);
	for(int k=1;k<=n;k++)
	{
		s1=y[k],s2=1;
		for(int i=1;i<=n;i++)
		{
			if(i==k) continue;
			xx=kk-x[i],yy=x[k]-x[i];
			if(xx<0) xx+=mod;
			if(yy<0) yy+=mod;
			s1=s1*xx%mod,s2=s2*yy%mod;
		}
		ans=(ans+s1*poww(s2,mod-2)%mod)%mod;
	}
	cout<<ans;
	return 0;
}
```
这道题有模数所以需要逆元，而且注意逆元不能一个一个算，会超时。
## 2.优化
拉插的基本思路已经讲解完，但对于不同的题还有一些小优化。

[CF622F The Sum of the k-th Powers](https://www.luogu.com.cn/problem/CF622F)

嗯？这不是一个奇怪的多项式求和吗，还能用拉格朗日插值算？

是的！我们可以通过~~清奇的脑回路~~，发现我们要求的答案是一个$k+1$次函数在$n$上的值！

具体证明可以看这篇[博客](https://www.luogu.com.cn/blog/formkiller/cf622f-the-sum-of-the-k-th-powers-ti-xie)。~~因为我太菜了就不证了~~

于是我们可以用$k+2$个点来搞出这个多项式！

但是又看到该题$k\leqslant 10^6$，$O(n^2)$肯定过不去。

注意到这道题不同的是我们可以**任选**$k+2$个点，就直接选$1$~$k+2$就好。这样选不仅点较小好算，而且**x 是连续的**，我们便可以对原本的式子进行一些变化：（设$m=k+2$）
$$ans=g(n)=\sum\limits_{k=1}^m y_k \prod\limits_{i=1,k\ne i}^m \frac{n-i}{k-i}$$
其中$y_k=\sum\limits_{i=1}^ki^k$。*式子中的 k 与题目中的 k 无关哦，这里不做改动是因为与原式比较。*

对后面的式子可以进一步改变：
$$f(k)=y_k\times\frac{\prod\limits_{i=1}^{k-1}(n-i)\times \prod\limits_{i=k+1}^m (n-i)}{\prod\limits_{i=1}^{k-1} (k-i)\times \prod\limits_{i=k+1}^m (k-i)}$$
$$=y_k\times\frac{\prod\limits_{i=1}^{k-1}(n-i)\times \prod\limits_{i=k+1}^m (n-i)}{\prod\limits_{i=1}^{k-1}i\times \prod\limits_{i=1}^{m-k}[i\times (-1)^{m-k}]}$$
对于$y_k$可以直接预处理，分母上面的式子可以维护对于$n-i$的前缀积与后缀积，当然也可以只维护一个然后再乘$n-k$的逆元。下面的式子也可以提前维护，同时判断一下正负性。
然后就做完力！时间复杂度$O(n)$。
```cpp
#include<bits/stdc++.h>
#define ll long long
using namespace std;
int mod=1e9+7;
ll po[1000005],inpo[1000005],a[1000005],pp[1000005],inpp[1000005];
ll poww(int a,int b)
{
	ll ans=1,x=a;
	while(b)
	{
		if(b&1) ans=(ans*x)%mod;
		x=(x*x)%mod;
		b>>=1;
	}
	return ans;
}
int main()
{
	ll s1,s2,ans=0;
	int n,k;
	scanf("%d%d",&n,&k),k+=2;
	po[0]=pp[0]=1,inpo[k+1]=1;
	for(int i=1;i<=k;i++) po[i]=(po[i-1]*(n-i))%mod,pp[i]=(pp[i-1]*i)%mod;
	for(int i=k;i;i--) inpo[i]=(inpo[i+1]*(n-i))%mod;
	for(int i=1;i<=k;i++) a[i]=(a[i-1]+poww(i,k-2))%mod;
	for(int i=1;i<=k;i++)
	{
		s1=po[i-1]*inpo[i+1]%mod,s2=pp[i-1]*pp[k-i]%mod;
		if((k-i)&1) s2*=-1;
		ans=(ans+a[i]*s1%mod*poww(s2,mod-2)%mod)%mod;
		if(ans<0) ans+=mod;
	}
	cout<<ans;
	return 0;
}
```
一定要注意小于$0$要取成正数哦~~~（其实代码不长呢）
***
就先总结到这里，之后有需要再补充~~~