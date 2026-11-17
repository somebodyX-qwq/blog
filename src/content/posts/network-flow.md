---
title: "网络流"
published: 2025-04-23
tags: ["图论", "算法"]
category: "算法"
draft: false
---

~~啊我草这什么啊我以前怎么会这种东西~~

# 1.最大流

给定 $n$ 个点， $m$ 条边，给定每条边的容量，求从点 $s$ 到点 $t$ 的最大流。

```cpp
#include<bits/stdc++.h>
using namespace std;
int tot=1,head[105],nxt[10005],ver[10005],edge[10005],s,t,dis[105],cur[105];
queue<int>q;
void add(int x,int y,int z)
{
    tot++;
    nxt[tot]=head[x];
    head[x]=tot;
    ver[tot]=y;
    edge[tot]=z;
}
int bfs()
{
    bool flag=0;
    memset(dis,0,sizeof(dis));
    q.push(s),dis[s]=1,flag=0;
    while(q.size())
    {
        int x=q.front();
        q.pop();
        for(int i=head[x];i;i=nxt[i])
        {
            int y=ver[i];
            if(edge[i]<=0) continue;
            if(!dis[y])
            {
                dis[y]=dis[x]+1,q.push(y);
                if(y==t) flag=1;
            }
        }
    }
    return flag;
}
int dfs(int x,int ma)
{
    //cout<<x<<endl;
    if(x==t) return ma;
    for(int &i=cur[x];i;i=nxt[i])
    {
        int y=ver[i];
        if(edge[i]==0||dis[x]+1!=dis[y]) continue;
        int u=dfs(y,min(ma,edge[i]));
        if(u>0)
        {
            edge[i]-=u;
            edge[i^1]+=u;
            return u;
        }
    }
    return 0;
}
int main()
{
    long long ans=0;
    int n,m,x,y,z,u;
    scanf("%d%d%d%d",&n,&m,&s,&t);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d",&x,&y,&z);
        add(x,y,z);
        add(y,x,0);
    }
    while(bfs())
    {
       for(int i=1;i<=n;i++) cur[i]=head[i];
       do
       {
            u=dfs(s,1e9);
            ans+=u;
       }while(u);
    }
    cout<<ans;
    return 0;
}#include<bits/stdc++.h>
using namespace std;
int tot=1,head[105],nxt[10005],ver[10005],edge[10005],s,t,dis[105],cur[105];
queue<int>q;
void add(int x,int y,int z)
{
    tot++;
    nxt[tot]=head[x];
    head[x]=tot;
    ver[tot]=y;
    edge[tot]=z;
}
int bfs()
{
    bool flag=0;
    memset(dis,0,sizeof(dis));
    q.push(s),dis[s]=1,flag=0;
    while(q.size())
    {
        int x=q.front();
        q.pop();
        for(int i=head[x];i;i=nxt[i])
        {
            int y=ver[i];
            if(edge[i]<=0) continue;
            if(!dis[y])
            {
                dis[y]=dis[x]+1,q.push(y);
                if(y==t) flag=1;
            }
        }
    }
    return flag;
}
int dfs(int x,int ma)
{
    //cout<<x<<endl;
    if(x==t) return ma;
    for(int &i=cur[x];i;i=nxt[i])
    {
        int y=ver[i];
        if(edge[i]==0||dis[x]+1!=dis[y]) continue;
        int u=dfs(y,min(ma,edge[i]));
        if(u>0)
        {
            edge[i]-=u;
            edge[i^1]+=u;
            return u;
        }
    }
    return 0;
}
int main()
{
    long long ans=0;
    int n,m,x,y,z,u;
    scanf("%d%d%d%d",&n,&m,&s,&t);
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d",&x,&y,&z);
        add(x,y,z);
        add(y,x,0);
    }
    while(bfs())
    {
       for(int i=1;i<=n;i++) cur[i]=head[i];
       do
       {
            u=dfs(s,1e9);
            ans+=u;
       }while(u);
    }
    cout<<ans;
    return 0;
}
```

# 2.最小费用流

给定一个图，每条边有容量和费用，使用每条边的单位流量需要支付特定的费用。给定源点 $1$ 和汇点 $n$，求图的最大流和最大流需要支付的最小费用。

