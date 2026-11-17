---
title: "莫队"
published: 2022-06-26
publishedAt: 2022-06-26T21:40:00+08:00
tags: ["数据结构", "算法"]
category: "算法"
draft: false
---

与分块一样是根号类型数据结构~~

但与分块不同的是一定要保证题目**离线**，因此许多强制在线题便不能使用莫队。

常数有点大，但打得好可以吊打一众在线数据结构（~~大概~~）

------------
自我感觉莫队的重点在**移动区间——处理答案**。

先把询问区间离线下来，对整个区间分块，并记录询问区间左端点所在块的标号。

将**左区间所在块标号**作为第一关键字，右区间作为第二关键字对询问区间进行排序，遍历询问时移动目标区间，使其移动到当前答案区间，最后更新答案。一般题目模板如下：
```cpp左区间所在块标号**相同的询问归为一类进行求解。

对每一类而言，如果左右区间所在块的标号相同，那么就可以直接对该询问暴力查找。
while(r<rr) r++,add(r);
while(l>ll) l--,add(l);
while(r>rr) del(r),r--;
while(l<ll) del(l),l++;
```
这时要注意顺序。**先扩大区间，再缩小**。

因为提前处理过询问区间，因此大多时可以卡过时间。

也可以用一种更有效的优化方法：当左区间所在块标号为**奇数**时，右区间**从小到大**排序；当左区间所在块标号为**偶数**时，右区间**从大到小**排序。这样使答案区间返回时也能充分利用到。
```cpp
bool cmp(node x,node y)
{
	if(x.kuai==y.kuai)
	{
		if(x.kuai%2) return x.r<y.r;
		else return x.r>y.r;
	}
	else return x.kuai<y.kuai;
}
```
------------
## 1.莫队
### 例 小Z的袜子 [传送门](https://www.luogu.com.cn/problem/P1494)
很经典的例题了~~ 推式子可得每个颜色$i$对答案的贡献是$cnt_{i}$ * $(cnt_{i}-1)$,移动答案区间时做相应修改，最后除以$len$ * $(len-1)$即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
long long anss1[50005],anss2[50005],ans=0;
int c[50005],t[50005];
struct node
{
	int l,r,id,kuai;
}q[50005];
bool cmp(node x,node y)
{
	if(x.kuai==y.kuai)
	{
		if(x.kuai%2) return x.r<y.r;
		else return x.r>y.r;
	}
	else return x.kuai<y.kuai;
}
long long C(int x)
{
	if(x==0) return 0;
	return 1ll*x*(x-1)/2;
}
void add(int x)
{
	ans-=C(t[c[x]]);
	t[c[x]]++;
	ans+=C(t[c[x]]);
}
void del(int x)
{
	ans-=C(t[c[x]]);
	t[c[x]]--;
	ans+=C(t[c[x]]);
}
long long gc(long long a,long long b)
{
	if(b==0) return a;
	return gc(b,a%b);
}
int main()
{
	long long sum;
	int n,m,h,l=1,r=0,ll,rr,x;
	scanf("%d%d",&n,&m);
	h=sqrt(n);
	for(int i=1;i<=n;i++) scanf("%d",&c[i]);
	for(int i=1;i<=m;i++)
	{
		scanf("%d%d",&q[i].l,&q[i].r);
		q[i].id=i,q[i].kuai=q[i].l/h+1;
	}
	sort(q+1,q+m+1,cmp);
	for(int i=1;i<=m;i++)
	{
		ll=q[i].l,rr=q[i].r;
		if(ll==rr)
		{
			anss1[q[i].id]=0;
			anss2[q[i].id]=1;
			continue;
		}
		while(r<rr) r++,add(r);
		while(l>ll) l--,add(l);
		while(r>rr) del(r),r--;
		while(l<ll) del(l),l++;
		sum=C(r-l+1);
		x=gc(ans,sum);
		anss1[q[i].id]=ans/x,anss2[q[i].id]=sum/x;
		if(ans==0) anss1[q[i].id]=0,anss2[q[i].id]=1;
	}
	for(int i=1;i<=m;i++) printf("%lld/%lld\n",anss1[i],anss2[i]);
	return 0;
}
```
### 例 分块入门九
莫队+线段树~~离谱~~做法。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[200005],b[200005],c[200005],ans[200005],tree[800005],idd[800005];
struct node
{
    int l,r,id,anss;
}que[200005];
bool cmp(node x,node y)
{
    if(x.id==y.id)
    {
        if(x.id%2) return x.r<y.r;
        else return x.r>y.r;
    }
    else return x.id<y.id;
}
void change(int l,int r,int rt,int x,int val)
{
    if(l==r)
    {
        tree[rt]+=val;
        idd[rt]=l;
        if(tree[rt]==0) idd[rt]=0;
        return;
    }
    int mid=(l+r)/2;
    if(x<=mid) change(l,mid,rt<<1,x,val);
    else change(mid+1,r,rt<<1|1,x,val);
    if(tree[rt<<1]==0&&tree[rt<<1|1]==0)
    {
        tree[rt]=idd[rt]=0;
        return;
    }
    if(tree[rt<<1]==0||tree[rt<<1|1]==0)
    {
        tree[rt]=tree[rt<<1]+tree[rt<<1|1];
        idd[rt]=idd[rt<<1]+idd[rt<<1|1];
        return;
    }
    if(tree[rt<<1]>=tree[rt<<1|1]) tree[rt]=tree[rt<<1],idd[rt]=idd[rt<<1];
    else tree[rt]=tree[rt<<1|1],idd[rt]=idd[rt<<1|1];
}
int main()
{
    int n,x,nn,t,l=1,r=1,ll,rr;
    scanf("%d",&n);
    t=sqrt(n);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]),b[i]=a[i];
    sort(b+1,b+n+1);
    nn=unique(b+1,b+n+1)-b-1;
    for(int i=1;i<=n;i++)
    {
        x=lower_bound(b+1,b+nn+1,a[i])-b;
        c[x]=a[i],a[i]=x;
    }
    for(int i=1;i<=n;i++) scanf("%d%d",&que[i].l,&que[i].r),que[i].id=(que[i].l-1)/t+1,que[i].anss=i;
    sort(que,que+n+1,cmp);
    change(1,nn,1,a[1],1);
    for(int i=1;i<=n;i++)
    {
        ll=que[i].l,rr=que[i].r;
        while(l>ll) l--,change(1,nn,1,a[l],1);
        while(r<rr) r++,change(1,nn,1,a[r],1);
        while(l<ll) change(1,nn,1,a[l],-1),l++;
        while(r>rr) change(1,nn,1,a[r],-1),r--;
        ans[que[i].anss]=c[idd[1]];
    }
    for(int i=1;i<=n;i++) printf("%d\n",ans[i]);
    return 0;
}
```
其实常数很大，代码也挺难调，不建议打。
## 2.带修莫队
其实带入普通莫队思想，就是在左端点、右端点的基础上又加了一维——**时间**。

