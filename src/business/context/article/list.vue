<template>
	<div>
		<p>文章列表</p>
		<div class="condition clearfix">
			<div class="control_input">
				<label class="label">搜索内容</label>
				<div><my-select :select="search" @callback="changeData"></my-select></div>
				<label class="label">请输入过滤条件</label>
				<input type="text" v-model="condition" class="input input_long" @keydown="listen" @blur="getData">
			</div>
			<div class="control_input">
				<label class="label">开始时间</label>
				<my-time :timeObj="startTime"></my-time>
				<label class="label">结束时间</label>
				<my-time :timeObj="endTime"></my-time>
			</div>
			<div class="control_input">
				<label class="label">排序条件</label>
				<div><my-select :select="sort"></my-select></div>
			</div>
		</div>
		<div class="clearfix">
			<a href="#/newArticle" class="btn btn_small btn_post">发帖</a>
		</div>
		<div class="article_list">
			<div class="article_item" v-for="article in articles">
				<div class="article_title"><span @click='goDetail(article)'>{{article.title}}</span></div>
				<div class="div_user">
					<a @click="goPerson(article.userId)" @mouseover="showPerson(article.userId)" @mouseout="hidePerson">{{article.name}}</a>
					<span>{{article.date}}</span>
				</div>
				<div @click='goDetail(article)' class="div_context">
					{{article.context}}
				</div>
				<div class="div_data">
					<span title="阅读量"><img :src="img.read">({{article.read}})</span>
					<span title="评论数"><img :src="img.comment">({{article.comment}})</span>
					<span @click="report(article)" style="cursor:pointer" title="转发次数"><img :src="img.report">({{article.report}})</span>
					<span title="点赞" @click="support(article)" :class="{'sp_selected':isSupported(article.totalS)}"><img :src="isSupported(article.totalS) ? img.support:img.supportGray">({{article.support}})</span>
				</div>
			</div>
			<div class="div_load" v-if='flag.load'></div>
			<div class="div_nomore" v-if='flag.noMore'>没有更多~~</div>
		</div>
		<div class="div_fixed" v-if="flag.showTop">
			<div class="div_top" @click="goTop"></div>
		</div>
		<div class="show_personal_msg" v-if="flag.showPerson">
			<div class="div_load"></div>
		</div>
	</div>
