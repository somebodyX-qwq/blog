---
title: "分块"
published: 2022-06-21
publishedAt: 2022-06-21T22:25:00+08:00
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

当正解不会的时候根号数据结构就很实用了，在此总结一些方法~~方便打暴力~~

~~Ynoi 好耶~~
    
------------
# 1.分块
其实思路很类似于线段树。通常是将原有的序列（数据、信息）划分为一些散块，每个散块先预处理出答案与一些信息。

修改时一般会涉及单点修改，每次暴力修改信息即可。

查询时若是涉及区间操作，对于整块部分合并已经预处理的答案；对于散块部分则每次暴力查询统计，一起合并即可。
    
_这便是分块的神奇之处了。有时明明就是暴力但也能优化到不错的复杂度，不愧是~~考场打暴力~~OI选手的好伙伴~_
 
------------

##  例：分块九题
### 分块入门一 [传送门](https://loj.ac/p/6277)
tag的妙用，避免了一一修改降低复杂度。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[50005],c[50005],tag[50005];
int main()
{
	int n,opt,l,r,q,t,tt=1,cnt=0;
	scanf("%d",&n);
	t=sqrt(n);
	for(int i=1;i<=n;i++)
	{
		scanf("%d",&a[i]);
		c[i]=tt;
		cnt++;
		if(cnt==t) cnt=0,tt++;
	}
	for(int i=1;i<=n;i++)
	{
		scanf("%d%d%d%d",&opt,&l,&r,&q);
		if(opt==0)
		{
			if(r-l+1<=t)
				for(int j=l;j<=r;j++) a[j]+=q;
			else
			{
				int x=c[l]+1,y=c[r]-1;
				for(int j=x;j<=y;j++) tag[j]+=q;
				for(int j=l;j<=t*(x-1);j++) a[j]+=q;
				for(int j=t*y+1;j<=r;j++) a[j]+=q;
			}
		}
		else if(opt==1) printf("%d\n",a[r]+tag[c[r]]);
	}
	return 0;
}
```
### 分块入门二 [传送门](https://loj.ac/p/6278) 分块入门三 [传送门](https://loj.ac/p/6279)
预处理要排序，修改之后也要重排。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[500005],biao[500005],s[750][750],len[750],t,tag[500005];
void resort(int id)
{
    for(int i=1;i<=len[id];i++) s[id][i]=a[(id-1)*t+i];
    sort(s[id]+1,s[id]+len[id]+1);
}
int main()
{
    bool flag1=0,flag2=0;
    int n,cnt,op,l,r,val,ans=0;
    scanf("%d",&n);
    t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        len[biao[i]]++;
        s[biao[i]][len[biao[i]]]=a[i];
    }
    for(int i=1;i<=cnt;i++) sort(s[i]+1,s[i]+len[i]+1);
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d",&op,&l,&r,&val);
        if(!op)
        {
            flag1=flag2=0;
            if(biao[l]==biao[r])
            {
                for(int j=l;j<=r;j++) a[j]+=val;
                resort(biao[l]);
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) tag[j]+=val;
            for(int j=l;j<=t*biao[l];j++) a[j]+=val,flag1=1;
            for(int j=(biao[r]-1)*t+1;j<=r;j++) a[j]+=val,flag2=1;
            if(flag1) resort(biao[l]);
            if(flag2) resort(biao[r]);
        }
        else
        {
            val*=val,ans=0;
            if(biao[l]==biao[r])
            {
                for(int j=l;j<=r;j++)
                    if(a[j]+tag[biao[j]]<val) ans++;
                printf("%d\n",ans);
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) 
            	ans+=lower_bound(s[j]+1,s[j]+len[j]+1,val-tag[j])-s[j]-1;
            for(int j=l;j<=t*biao[l];j++)
                if(a[j]+tag[biao[j]]<val) ans++;
            for(int j=(biao[r]-1)*t+1;j<=r;j++)
                if(a[j]+tag[biao[j]]<val) ans++;
            printf("%d\n",ans);
        }
    }
    return 0;
}
```
### 分块入门四 [传送门](https://loj.ac/p/6280)
还是打tag，但稍微麻烦一些。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005],biao[100005],tag[350],len[350];
long long s[350];
int main()
{
    long long ans=0;
    int n,t,l,r,op,val;
    scanf("%d",&n);
    t=sqrt(n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        s[biao[i]]+=a[i];
        len[biao[i]]++;
    }
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d",&op,&l,&r,&val);
        if(!op)
        {
            if(biao[l]==biao[r])
            {
                for(int j=l;j<=r;j++) a[j]+=val;
                s[biao[l]]+=1ll*(r-l+1)*val;
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) tag[j]+=val,s[j]+=1ll*len[j]*val;
            for(int j=l;j<=biao[l]*t;j++) a[j]+=val;
            s[biao[l]]+=1ll*(biao[l]*t-l+1)*val;
            for(int j=(biao[r]-1)*t+1;j<=r;j++) a[j]+=val;
            s[biao[r]]+=1ll*(r-(biao[r]-1)*t)*val;
        }
        else
        {
            ans=0,val++;
            if(biao[l]==biao[r])
            {
                for(int j=l;j<=r;j++) ans+=a[j]+tag[biao[j]];
                printf("%lld\n",ans%val);
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) ans+=s[j];
            for(int j=l;j<=biao[l]*t;j++) ans+=a[j]+tag[biao[j]];
            for(int j=(biao[r]-1)*t+1;j<=r;j++) ans+=a[j]+tag[biao[j]];
            printf("%lld\n",ans%val);
        }
    }
    return 0;
}
```
### 分块入门五 [传送门](https://loj.ac/p/6281)
这个就很妙了~~ 记录每个块中是否全被开成1，是则跳过，不是就暴力开方。
~~不还是全都开了方的暴力吗~~
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005],biao[100005];
bool flag[350];
long long s[350];
void change(int l,int r,bool ff)
{
    if(flag[biao[l]]) return;
    int id=biao[l];
    if(ff) flag[id]=1;
    for(int i=l;i<=r;i++)
    {
        s[id]-=a[i];
        a[i]=sqrt(a[i]);
        s[id]+=a[i];
        if(a[i]>1) flag[id]=0;
    }
}
int main()
{
    long long ans=0;
    int n,t,op,l,r,val;
    scanf("%d",&n);
    t=sqrt(n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        s[biao[i]]+=a[i];
    }
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d",&op,&l,&r,&val);
        if(!op)
        {
            if(biao[l]==biao[r])
            {
                change(l,r,0);
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) change((j-1)*t+1,j*t,1);
            change(l,biao[l]*t,0),change((biao[r]-1)*t+1,r,0);
        }
        else
        {
            ans=0;
            if(biao[l]==biao[r])
            {
                for(int j=l;j<=r;j++) ans+=a[j];
                printf("%lld\n",ans);
                continue;
            }
            for(int j=biao[l]+1;j<=biao[r]-1;j++) ans+=s[j];
            for(int j=l;j<=biao[l]*t;j++) ans+=a[j];
            for(int j=(biao[r]-1)*t+1;j<=r;j++) ans+=a[j];
            printf("%lld\n",ans);
        }
    }
    return 0;
}
```