```cpp
#include<bits/stdc++.h>
using namespace std;
queue<int> q;
bool v[405];
int n,m,a[405],pre[405],prei[405];
int head[405],ver[30005],nxt[30005],edge[30005],we[30005],tot=1;
void add(int x,int y,int z,int t)
{
	tot++;
	nxt[tot]=head[x];
	head[x]=tot;
	ver[tot]=y;
	edge[tot]=z;
	we[tot]=t;
}
int spfa()
{
	bool flag=0;
	memset(v,0,sizeof(v));
	memset(a,0x3f,sizeof(a));
	q.push(1),v[1]=1;
	a[1]=0;
	while(q.size())
	{
		int x=q.front();
		q.pop(),v[x]=0;
		for(int i=head[x];i;i=nxt[i])
		{
			int y=ver[i];
			if(a[y]>a[x]+we[i]&&edge[i]!=0)
			{
				a[y]=a[x]+we[i];
				pre[y]=x,prei[y]=i;
				if(y==n) flag=1;
				if(!v[y]) v[y]=1,q.push(y);
			}
		}
	}
	return flag;
}
int main()
{
	long long ans=0,ans1=0;
	int u,v,c,w,mm=1999999999;
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++)
	{
		scanf("%d%d%d%d",&u,&v,&c,&w);
		add(u,v,c,w);
		add(v,u,0,-1*w);
	}
	while(spfa())
	{
		for(int i=n;i!=1;i=pre[i]) mm=min(mm,edge[prei[i]]);
		for(int i=n;i!=1;i=pre[i])
		{
			edge[prei[i]]-=mm;
			edge[prei[i]^1]+=mm;
			ans1+=mm*we[prei[i]];
		}
		ans+=mm;
	}
	cout<<ans<<" "<<ans1;
	return 0;
}
```

# 无源汇有上下界可行流

$n$ 个点， $m$ 条边，每条边 $e$ 有一个流量下界 $\text{lower}(e)$ 和流量上界 $\text{upper}(e)$，求一种可行方案使得在所有点满足流量平衡条件的前提下，所有边满足流量限制。

```cpp
#include<bits/stdc++.h>
using namespace std;
queue<int> q;
int dis[2005],cur[2005],a[2005],l[30405],n,m;
int tot=1,head[2005],ver[30405],nxt[30405],edge[30405];
void add(int x,int y,int z)
{
	tot++;
	nxt[tot]=head[x];
	head[x]=tot;
	ver[tot]=y;
	edge[tot]=z;
}
int bfs()
{
	bool flag=0;
	memset(dis,-1,sizeof(dis));
	dis[0]=0;
	q.push(0);
	while(q.size())
	{
		int x=q.front();
		q.pop();
		for(int i=head[x];i;i=nxt[i])
		{
			int y=ver[i];
			if(edge[i]>0&&dis[y]==-1)
			{
				dis[y]=dis[x]+1;
				q.push(y);
				if(y==n+1) flag=1;
			}
		}
	}
	return flag;
}
int dfs(int x,int mm)
{
	if(x==n+1) return mm;
	for(int &i=cur[x];i;i=nxt[i])
	{
		int y=ver[i];
		if(edge[i]==0||dis[x]+1!=dis[y]) continue;
		int u=dfs(y,min(mm,edge[i]));
		if(u>0)
		{
			edge[i]-=u;
			edge[i^1]+=u;
			return u;
		}
	}
	return 0;
}
int main()
{
	int s,t,low,up,u;
	scanf("%d%d",&n,&m);
	for(int i=1;i<=m;i++)
	{
		scanf("%d%d%d%d",&s,&t,&low,&up);
		a[s]-=low;
		a[t]+=low;
		add(s,t,up-low);
		l[tot]=low;
		add(t,s,0);
		l[tot]=low;
	}
	for(int i=1;i<=n;i++)
	{
		if(a[i]>0) add(0,i,a[i]),add(i,0,0);
		else if(a[i]<0) add(i,n+1,-1*a[i]),add(n+1,i,0);
	}
	while(bfs())
	{
		for(int i=0;i<=n+1;i++) cur[i]=head[i];
		do
		{
			u=dfs(0,1999999999);
		}while(u);
	}
	for(int i=head[0];i;i=nxt[i])
	{
		//cout<<edge[i]<<" ";
		if(edge[i]!=0)
		{
			cout<<"NO";
			return 0;
		}
	}
	cout<<"YES"<<endl;
	for(int i=2;i<=2*m;i+=2) printf("%d\n",l[i]+edge[i^1]);
	return 0;
}
```

# 4.有源汇有上下界最大流

$n$ 个点， $m$ 条边，每条边 $e$ 有一个流量下界 $\text{lower}(e)$ 和流量上界 $\text{upper}(e)$，给定源点 $s$ 与汇点 $t$，求源点到汇点的最大流。