</template>
<script>
export default{
	name: 'articleList',
	data(){
		return{
			userId: null,
			articles: [],
			page: {
				number: 1,
				size: 10
			},
			img:{
				read: require('./commoIcon/eye.png'),
				comment: require('./commoIcon/view.png'),
				report: require('./commoIcon/report.png'),
				support: require('./commoIcon/support.png'),
				supportGray: require('./commoIcon/support_gray.png')
			},
			flag:{
				load: true,
				noMore: false,
				showTop: false,
				showPerson: false,
			},
			persons: {},
			condition: '',
			search: {
				// query: true,
				data: [
					{id: 1,name: '标题',label: 'title'},
					{id: 2,name: '内容',label: 'context'}
				],
				selected: 1
			},
			sort: {
				data:[{}]
			},
			startTime: {
				selected: ''
			},
			endTime: {
				selected: '',
				max: (new Date()),
				// selected: '2017-11-09',
				// disable: true
			}
		}
	},
	methods: {
		init: function(){
			let userStr = this.$utils.getLocal('user')
			let user = userStr ? JSON.parse(userStr):''
			if(user)this.userId = user.id
			this.getData()
		},
		getData: function(){
			let that = this
			this.page.number = 1
			let para = {
				number: this.page.number,
				size: this.page.size,
			}
			para.condition =[]
			let c = {}
			c[this.search.data[this.search.selected-1].label] = this.condition
			para.condition.push(c)
			para.condition = JSON.stringify(para.condition)
			this.$api.articleList(para).then(function(res){
				that.flag.load = false
				if(res.status == 200){
					if(res.data.code == 0){
						that.articles = res.data.msg
						if(res.data.msg.length == 10)that.flag.noMore = false
					}
					else{
						that.Layer.tips(res.data.msg)
					}
				}
			})
		},
		getData2: function(){
			this.flag.load = true
			let para = {
				number: this.page.number,
				size: this.page.size,
			}
			para.condition =[]
			let c = {}
			c[this.search.data[this.search.selected-1].label] = this.condition
			para.condition.push(c)
			para.condition = JSON.stringify(para.condition)
			para[this.search.data[this.search.selected-1].label] = JSON.stringify(this.condition)
			this.$api.articleList(para).then((res)=>{
				if(res.status == 200){
					this.flag.load = false
					if(res.data.code == 0){
						this.articles = this.articles.concat(res.data.msg)
						if(res.data.msg.length < 10)this.flag.noMore = true
					}
					else{
						console.log(res.data.msg)
					}
				}
			})
		},
		changeData: function(){
			console.log(this.sort.data)
			this.sort.selected = null
			if(this.sort.data[0].id){
				this.sort.data = [
					{id:3,name:'时间2'},
					{id:4,name:'回复数2'}
				]
			}
			else{
				this.sort.data = [
					{id:1,name:'时间'},
					{id:2,name:'回复数'}
				]
			}		
		},
		listen: function(){
			let code = event.keyCode
			if(code === 13){
				this.getData()
			}
		},
		goDetail: function(article){
			sessionStorage.article = article.id
			location.href = '#/articleDetail'
		},
		isSupported: function(s){
			if (!s) return
			s = s.split(',')
			if(s.indexOf(this.userId) !== -1)return true
		},
		support: function(a){
			let dom = event.target
			if(dom.nodeName == 'IMG')dom = dom.parentNode
			let className = dom.className
			let flag = true
			if(className == 'sp_selected'){
				flag = false
			}
			let para = {
				userId: this.userId,
				postId: a.id,
				commentId: 0,
				type: 0,
				flag: flag
			}
			let that = this
			if(flag){
				a.support++
				if(!a.totalS)a.totalS = that.userId
				else{
					let s = a.totalS.split(',')
					s.push(that.userId)
					a.totalS = s.join(',')
				}
			}
			else{
				a.support--
				if(a.support < 0)a.support = 0
				if(a.totalS){
					let s = a.totalS.split(',')
					let idx = s.indexOf(that.userId)
					s.splice(idx,1)
					a.totalS = s.join(',')
				}
			}
			this.$api.addSupport(para)
		},
		report: function(article){
			this.Layer.prompt('请确认标题：',article.title,(val)=>{
				if(val){
					let para = {
						userId: this.userId,
						title: val,
						context: article.context,
						resource: 1,
						from: article.id
					}
					this.$api.createArticle(para).then((res)=>{
						if(res.data.code == 0){
							this.Layer.tips('转发成功')
							this.getData()
							this.flag.noMore = false
						}
					})
				}
			})
		},
		showPerson: function(id){
			let dom = event.target
			let rec = dom.getBoundingClientRect()
			let top = (rec.top+rec.bottom)/2
			let right = rec.right
			this.flag.showPerson = true
			setTimeout(()=>{
				let dom2 = document.querySelector('.show_personal_msg')
				if(dom2)dom2.setAttribute("style","top:"+top+"px;left:"+right+'px;')
			},10)
			if(!this.persons[id]){
				this.$api.getUser({id:id}).then((res)=>{
					if(res.data){
						this.persons[id] = res.data
						this.createPersonModal(res.data,top,right)
					}
				})
			}
			else{
				setTimeout(()=>{
					this.createPersonModal(this.persons[id],top,right)
				},10)
			}
			
		},
		createPersonModal: function(msg,top,right){
			let dom = document.querySelector('.show_personal_msg')
			function justify(str){
				if(!str)return '未知';
				else return str;
			}
			let content = "<div style='position:fixed;padding:30px;font-size:14px;'><div><label>id：</label><span>"+msg.id+"</span></div><div><label>姓名：</label><span>"+msg.name+"</span></div><div><label>性别：</label><span>"+(msg.gender == 0 ? '未知':(msg.gender == 1 ? '男':'女'))+"</span></div><div>";
			content += "<label>电话：</label><span>"+justify(msg.phone)+"</span></div><div><label>邮箱：</label><span>"+justify(msg.email)+"</span></div><div><label>出生日期：</label><span>"+justify(msg.birth)+"</span></div><div><label>住址：</label><span>"+justify(msg.addr)+"</span></div><div><label>注册日期：</label><span>"+msg.rigester_time+"</span></div></div>";
			if(dom)dom.innerHTML = content
		},
		hidePerson: function(){
			this.flag.showPerson = false
		},
		goPerson: function(id){
			sessionStorage.articleUserId = id
			location.href = '#/personalWeb'
		},
		goTop: function(){
			let scroll = document.documentElement.scrollTop
			let times = Math.ceil(300/16),i = 0
			let height = scroll/(300/16)
			let interval = setInterval(()=>{
				window.scrollBy(0,-height)
				i++
				if(times <= i)clearInterval(interval)
			},16)
		}
	},
	mounted(){
		this.init()
		this.endTime.min = this.startTime.selected
		this.startTime.max = this.endTime.selected
		window.onscroll = ()=>{
			this.flag.showPerson = false
			let scroll = document.documentElement.scrollTop
			if(scroll > 10){
				this.flag.showTop = true
			}
			else{
				this.flag.showTop = false
			}
			let list = document.querySelector('.article_list')
			if(!list)return
			let rect = list.getBoundingClientRect().bottom
			if(rect < 870 && !this.flag.load && !this.flag.noMore){
				this.page.number++
				this.getData2()
			}
		}
	},
	watch: {
		'startTime.selected': function(){
			this.endTime.min = this.startTime.selected
		},
		'endTime.selected': function(){
			this.startTime.max = this.endTime.selected
		}
	}
}
</script>