### 分块入门六 [传送门](https://loj.ac/p/6282)
~~这题不是vector就能做吗~~

以每个块为单位，每次在块中插入数字，查询时扫一遍块即可。

但直接这么做会T。当块过大时会降低插入复杂度，可以判断一下块是否过大，把一个分成两个，或直接在进行一定操作后暴力重构。
```cpp
#include<bits/stdc++.h>
using namespace std;
int n,t,a[200005],biao[200005],len[550],s[550][1505],tot;
void rebuild()
{
    int ss=0;
    for(int i=1;i<=tot;i++)
    {
        for(int j=1;j<=len[i];j++) ss++,a[ss]=s[i][j];
        len[i]=0;
    }
    n=ss,t=sqrt(n),tot=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        biao[i]=(i-1)/t+1;
        len[biao[i]]++;
        s[biao[i]][len[biao[i]]]=a[i];
    }
}
void insert(int x,int val,int id)
{
    for(int i=len[id]+1;i>x;i--) s[id][i]=s[id][i-1];
    s[id][x]=val,len[id]++;
}
int main()
{
    int op,l,r,val,tt,cnt=0,m;
    scanf("%d",&n);
    t=sqrt(n),tot=(n-1)/t+1,m=n;
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        len[biao[i]]++;
        s[biao[i]][len[biao[i]]]=a[i];
    }
    for(int i=1;i<=m;i++)
    {
        tt=1;
        scanf("%d%d%d%d",&op,&l,&r,&val);
        if(!op)
        {
            while(l>len[tt]) l-=len[tt],tt++;
            insert(l,r,tt),cnt++;
            if(cnt==t) rebuild(),cnt=0;
        }
        else
        {
            while(r>len[tt]) r-=len[tt],tt++;
            printf("%d\n",s[tt][r]);
        }
    }
    return 0;
}
```
### 分块入门七 [传送门](https://loj.ac/p/6283)
类比线段树的做法。单独使用两个标记，分别记录整块的加法、乘法，要注意先乘后加。在对散块进行操作时要对标记进行下放，也可以类比线段树的pushdown操作。

 _卡常时取模要注意_ 