在排序时要额外记录该询问的时间节点，作为第三关键字。
### 例 [[国家集训队] 数颜色 / 维护队列](https://www.luogu.com.cn/problem/P1903)
就是带修莫队裸题啦~~
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[140005],change[140005],color[140005],sum[1000005],pre[140005],anss[140005],ans=1;
struct node
{
    int l,r,ll,rr,time,id;
}s[140005];
int read()
{
    int w=0,s=1;
    char ch=getchar();
    while(ch<'0'||ch>'9') {if(ch=='-') s=-1;ch=getchar();}
    while(ch>='0'&&ch<='9') {w=w*10+ch-'0';ch=getchar();}
    return s*w;
}
bool cmp(node x,node y)
{
    if(x.ll==y.ll&&x.rr==y.rr) return x.time<y.time;
    else if(x.ll==y.ll)
    {
        if(x.ll%2) return x.rr<y.rr;
        else return x.rr>y.rr;
    }
    else return x.ll<y.ll;
}
void add(int x,int val)
{
    int pre=sum[x];
    sum[x]+=val;
    if(pre==0&&sum[x]) ans++;
    else if(pre&&sum[x]==0) ans--;
}
void add_time(int l,int r,int ti)
{
    if(change[ti]>=l&&change[ti]<=r) add(a[change[ti]],-1),add(color[ti],1);
    pre[ti]=a[change[ti]];
    a[change[ti]]=color[ti];
}
void cut_time(int l,int r,int ti)
{
    if(change[ti]>=l&&change[ti]<=r) add(a[change[ti]],-1),add(pre[ti],1);
    a[change[ti]]=pre[ti];
}
int main()
{
    char c;
    int n,m,cnt=0,x,y,tot=0,t,l=1,r=1,tim=0,sl,sr,st;
    n=read(),m=read();
    for(int i=1;i<=n;i++) a[i]=read();
    sum[a[1]]=1;
    for(int i=1;i<=m;i++)
    {
        scanf(" %c",&c);
        x=read(),y=read();
        if(c=='Q') tot++,s[tot].l=x,s[tot].r=y,s[tot].time=cnt,s[tot].id=tot;
        else cnt++,change[cnt]=x,color[cnt]=y;
    }
    t=pow(n,2.0/3.0);
    for(int i=1;i<=tot;i++)
    {
        s[i].ll=s[i].l/t+1;
        s[i].rr=s[i].r/t+1;
    }
    sort(s+1,s+tot+1,cmp);
    for(int i=1;i<=tot;i++)
    {
        sl=s[i].l,sr=s[i].r,st=s[i].time;
        while(l>sl) l--,add(a[l],1);
        while(r<sr) r++,add(a[r],1);
        while(l<sl) add(a[l],-1),l++;
        while(r>sr) add(a[r],-1),r--;
        while(tim<st) tim++,add_time(l,r,tim);
        while(tim>st) cut_time(l,r,tim),tim--;
        anss[s[i].id]=ans;
    }
    for(int i=1;i<=tot;i++) printf("%d\n",anss[i]);
    return 0;
}
```

## 3.bitset 套莫队

其实不能算作一种算法，只是一种思路，但还是挺有意思的就写在这里了。

维护某个区间中是否出现过一种元素只需要一个 $bool$ 数组，那么如果要记录某个区间中一种元素出现过几次呢？一个 $int$ 数组吗。。。

那如果还需要对几个区间的同一种元素的出现次数取 $min$ 呢？这样用 $int$ 数组求一遍就是 $O$(值域大小) 了。

~~对不起打扰了~~

其实上述操作一个 $bitset$ 就可以解决。

### 例 [P4688 [Ynoi2016] 掉进兔子洞](https://www.luogu.com.cn/problem/P4688)

首先对题目所求做一个转化。设区间长度为 $len$，$size$ 为三个区间出现的公共数字个数之和，那么所求答案为：

$$len1+len2+len3-3 \times size$$

现在重点就变成了如何求三个区间出现的公共数字个数之和。

我们再来考虑刚刚说到的问题：如何用一个简单数据结构/ stl 工具维护区间某个数据的出现次数并支持取 $min$ 操作。

经过清奇的脑回路。。。发现可以用 $bitset$ 乱搞！

原本的 $bitset$ 是这样的:

![](https://cdn.luogu.com.cn/upload/image_hosting/csnvn88h.png)

现在把它变成这样：

![](https://cdn.luogu.com.cn/upload/image_hosting/bbfmx49j.png)

简单地说就是用一段 $01$ 的区间来表示某个数的信息，该区间中有几个 $1$ 就代表有几个数，这样数量加 $1$ 减 $1$ 也很好维护，几个区间取 $min$ 的话便是对应的 $bitset$ 进行与操作，这样就可以用 $bitset$ 套莫队解决这道题了。

具体做法而言可以先求每种颜色总共的个数，为 $bitset$ 预留好空间，将哪个询问对应哪个区间记录下来，再使用莫队实现对 $bitset$ 的维护。

这道题还有一个坑点是询问次数那么多的 $bitset$ 开不下。。。将询问分成几次做就好。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5;
int a[M],c[M],cnt[M],now[M],len[M];
bool v[M],vis[M];
bitset<M>b[20005],bit;
struct node
{
    int l,r,id,kuai;
}q[M];
bool cmp(node x,node y)
{
    if(x.kuai==y.kuai) return x.r<y.r;
    else return x.kuai<y.kuai;
}
void add(int x)
{
    now[x]++;
    bit[cnt[x]-now[x]+1]=1;
}
void del(int x)
{
    bit[cnt[x]-now[x]+1]=0;
    now[x]--;
}
void calc(int n)
{
    memset(now,0,sizeof(now));
    memset(v,0,sizeof(v));
    memset(vis,0,sizeof(vis));
    bit.reset();
    int tot=0,l=1,r=0,sq=sqrt(n);
    for(int i=1;i<=n;i++)
    {
        b[i].reset(),len[i]=0;
        for(int j=1;j<=3;j++)
        {
            tot++,scanf("%d%d",&q[tot].l,&q[tot].r);
            q[tot].id=i,q[tot].kuai=(q[tot].l-1)/sq+1;
            len[i]+=q[tot].r-q[tot].l+1;
        }
    }
    sort(q+1,q+tot+1,cmp);
    for(int i=1;i<=tot;i++)
    {
        while(l>q[i].l) l--,add(a[l]);
        while(r<q[i].r) r++,add(a[r]);
        while(l<q[i].l) del(a[l]),l++;
        while(r>q[i].r) del(a[r]),r--;
        if(!vis[q[i].id]) vis[q[i].id]=1,b[q[i].id]=bit;
        else b[q[i].id]&=bit;
    }
    for(int i=1;i<=n;i++)
        printf("%d\n",len[i]-3*b[i].count());
}
int main()
{
    int n,m,nn;
    scanf("%d%d",&n,&m);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]),c[i]=a[i];
    sort(c+1,c+n+1),nn=unique(c+1,c+n+1)-c-1;
    for(int i=1;i<=n;i++) a[i]=lower_bound(c+1,c+nn+1,a[i])-c,cnt[a[i]]++;
    for(int i=2;i<=nn;i++) cnt[i]+=cnt[i-1];
    while(m)
    {
        if(m<2e4) calc(m),m=0;
        else calc(2e4),m-=2e4;
    }
    return 0;
}
```