<style scoped>
.condition{margin-top:20px;}
.condition>*{float:left}
.input{background:url(./commoIcon/search.png) no-repeat;background-size:28px 28px;padding-left:30px;color:#555;}
.input:focus{background:url(./commoIcon/searching.png) no-repeat;background-size:28px 28px;}
.btn_post{background-color:#5cb85c;float:right;color:#fff;}
.article_list{padding: 30px 10px;}
.article_item{margin-bottom:20px;padding-bottom:5px;border-bottom:1px dashed #ddd;}
.article_title span{color:#000;font-size:16px;font-weight:bolder;cursor:pointer;}
.article_title span:hover{color:#3896fe;text-decoration:underline;}
.div_user{font-size:14px;height:28px;line-height:28px;color:#5cb85c;}
.div_user span:nth-child(2){color:#bbb;margin-left:30px;}
.div_person{position:absolute;padding:30px;background-color:#999;z-index:1000;top:0;border-radius:3px;}
.div_context{display:-webkit-box;text-overflow:ellipsis;overflow:hidden;-webkit-line-clamp:3;-webkit-box-orient:vertical;color:#555;}
.div_data{display:flex;height:30px;align-items:center;justify-content:space-between;color:#bbb;}
.div_data>span{display:inline-block;}
.div_data img{position:relative;top:4px;}
.div_data>span:nth-child(4){cursor:pointer;}
.sp_selected{color:#3896fe;}
.div_nomore{text-align:center;}
.div_fixed{position:fixed;bottom:60px;right:50px;width:50px;background-color:#fff;}
.div_top{width:100%;height:50px;border:1px solid #ddd;background:url(./commoIcon/backTop_gray.png) no-repeat center;background-size:30px 30px;cursor:pointer;transition: background 0.3s,border 0.3s;}
.div_top:hover{background:url(./commoIcon/backTop.png) no-repeat center;border:1px solid #3896f8;background-size:30px 30px;}
.show_personal_msg{position:fixed;width:256px;height:212px;background-color:#000;opacity:0.75;border-radius:5px;color:#fff;}
.div_load{background:url(./commoIcon/loading.gif) no-repeat center;width:100%;height:100%;min-height:50px;}
</style>