```cpp
#include<bits/stdc++.h>
using namespace std;
const int mod=10007;
int biao[200005],lazy1[450],lazy2[450],t;
long long a[200005];
void pushdown(int id)
{
    for(int i=(id-1)*t+1;i<=id*t;i++) a[i]=(a[i]*lazy2[id]+lazy1[id])%mod;
    lazy1[id]=0,lazy2[id]=1;
}
int main()
{
    int n,op,l,r,val,cnt;
    scanf("%d",&n);
    t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%lld",&a[i]);
        biao[i]=(i-1)/t+1;
    }
    for(int i=1;i<=cnt;i++) lazy2[i]=1;
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d",&op,&l,&r,&val);
        if(op==0)
        {
            if(biao[l]==biao[r])
            {
                pushdown(biao[l]);
                for(int j=l;j<=r;j++) a[j]=a[j]+val;
                continue;
            }
            pushdown(biao[l]),pushdown(biao[r]);
            for(int j=biao[l]+1;j<=biao[r]-1;j++) lazy1[j]=(lazy1[j]+val)%mod;
            for(int j=l;j<=biao[l]*t;j++) a[j]=a[j]+val;
            for(int j=(biao[r]-1)*t+1;j<=r;j++) a[j]=a[j]+val;
        }
        else if(op==1)
        {
            if(biao[l]==biao[r])
            {
                pushdown(biao[l]);
                for(int j=l;j<=r;j++) a[j]=a[j]*val;
                continue;
            }
            pushdown(biao[l]),pushdown(biao[r]);
            for(int j=biao[l]+1;j<=biao[r]-1;j++)
            {
                lazy1[j]=(lazy1[j]*val)%mod;
                lazy2[j]=(lazy2[j]*val)%mod;
            }
            for(int j=l;j<=biao[l]*t;j++) a[j]=a[j]*val;
            for(int j=(biao[r]-1)*t+1;j<=r;j++) a[j]=a[j]*val;
        }
        else printf("%lld\n",(a[r]*lazy2[biao[r]]+lazy1[biao[r]])%mod);
    }
    return 0;
}
```
### 分块入门八 [传送门](https://loj.ac/p/6284)
是区间推平操作，好像可以联想到珂朵莉树~~但是我不会~~

在几次操作后可能一整块都会被推平，于是可以记录下该整块是否全部为一个值，是则统一处理，否则暴力查询（修改）。

当然这道题在修改散块前也需要下传标记。