## 4.回滚莫队

在实际做题时会发现有些信息容易添加，但不容易删除，比如区间最大值/最小值等。这种问题就可以用回滚莫队解决了。

还是和之前一样先对询问操作进行排序，然后将**左区间所在块标号**相同的询问归为一类进行求解。

对每一类而言，先将当前的已知区间 $l$ 与 $r$ 定位到当前块末端（$l=id \times t+1$，$r=id\times t$），先拓展右端点，将当前答案先记录下来，然后再拓展左端点求得答案。求解之后**将当前状态恢复到拓展完右端点后的状态**，继续查找下一个询问区间。

如果这样进行处理，可以发现：

- 右端点一直在向右拓展，不会往回走。

- 左端点在当前块内来回移动。

时间复杂度可以保证。

如果左右区间所在块的标号相同，那么就可以直接对该询问进行暴力查找，因为块长为 $O(\sqrt n)$，同样不影响复杂度。

这样整个问题的复杂度还是 $O(n\sqrt n)$ 的。

### 例 [歴史の研究](https://www.luogu.com.cn/problem/AT_joisc2014_c)

回滚莫队板子题，但要注意恢复状态时开一个栈维护序列（~~不然一个一个复制太蠢了虽然我差点这么干~~）

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5;
int a[M],biao[M],t[M],b[M],vv[M],st[M],top=0;
struct node
{
    long long ans;
    int l,r,kuai=0,id;
}que[M];
bool cmp(node x,node y)
{
    if(x.kuai==y.kuai) return x.r<y.r;
    else return x.kuai<y.kuai;
}
bool cmpp(node x,node y) {return x.id<y.id;}
int main()
{
    long long ans=0,last;
    int n,nn,q,sq,l,r,ll,rr;
    scanf("%d%d",&n,&q),sq=sqrt(n);
    for(int i=1;i<=n;i++)
    {
        scanf("%d",&a[i]),b[i]=a[i];
        biao[i]=(i-1)/sq+1;
    }
    sort(b+1,b+n+1),nn=unique(b+1,b+n+1)-b-1;
    for(int i=1;i<=n;i++) a[i]=lower_bound(b+1,b+nn+1,a[i])-b;
    for(int i=1;i<=q;i++)
    {
        scanf("%d%d",&que[i].l,&que[i].r),que[i].id=i;
        que[i].kuai=(que[i].l-1)/sq+1;
    }
    sort(que+1,que+q+1,cmp);
    for(int i=1;i<=q;i++)
    {
        ll=que[i].l,rr=que[i].r;
        if(que[i-1].kuai!=que[i].kuai)
        {
            while(top) t[st[top]]--,top--;
            l=que[i].kuai*sq+1,r=que[i].kuai*sq,ans=0;
        }
        if(biao[ll]==biao[rr])
        {
            long long anss=0;
            for(int j=ll;j<=rr;j++)
            {
                vv[a[j]]++;
                anss=max(anss,1ll*vv[a[j]]*b[a[j]]);
            }
            for(int j=ll;j<=rr;j++) vv[a[j]]--;
            que[i].ans=anss;
            continue;
        }
        while(r<rr)
        {
            r++,t[a[r]]++,top++,st[top]=a[r];
            ans=max(ans,1ll*t[a[r]]*b[a[r]]);
        }
        last=ans;
        while(l>ll)
        {
            l--,t[a[l]]++;
            ans=max(ans,1ll*t[a[l]]*b[a[l]]);
        }
        que[i].ans=ans;
        while(l<que[i].kuai*sq+1) t[a[l]]--,l++;
        ans=last;
    }
    sort(que+1,que+q+1,cmpp);
    for(int i=1;i<=q;i++) printf("%lld\n",que[i].ans);
    return 0;
}
```

莫队中还有很多类型，如树上莫队、第X分块、莫队二次离线等等~~太菜了这些都不会~~。在此不一一总结，有需要再整理。

本来这篇文章是2022年开的坑，直到现在（2023年）时隔整整一年才把它初步完成，还有很多地方不完整，就当是为当时不成熟的总结做一个小小的收尾吧。
## 5.莫队二次离线

~~草这文章怎么还在更啊~~

众所周知莫队是一种离线算法。但在移动莫队的过程中如果做一次操作达不到 $O(1)$ 的复杂度，莫队的整体复杂度就会飙升。

那么有没有一种方法可以把这些移动的操作记录下来，统一处理呢？答案就是莫队二次离线了。

### 例：[【模板】莫队二次离线（第十四分块(前体)）](https://www.luogu.com.cn/problem/P4887)

这道题就是这样的例子。由于 $popcount(x)$ 为 $k$ 的数不唯一，每次拓展一个数便需要与当前区间的数异或并检查它的 $popcount(x)$。但这样很明显是 $O(n)$ 的东西，所以考虑莫队二次离线。

以向右拓展为例，设当前拓展的点为 $r+1$，当前区间为 $[l,r]$，增加 $r+1$ 这个点对该区间的贡献为 $f(l,r,r+1)$，则 $f(l,r,r+1)$ 可以被表示为：

$$f(l,r,r+1)=f(1,r,r+1)-f(1,l-1,r+1)$$

这样便把一个点对一段区间的贡献转化为一个点对一段前缀和的贡献了！但是这样直接预处理还是不可接受的，通过观察可以发现我们实际需要计算的其实没有那么多，不妨考虑把哪个位置需要查询哪段前缀和记录下来，再扫描一遍整个数组，开一个桶维护当前答案，扫描到某一个前缀，先是记录一下当前位置的前缀对它的贡献（就是加起来的那部分），再把它所对应的位置暴力加上对应的答案。

在经过一番处理过后这个莫队甚至可以做到 $O(n)$ 处理询问！莫队二次离线的主要思想是转化贡献，统一处理改变区间后对贡献的影响，已达到快速移动的目的，实现复杂度的分离。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=1e5+5;
int a[M];
struct node
{
    int l,r,kuai,id;
    long long ans;
}que[M];
struct nod
{
    int l,r,kuai;
};
vector<nod>v1[M],v2[M];
long long c[4*M],s1[M],s2[M],t[17000];
int tot=0,b[M];
int calc(int x)
{
    int ans=0;
    for(int i=0;i<14;i++)
        if((x>>i)&1) ans++;
    return ans;
}
bool cmp(node x,node y)
{
    if(x.kuai!=y.kuai) return x.kuai<y.kuai;
    else
    {
        if(x.kuai&1) return x.r<y.r;
        else return x.r>y.r;
    }
}
bool cmpp(node x,node y)
{
    return x.id<y.id;
}
int main()
{
    long long ans=0;
    int n,m,k,tt,l=1,r=0,ll,rr,cnt=0;
    scanf("%d%d%d",&n,&m,&k),tt=sqrt(n);
    for(int i=1;i<=n;i++) scanf("%d",&a[i]);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d",&que[i].l,&que[i].r),que[i].id=i;
        que[i].kuai=(que[i].l-1)/tt+1;
    }
    sort(que+1,que+m+1,cmp);
    for(int i=0;i<16384;i++)
        if(calc(i)==k) tot++,b[tot]=i;
    for(int i=1;i<=m;i++)
    {
        ll=que[i].l,rr=que[i].r;
        if(r<rr) cnt++,v1[l-1].push_back(nod{r+1,rr,cnt}),r=rr;
        if(l>ll) cnt++,v2[r+1].push_back(nod{ll,l-1,cnt}),l=ll;
        if(r>rr) cnt++,v1[l-1].push_back(nod{rr+1,r,cnt}),r=rr;
        if(l<ll) cnt++,v2[r+1].push_back(nod{l,ll-1,cnt}),l=ll;
    }
    for(int i=1;i<=n;i++)
    {
        s1[i]=t[a[i]]+s1[i-1];
        for(int j=1;j<=tot;j++) t[a[i]^b[j]]++;
        for(auto it:v1[i])
        {
            l=it.l,r=it.r;
            for(int j=l;j<=r;j++) c[it.kuai]+=t[a[j]];
        }
    }
    memset(t,0,sizeof(t));
    for(int i=n;i>=1;i--)
    {
        s2[i]=t[a[i]]+s2[i+1];
        for(int j=1;j<=tot;j++) t[a[i]^b[j]]++;
        for(auto it:v2[i])
        {
            l=it.l,r=it.r;
            for(int j=l;j<=r;j++) c[it.kuai]+=t[a[j]];
        }
    }
    l=1,r=0,cnt=0;
    for(int i=1;i<=m;i++)
    {
        ll=que[i].l,rr=que[i].r;
        if(r<rr) cnt++,ans+=s1[rr]-s1[r]-c[cnt],r=rr;
        if(l>ll) cnt++,ans+=s2[ll]-s2[l]-c[cnt],l=ll;
        if(r>rr) cnt++,ans-=s1[r]-s1[rr]-c[cnt],r=rr;
        if(l<ll) cnt++,ans-=s2[l]-s2[ll]-c[cnt],l=ll;
        que[i].ans=ans;
    }
    sort(que+1,que+m+1,cmpp);
    for(int i=1;i<=m;i++) printf("%lld\n",que[i].ans);
    return 0;
}
```
类似的题还有：
- [ [Ynoi2019 模拟赛] Yuno loves sqrt technology II](https://www.luogu.com.cn/problem/P5047)

___

这下应该是最后的更新了。

这没时间更了一定不更了咕咕咕

~~明明是多更了东西为什么还要咕咕咕呢~~

___
$$Never\ ending\ world...$$