```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,s,t,a[4100],dis[4100],cur[4100];
int tot=1,head[4100],ver[200005],nxt[200005],edge[200005];
queue<int> q;
void add(int x,int y,int z)
{
	tot++;
	nxt[tot]=head[x];
	head[x]=tot;
	ver[tot]=y;
	edge[tot]=z;
}
int bfs(int x,int xx)
{
	bool flag=0;
	memset(dis,-1,sizeof(dis));
	dis[x]=0;
	q.push(x);
	while(q.size())
	{
		x=q.front();
		q.pop();
		for(int i=head[x];i;i=nxt[i])
		{
			int y=ver[i];
			if(dis[y]!=-1||edge[i]==0) continue;
			dis[y]=dis[x]+1;
			q.push(y);
			if(y==xx) flag=1;
		}
	}
	return flag;
}
int dfs(int x,int mm,int ss)
{
	if(x==ss) return mm;
	for(int &i=cur[x];i;i=nxt[i])
	{
		int y=ver[i];
		if(edge[i]==0||dis[x]+1!=dis[y]) continue;
		int u=dfs(y,min(mm,edge[i]),ss);
		//cout<<y<<" "<<u<<" "<<ss<<" "<<endl;
		if(u>0)
		{
			edge[i]-=u;
			edge[i^1]+=u;
			return u;
		}
	}
	return 0;
}
int main()
{
	long long ans=0;
	int low,up,u,v;
	scanf("%d%d%d%d",&n,&m,&s,&t);
	for(int i=1;i<=m;i++)
	{
		scanf("%d%d%d%d",&u,&v,&low,&up);
		a[u]-=low;
		a[v]+=low;
		add(u,v,up-low);
		add(v,u,0);
	}
	for(int i=1;i<=n;i++)
	{
		if(a[i]>0) add(0,i,a[i]),add(i,0,0);
		else if(a[i]<0) add(i,n+1,-1*a[i]),add(n+1,i,0);
	}
	add(t,s,1999999999);
	add(s,t,0);
	while(bfs(0,n+1))
	{
		for(int i=0;i<=n+1;i++) cur[i]=head[i];
		do
		{
			u=dfs(0,1999999999,n+1);
		}while(u);
	}
	for(int i=head[0];i;i=nxt[i])
	{
		if(edge[i]!=0)
		{
			cout<<"please go home to sleep";
			return 0;
		}
	}
	while(bfs(s,t))
	{
		for(int i=0;i<=n+1;i++) cur[i]=head[i];
		do
		{
			u=dfs(s,1999999999,t);
			ans+=u;
		}while(u);
	}
	cout<<ans;
	return 0;
}
```

# 5.有源汇有上下界最小流

$n$ 个点， $m$ 条边，每条边 $e$ 有一个流量下界 $\text{lower}(e)$ 和流量上界 $\text{upper}(e)$，给定源点 $s$ 与汇点 $t$，求源点到汇点的最小流。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int M=60015;
long long edge[10*M],a[M];
int tot=1,head[M],cur[M],ver[10*M],nxt[10*M],dis[M],ss,tt,fl1,fl2,n;
queue<int>q;
void add(int x,int y,long long z)
{
	tot++;
	nxt[tot]=head[x];
	head[x]=tot;
	ver[tot]=y;
    edge[tot]=z;
}
bool bfs(bool flag)
{
    memset(dis,0,sizeof(dis));
    dis[ss]=1,q.push(ss);
    while(q.size())
    {
        int x=q.front();q.pop();
        for(int i=head[x];i;i=nxt[i])
        {
            int y=ver[i];
            if(dis[y]||!edge[i]) continue;
            if(flag&&(i==fl1||i==fl2||y==0||y==n+1)) continue;
            dis[y]=dis[x]+1,q.push(y);
        }
    }
    return dis[tt]>0;
}
long long dfs(int x,long long ma,bool flag)
{
    if(x==tt) return ma;
    long long now=ma;
    for(int &i=cur[x];i&&now;i=nxt[i])
    {
        int y=ver[i];
        if(dis[y]!=dis[x]+1||edge[i]<=0) continue;
        if(flag&&(i==fl1||i==fl2||y==0||y==n+1)) continue;
        long long u=dfs(y,min(now,edge[i]),flag);
        edge[i]-=u,edge[i^1]+=u,now-=u;
        if(!now) break;
    }
    return ma-now;
}
int main()
{
    int m,s,t,x,y,low,up;
    long long ans=0;
    scanf("%d%d%d%d",&n,&m,&s,&t),ss=0,tt=n+1;
    for(int i=1;i<=m;i++)
    {
        scanf("%d%d%d%d",&x,&y,&low,&up);
        a[x]-=low,a[y]+=low;
        add(x,y,up-low),add(y,x,0);
    }
    for(int i=1;i<=n;i++)
    {
        if(a[i]>0) add(0,i,a[i]),add(i,0,0);
        else if(a[i]<0) add(i,n+1,-a[i]),add(n+1,i,0);
    }
    add(t,s,2e18),fl1=tot,add(s,t,0),fl2=tot;
    while(bfs(0))
    {
        for(int i=0;i<=n+1;i++) cur[i]=head[i];
        ans+=dfs(0,2e18,0);
    }
    for(int i=head[0];i;i=nxt[i])
        if(edge[i]) {printf("please go home to sleep");return 0;}
    ss=t,tt=s;
    while(bfs(1))
    {
        for(int i=0;i<=n+1;i++) cur[i]=head[i];
        ans-=dfs(ss,2e18,1);
    }
    cout<<min(ans,edge[fl2]);
    return 0;
}
```