~~复杂度我也不会证，总之能过啦~~
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005],biao[100005],tag[350],len[350],t;
void reset(int id)
{
    if(tag[id])
    {
        for(int i=(id-1)*t+1;i<=id*t;i++) a[i]=tag[id];
        tag[id]=0;
    }
}
int f(int l,int r,int val)
{
    int ans=0;
    if(tag[biao[l]])
    {
        if(tag[biao[l]]==val) ans=r-l+1;
        return ans;
    }
    for(int i=l;i<=r;i++)
    {
        if(a[i]==val) ans++;
        a[i]=val;
    }
    return ans;
}
int main()
{
    int n,l,r,val,ans=0;
    scanf("%d",&n);
    t=sqrt(n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        len[biao[i]]++;
    }
    for(int i=1;i<=n;i++)
    {
        ans=0;
        scanf("%d%d%d",&l,&r,&val);
        if(biao[l]==biao[r])
        {
            reset(biao[l]);
            ans=f(l,r,val);
            printf("%d\n",ans);
            continue;
        }
        for(int j=biao[l]+1;j<=biao[r]-1;j++)
        {
            ans+=f((j-1)*t+1,j*t,val);
            tag[j]=val;
        }
        reset(biao[l]),reset(biao[r]);
        ans+=f(l,biao[l]*t,val);
        ans+=f((biao[r]-1)*t+1,r,val);
        printf("%d\n",ans);
    }
    return 0;
}
```
### 分块入门九 [传送门](https://loj.ac/p/6285)
这好像用莫队也可以写诶~ 可以暴力移动区间，再用数据结构维护答案。

于是就有了莫队+线段树的~~离谱~~做法。（跑题）

但是遇到强制在线题就g了 [P4168 蒲公英](https://www.luogu.com.cn/problem/P4168)

于是只好回归分块。按照整块预处理的思路，可以先求出$f_{i,j}$第$i$块到第$j$块的众数，$s_{i,j}$第$i$块之前数字$j$的个数。这样在查询时便可以直接得到整块的答案，对于散块则暴力查询即可。每次散块扫描到一个数时，开一个桶数组维护散块数字的个数，每次可以利用$s$数组查询整块中该数字个数，比较一下是否需要更新答案。

_这里还有一个卡常小技巧~在预处理过程中如果不想多次清空数组，可以用一个标记数组$vv_{i}$，每次需要清空数组时查看对应标记，再修改标记至当前。具体使用方法看代码_
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[400005],b[400005],biao[400005],len[650],s[650][400005],f[650][650],vv[400005],ss[400005],ff[650][650];
int d[400005];
inline int read()
{
    int s=0,w=1;
    char ch=getchar();
    while(ch<'0'||ch>'9'){if(ch=='-') w=-1;ch=getchar();}
    while(ch>='0'&&ch<='9'){s=s*10+ch-48;ch=getchar();}
    return s*w;
}
int main()
{
    int n,m,t,cnt,nn,c=0,tt,tot=0,ans=0,l,r,x;
    scanf("%d",&n);
    m=n;
    t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++) a[i]=read(),b[i]=a[i];
    sort(b+1,b+n+1);
    nn=unique(b+1,b+n+1)-b-1;
    for(int i=1;i<=n;i++)
    {
        x=lower_bound(b+1,b+nn+1,a[i])-b;
        d[x]=a[i],a[i]=x;
        biao[i]=(i-1)/t+1;
        s[biao[i]][a[i]]++;
        len[biao[i]]++;
        c=max(c,a[i]);
    }
    for(int i=1;i<=cnt;i++)
        for(int j=1;j<=c;j++) s[i][j]+=s[i-1][j];
    for(int i=1;i<=cnt;i++)
    {
        tot=0;
        for(int j=i;j<=cnt;j++)
        {
            for(int k=(j-1)*t+1;k<=j*t;k++)
            {
                if(vv[a[k]]!=i) vv[a[k]]=i,ss[a[k]]=0;
                ss[a[k]]++;
                if(ss[a[k]]>tot) tot=ss[a[k]],tt=a[k];
                else if(ss[a[k]]==tot) tt=min(tt,a[k]);
            }
            f[i][j]=tt,ff[i][j]=tot;
        }
    }
    memset(vv,0,sizeof(vv));
    for(int i=1;i<=m;i++)
    {
        l=read(),r=read();
        // l=(l+ans-1)%n+1,r=(r+ans-1)%n+1;
        // if(l>r) swap(l,r);
        tot=0;
        if(biao[l]==biao[r])
        {
            for(int j=l;j<=r;j++)
            {
                if(vv[a[j]]!=i) vv[a[j]]=i,ss[a[j]]=0;
                ss[a[j]]++;
                if(ss[a[j]]>tot) tot=ss[a[j]],tt=a[j];
                else if(ss[a[j]]==tot) tt=min(tt,a[j]);
            }
            printf("%d\n",d[tt]);
            continue;
        }
        tt=f[biao[l]+1][biao[r]-1],tot=ff[biao[l]+1][biao[r]-1];
        for(int j=l;j<=biao[l]*t;j++)
        {
            if(vv[a[j]]!=i) vv[a[j]]=i,ss[a[j]]=0;
            ss[a[j]]++;
            int xx=s[biao[r]-1][a[j]]-s[biao[l]][a[j]];
            if(ss[a[j]]+xx>tot) tot=ss[a[j]]+xx,tt=a[j];
            else if(ss[a[j]]+xx==tot) tt=min(tt,a[j]);
        }
        for(int j=(biao[r]-1)*t+1;j<=r;j++)
        {
            if(vv[a[j]]!=i) vv[a[j]]=i,ss[a[j]]=0;
            ss[a[j]]++;
            int xx=s[biao[r]-1][a[j]]-s[biao[l]][a[j]];
            if(ss[a[j]]+xx>tot) tot=ss[a[j]]+xx,tt=a[j];
            else if(ss[a[j]]+xx==tot) tt=min(tt,a[j]);
        }
        printf("%d\n",d[tt]);
    }
    return 0;
}
```
## 例 磁力块
>题目大意：在一片广袤无垠的原野上，散落着N 块磁石。每个磁石的性质可以用一个五元组 (x,y,m,p,r)描述，其中x,y 表示其坐标，m 是磁石的质量，p 是磁力，r 是吸引半径。若磁石 A 与磁石B 的距离不大于磁石A 的吸引半径，并且磁石B 的质量不大于磁石A 的磁力，那 么A 可以吸引B。

>小取酒带着一块自己的磁石L 来到了这篇原野的(x0,y0)处，我们可以视为磁石L 的坐 标为(x0,y0)。小取酒手持磁石L 并保持原地不动，所有可以被L 吸引的磁石将会被吸引过 来。在每个时刻，他可以选择更换任意一块自己已经获得的磁石（当然也可以是自己最初携 带的L 磁石）在(x0,y0)处吸引更多的磁石。小取酒想知道，他最多能获得多少块磁石呢？

可以用一个队列维护。可以先把所有石头用质量排序，再按距离排序，当每组的最大质量小于当前石头磁力时，把石头无脑入队，当距离过大时终止入队。否则扫一遍整组石头，能入队则入队。由于按质量排序，所以之后的肯定更不行了，就不用考虑了。

也要先用一个数组标记一下，不能重复取走石头。
```cpp
#include<bits/stdc++.h>
using namespace std;
int biao[250005],len[505],maa[505],zhi[505];
bool v[505][505];
struct node
{
    int m,p;
    long long dis,r;
}a[250005],s[505][505],tt;
queue<node>q;
bool cmp(node x,node y)
{
    return x.m<y.m;
}
bool cmpp(node x,node y)
{
    return x.dis<y.dis;
}
int main()
{
    long long rl;
    int x0,y0,pl,n,x,y,t,ans=0,cnt;
    scanf("%d%d%d%lld%d",&x0,&y0,&pl,&rl,&n);
    rl*=rl,t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%d%d%d%d%lld",&x,&y,&a[i].m,&a[i].p,&a[i].r);
        a[i].dis=1ll*(x-x0)*(x-x0)+1ll*(y-y0)*(y-y0),a[i].r*=a[i].r;
    }
    sort(a+1,a+n+1,cmp);
    for(int i=1;i<=n;i++)
    {
        biao[i]=(i-1)/t+1;
        len[biao[i]]++;
        s[biao[i]][len[biao[i]]]=a[i];
    }
    for(int i=1;i<=cnt;i++)
    {
        maa[i]=s[i][len[i]].m;
        sort(s[i]+1,s[i]+len[i]+1,cmpp);
        zhi[i]=1;
    }
    tt.p=pl,tt.r=rl;
    q.push(tt);
    while(q.size())
    {
        pl=q.front().p,rl=q.front().r;
        q.pop();
        for(int i=1;i<=cnt;i++)
        {
            //cout<<i<<" "<<zhi[i]<<endl;
            if(maa[i]<=pl)
            {
                for(int j=zhi[i];j<=len[i];j++)
                {
                    if(v[i][j]) continue;
                    if(s[i][j].dis>rl)
                    {
                        zhi[i]=j;
                        break;
                    }
                    q.push(s[i][j]),ans++,v[i][j]=1;
                    if(j==len[i]) zhi[i]=len[i]+1;
                }
            }
            else
            {
                for(int j=zhi[i];j<=len[i];j++)
                    if(s[i][j].dis<=rl&&s[i][j].m<=pl)
                    {
                        if(v[i][j]) continue;
                        q.push(s[i][j]),ans++,v[i][j]=1;
                    }
                break;
            }
        }
    }
    //for(int i=1;i<=cnt;i++) cout<<zhi[i]<<" ";
    cout<<ans;
    return 0;
}
```
## 例 作诗 [传送门](https://www.luogu.com.cn/problem/P4135)
与分块入门九本质上做法一样。预处理方式相同，整块直接查询，散块暴力扫描同时记录答案，并更新。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005],biao[100005],ss[100005],v[100005],f[350][350],s[350][100005];
int main()
{
    int n,m,c,t,cnt,tot=0,l,r,ans=0,sum;
    scanf("%d%d%d",&n,&c,&m);
    t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        s[biao[i]][a[i]]++;
    }
    for(int i=1;i<=cnt;i++)
        for(int j=1;j<=c;j++) s[i][j]+=s[i-1][j];
    for(int i=1;i<=cnt;i++)
    {
        int tot=0;
        for(int j=i;j<=cnt;j++)
        {
            for(int k=(j-1)*t+1;k<=j*t;k++)
            {
                if(v[a[k]]!=i) v[a[k]]=i,ss[a[k]]=1;
                else
                {
                    ss[a[k]]++;
                    if(ss[a[k]]%2==0) tot++;
                    else tot--;
                }
            }
            f[i][j]=tot;
        }
    }
    memset(v,0,sizeof(v));
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d",&l,&r);
        l=(l+ans)%n+1,r=(r+ans)%n+1;
        if(l>r) swap(l,r);
        ans=0;
        if(biao[l]==biao[r])
        {
            for(int k=l;k<=r;k++)
            {
                if(v[a[k]]!=i) v[a[k]]=i,ss[a[k]]=1;
                else
                {
                    ss[a[k]]++;
                    if(ss[a[k]]%2==0) ans++;
                    else ans--;
                }
            }
            printf("%d\n",ans);
            continue;
        }
        ans=f[biao[l]+1][biao[r]-1];
        for(int j=l;j<=biao[l]*t;j++)
        {
            if(v[a[j]]!=i) v[a[j]]=i,ss[a[j]]=0;
            ss[a[j]]++;
            sum=s[biao[r]-1][a[j]]-s[biao[l]][a[j]]+ss[a[j]];
            if(sum%2==1&&sum>1) ans--;
            else if(sum%2==0) ans++;
        }
        for(int j=(biao[r]-1)*t+1;j<=r;j++)
        {
            if(v[a[j]]!=i) v[a[j]]=i,ss[a[j]]=0;
            ss[a[j]]++;
            sum=s[biao[r]-1][a[j]]-s[biao[l]][a[j]]+ss[a[j]];
            if(sum%2==1&&sum>1) ans--;
            else if(sum%2==0) ans++;
        }
        printf("%d\n",ans);
    }
    return 0;
}
```
## 例 公约数数列 [传送门](https://www.luogu.com.cn/problem/P4108)
代码里有注释~
```cpp
#include<bits/stdc++.h>
using namespace std;
int biao[100005],t,st[350],ed[350];
int a[100005],xr[350][350],gc[350],gg[350][350];
char c[20];
unordered_map<int,int>mm[350];
int gcd(int a,int b)
{
    if(b==0) return a;
    else return gcd(b,a%b);
}
void change(int id)
{
    int x,y;
    x=y=xr[id][1]=gg[id][1]=a[st[id]];
    mm[id].clear();
    mm[id][y]=1;
    for(int j=st[id]+1;j<=ed[id];j++)
    {
        x=gcd(x,a[j]),y^=a[j];
        xr[id][j-st[id]+1]=y;
        gg[id][j-st[id]+1]=x;//可以预处理一些东西避免重复运算
        if(!mm[id].count(y)) mm[id][y]=j-st[id]+1;
    }
    gc[id]=x;
}
int main()
{
    bool flag=0;
    long long x,s1,s2;
    int n,q,cnt,y,id,xx;
    scanf("%d",&n);
    t=sqrt(n),cnt=(n-1)/t+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%lld",&a[i]);
        biao[i]=(i-1)/t+1;
        if(!st[biao[i]]) st[biao[i]]=i;
        ed[biao[i]]=max(ed[biao[i]],i);
    }
    for(int i=1;i<=cnt;i++) change(i);
    scanf("%d",&q);
    for(int i=1;i<=q;i++)
    {
        scanf(" %s",c+1);
        if(c[1]=='M')
        {
            scanf("%d%d",&id,&xx);
            a[id+1]=xx;
            change(biao[id+1]);
        }
        else
        {
            flag=0;
            scanf("%lld",&x),s1=0,s2=0;
            for(int j=1;j<=cnt;j++)
            {
                if(j==1||s1!=gcd(s1,gg[j][ed[j]-st[j]+1]))//注意此时的判断，要得当否则会超时
                {
                    for(int k=st[j];k<=ed[j];k++)
                    {
                        if(k==1) s1=s2=a[k];
                        else 
                        {
                            if(gg[biao[k]][k-st[biao[k]]+1]!=s1) s1=gcd(s1,a[k]);
                            s2^=a[k];
                        }
                        if(s1*s2==x)
                        {
                            printf("%d\n",k-1);
                            flag=1;
                            break;
                        }
                    }
                }
                else
                {
                    if(mm[j].count((x/s1)^s2))
                    {
                        printf("%d\n",(j-1)*t+mm[j][(x/s1)^s2]-1);
                        flag=1;
                        continue;
                    }
                    s2^=xr[j][ed[j]-st[j]+1];
                }
                if(flag) break;
            }
            if(!flag) printf("no\n");
        }
    }
    return 0;
}
```


# 2.树分块
与普通分块思路相同，但是把操作区间改成树上。

不同的题有不同的分块思路。


------------

## 例 王室联邦 [传送门](https://www.luogu.com.cn/problem/P2325)
从根节点向子树拓展。子节点入栈，当子树节点数量超过一定时，从栈中取出节点并分成一块。当子树遍历完成时，未分块的节点与当前根节点回溯，合并到上一个节点当中去。当根节点回溯时栈中还剩一些节点，再把它们取出合并。这样做可以证明一定满足本题要求，并不会有无解情况。~~但忘了怎么证了~~
```cpp
#include<bits/stdc++.h>
using namespace std;
int head[1005],ver[2005],nxt[2005],tot=0,b;
int s[1005],cnt=0,ans=0,anss[1005],top[1005];
void add(int x,int y)
{
    tot++;
    nxt[tot]=head[x];
    head[x]=tot;
    ver[tot]=y;
}
void dfs(int x,int fa)
{
    int tt=cnt;
    for(int i=head[x];i;i=nxt[i])
    {
        int y=ver[i];
        if(y==fa) continue;
        dfs(y,x);
        if(cnt-tt>=b)
        {
            ans++;
            while(cnt>tt) anss[s[cnt]]=ans,cnt--;
            top[ans]=x;
        }
    }
    cnt++,s[cnt]=x;
}
int main()
{
    int n,x,y;
    scanf("%d%d",&n,&b);
    for(int i=1;i<n;i++)
    {
        scanf("%d%d",&x,&y);
        add(x,y);
        add(y,x);
    }
    dfs(1,0);
    for(int i=1;i<=cnt;i++) anss[s[i]]=ans;
    printf("%d\n",ans);
    for(int i=1;i<=n;i++) printf("%d ",anss[i]);
    printf("\n");
    for(int i=1;i<=ans;i++) printf("%d ",top[i]);
    return 0;
}
```
## 例 [Count on a tree II](https://www.luogu.com.cn/problem/P6177)
那要是在树上进行一些操作该如何进行分块？

类比序列上的分块，我们可以在一棵树上均匀选择一些点，把点与点之间的信息预处理出来。修改照常，查询时如图。

![图片](https://cdn.luogu.com.cn/upload/image_hosting/3fl4ma36.png)

找到两点之间的lca，三点之间的关键点$u1$，$v1$，$u2$，$v2$，统计关键点的信息，再暴力遍历关键点与三点之间的信息。对于该题要维护一个$bitset$记录颜色种类，最后答案看有多少个1。

寻找关键点的方法有几种：

- 每次选择一个深度最大的非关键点，然后若它的 1∼$S$ 级祖先都不是关键点，则我们把它的 $S$ 级祖先标记为关键点。
- 记 $dis_i$ 为 $i$ 到距离它最远的叶子节点的距离，那么将深度$\bmod\sqrt{n} =0$ 且 $dis_i\ge \sqrt{n}$的点 $i$ 设为关键点。

如果不是强制在线，那么树上莫队也能做。~~我太菜了这题没打出来~~

# 3.大分块

## 例：[P4119 [Ynoi2018] 未来日记](https://www.luogu.com.cn/problem/P4119)

不多说了，好题。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5,t=400,tt=320;
int a[M],biao[M],id[M],lv[t],rv[t],ll[t],rr[t],s1[t][t],s2[t][M],t1[t],t2[M];
int rt[t][M],val[t][t],pos[M];
int read()
{
    int x=0;char ch=getchar();
    while(ch<'0'||ch>'9') ch=getchar();
    while(ch>='0'&&ch<='9') x=(x<<3)+(x<<1)+(ch^48),ch=getchar();
    return x;
}
void build(int it)
{
    int cnt=0;
    for(int i=ll[it];i<=rr[it];i++) rt[it][a[i]]=0;
    for(int i=ll[it];i<=rr[it];i++)
    {
        if(!rt[it][a[i]]) cnt++,rt[it][a[i]]=cnt,val[it][cnt]=a[i];
        pos[i]=rt[it][a[i]];
    }
}
void pushdown(int it) {for(int i=ll[it];i<=rr[it];i++) a[i]=val[it][pos[i]];}
void change(int l,int r,int it,int x,int y)
{
    pushdown(it);
    for(int i=l;i<=r;i++)
        if(a[i]==x)
        {
            a[i]=y;
            s1[it][id[x]]--,s1[it][id[y]]++;
            s2[it][x]--,s2[it][y]++;
        }
    build(it);
}
void fun(int it,int x,int y)
{
    if(!s2[it][x]) return;
    if(s2[it][y]) {change(ll[it],rr[it],it,x,y);return;}
    rt[it][y]=rt[it][x],val[it][rt[it][y]]=y,rt[it][x]=0;
    int sum=s2[it][x];
    s1[it][id[y]]+=sum,s1[it][id[x]]-=sum;
    s2[it][y]+=sum,s2[it][x]=0;
}
int main()
{
    //freopen("data.txt","r",stdin);
    int n,m,len1,len2,op,l,r,x,y,k;
    n=read(),m=read();
    for(int i=1;i<=M-5;i++) id[i]=(i-1)/tt+1;
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]);
        biao[i]=(i-1)/t+1;
        s1[biao[i]][id[a[i]]]++;
        s2[biao[i]][a[i]]++;
    }
    len1=biao[n],len2=id[M-5];
    for(int i=1;i<=len1;i++)
    {
        ll[i]=(i-1)*t+1,rr[i]=min(i*t,n),build(i);
        for(int j=1;j<=len2;j++) s1[i][j]+=s1[i-1][j];
        for(int j=1;j<=M-5;j++) s2[i][j]+=s2[i-1][j];
    }
    for(int i=1;i<=len2;i++) lv[i]=(i-1)*tt+1,rv[i]=min(i*tt,M-5);
    for(int i=1;i<=m;i++)
    {
        op=read();
        if(op==1)
        {
            l=read(),r=read(),x=read(),y=read();
            if(x==y) continue;
            for(int j=len1;j>=biao[l];j--)
            {
                s1[j][id[x]]-=s1[j-1][id[x]],s1[j][id[y]]-=s1[j-1][id[y]];
                s2[j][x]-=s2[j-1][x],s2[j][y]-=s2[j-1][y];
            }
            if(biao[l]==biao[r]) change(l,r,biao[l],x,y);
            else
            {
                change(l,rr[biao[l]],biao[l],x,y);
                change(ll[biao[r]],r,biao[r],x,y);
                for(int j=biao[l]+1;j<=biao[r]-1;j++) fun(j,x,y);
            }
            for(int j=biao[l];j<=len1;j++)
            {
                s1[j][id[x]]+=s1[j-1][id[x]],s1[j][id[y]]+=s1[j-1][id[y]];
                s2[j][x]+=s2[j-1][x],s2[j][y]+=s2[j-1][y];
            }
        }
        else
        {
            int sum=0,now,ls,rs;
            l=read(),r=read(),k=read();
            if(biao[l]==biao[r])
            {
                pushdown(biao[l]);
                for(int j=l;j<=r;j++) t1[id[a[j]]]++,t2[a[j]]++;
                for(int j=1;j<=len2;j++)
                {
                    sum+=t1[j];
                    if(sum>=k) {sum-=t1[j],now=j;break;}
                }
                for(int j=lv[now];j<=rv[now];j++)
                {
                    sum+=t2[j];
                    if(sum>=k) {printf("%d\n",j);break;}
                }
                for(int j=l;j<=r;j++) t1[id[a[j]]]--,t2[a[j]]--;
                continue;
            }
            pushdown(biao[l]),pushdown(biao[r]),ls=biao[l]+1,rs=biao[r]-1;
            for(int j=l;j<=rr[biao[l]];j++) t1[id[a[j]]]++,t2[a[j]]++;
            for(int j=ll[biao[r]];j<=r;j++) t1[id[a[j]]]++,t2[a[j]]++;
            for(int j=1;j<=len2;j++)
            {
                sum+=t1[j]+s1[rs][j]-s1[ls-1][j];
                if(sum>=k) {sum-=t1[j]+s1[rs][j]-s1[ls-1][j],now=j;break;}
            }
            for(int j=lv[now];j<=rv[now];j++)
            {
                sum+=t2[j]+s2[rs][j]-s2[ls-1][j];
                if(sum>=k) {printf("%d\n",j);break;}
            }
            for(int j=l;j<=rr[biao[l]];j++) t1[id[a[j]]]--,t2[a[j]]--;
            for(int j=ll[biao[r]];j<=r;j++) t1[id[a[j]]]--,t2[a[j]]--;
        }
    }
    return 0;
}
```
这道题的任何一个题解都比我自己叙述写得好。（~~才不是懒得写了咕咕咕~~

综上，哪里不懂，看题解。

___

#### 总结得差不多，大概就是这些了~~~

>「潘多拉盒子藏在迦南之地，齐天大圣手握着长青剑」