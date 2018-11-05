<template>
	<div>
		<div class="div_title">个人主页</div>
		<div class="div_base" v-if="person">
			<p>
				基本信息
				<button v-if="!relation.following && user.id != person.id" @click="follow" class="btn btn_default btn_follow">+关注</button>
				<button @click='cancelFollow' v-if="relation.following && !relation.follow" class="btn btn_default btn_follow follow_single">-取消关注</button>
				<button @click='cancelFollow' v-if="relation.following && relation.follow" class="btn btn_default btn_follow follow_each">已互相关注</button>
			</p>
			<div class="base_msg">
				<div>
					<label class="label">ID：</label>
					<span>{{person.id}}</span>
					<label>用户名：</label>
					<span>{{person.name}}</span>
				</div>
				<div>
					<label class="label">性别：</label>
					<span>{{person.gender == 0 ? '未知' : (person.gender == 1 ? '男' : '女')}}</span>
					<label>年龄：</label>
					<span>{{person.birth ? (getAge(person.birth)+'岁'):'未知'}}</span>
				</div>
				<div>
					<label>电话号码：</label>
					<span>{{justify(person.phone)}}</span>
					<label>邮箱：</label>
					<span>{{justify(person.email)}}</span>
				</div>
				<div>
					<label>注册时间：</label>
					<span>{{justify(person.rigester_time)}}</span>
					<label>现居地：</label>
					<span>{{justify(person.addr)}}</span>
				</div>
			</div>
		</div>
		<div class="div_statis">
			<p>统计信息</p>
			<div class="statis_msg clearfix">
				<div class="statis_item">
					<div class="item_title">{{calling +' '+statis.posts.title}}({{statis.posts.total}})</div>
					<div class="item_container">
						<div v-if="!statis.posts.data.length" class="null_msg"><span>暂无</span></div>
						<div class="items_msg" v-for="(item,key) in statis.posts.data">
							<p :title="item.title" class="one_article" @click="goArticle(item.id)">
								<span>{{key+1}}</span>
								<label>{{item.title}}</label>
							</p>
						</div>
						<div class="item_more" v-if="statis.posts.flag"><label @click="getMore('posts')">点击查看更多>></label></div>
					</div>
				</div>
				<div class="statis_item">
					<div class="item_title">{{calling +' '+statis.saves.title}}({{statis.saves.total}})</div>
					<div class="item_container">
						<div v-if="!statis.saves.data.length" class="null_msg"><span>暂无</span></div>
						<div class="items_msg" v-for="(item,key) in statis.saves.data">
							<p :title="item.title" class="one_article" @click="goArticle(item.postId)">
								<span>{{key+1}}</span>
								<label>{{item.title}}</label>
							</p>
						</div>
						<div class="item_more" v-if="statis.saves.flag"><label @click="getMore('saves')">点击查看更多>></label></div>
					</div>
				</div>
				<div class="statis_item">
					<div class="item_title">{{calling +' '+statis.supports.title}}({{statis.supports.total}})</div>
					<div class="item_container">
						<div v-if="!statis.supports.data.length" class="null_msg"><span>暂无</span></div>
						<div class="items_msg" v-for="(item,key) in statis.supports.data">
							<p :title="item.title" class="one_article" @click="goArticle(item.postId)">
								<span>{{key+1}}</span>
								<label>{{item.title}}</label>
							</p>
						</div>
						<div class="item_more" v-if="statis.supports.flag"><label @click="getMore('supports')">点击查看更多>></label></div>
					</div>
				</div>
				<div class="statis_item">
					<div class="item_title">{{calling +' '+statis.reports.title}}({{statis.reports.total}})</div>
					<div class="item_container">
						<div v-if="!statis.reports.data.length" class="null_msg"><span>暂无</span></div>
						<div class="items_msg" v-for="(item,key) in statis.reports.data">
							<p :title="item.title" class="one_article" @click="goArticle(item.id)">
								<span>{{key+1}}</span>
								<label>{{item.title}}</label>
							</p>
						</div>
						<div class="item_more" v-if="statis.reports.flag"><label @click="getMore('reports')">点击查看更多>></label></div>
					</div>
				</div>
			</div>
		</div>
		<div class="div_relation" v-if="person">
			<p>好友关系</p>
			<div class="relations">
				<div>
					<div class="item_title">{{calling}} 关注的人({{person.following}})</div>
					<div class="relation_container">
						<div v-for="item in relation.followData">
							<div @click="goPerson(item.follow)" class="one_relation">
								<span>{{item.name}}</span>
								<span>{{item.followTime}}</span>
							</div>
						</div>
						<div v-if="relation.ferFlag" @click="appendFollowing" class="item_more"><label @click="getMore('reports')">点击查看更多>></label></div>
					</div>
				</div>
				<div>
					<div class="item_title">关注 {{calling}} 的人({{person.follower}})</div>
					<div class="relation_container">
						<div v-for="item in relation.followingData">
							<div @click="goPerson(item.follower)" class="one_relation">
								<span>{{item.name}}</span>
								<span>{{item.followTime}}</span>
							</div>
						</div>
						<div v-if="relation.fingFlag" @click="appendFollower" class="item_more"><label @click="getMore('reports')">点击查看更多>></label></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
export default{
	name: 'personal',
	data(){
		return{
			person: null,
			user: null,
			calling: '我',
			statis: {
				posts: {title: '的发帖',data: [],page: 1,flag: false,total: 0},
				saves: {title: '的收藏',data: [],page: 1,flag: false,total: 0},
				supports: {title: '的点赞',data: [],page: 1,flag: false,total: 0},
				reports: {title: '的转发',data: [],page: 1,flag: false,total: 0}
			},
			relation: {
				following: false,
				follow: false,
				followingData: [],
				followData: [],
				ferFlag: false,
				fingFlag: false,
				ferPage: 1,
				fingPage: 1
			}
		}
	},
	methods: {
		init: function(){
			let id = sessionStorage.articleUserId
			if(!id) id = this.$utils.getLocal('articleUserId')
			let user = this.$utils.getLocal('user')
			if(user)this.user = JSON.parse(user)
			this.$api.getUser({id: id}).then((res)=>{
				this.person = res.data
				this.calling = this.getCalling()
				this.getMyPosts()
				this.getMySaves()
				this.getMySupports()
				this.getMyReports()
				this.justRelation()
				this.getFollowing()
				this.getFollower()
			})
		},
		justify: function(str){
			if(!str)return '未知'
			else return str
		},
		getAge: function(birth){
			if(!birth)return
			let current = (new Date()).getTime()
			birth = (new Date(birth)).getTime()
			let age = Math.round((current-birth)/(1000*3600*24*365))
			return age
		},
		getCalling: function(){
			if(this.user.id == this.person.id)return '我';
			if(this.person.gender == 0)return 'TA';
			if(this.person.gender == 1)return '他';
			return '她';
		},
		getFollower: function(){
			this.$api.getFollower({uid: this.person.id,page: 1}).then((res)=>{
				this.relation.followingData = res.data.msg
				if(res.data.msg.length == 10)this.relation.fingFlag = true
			})
		},
		getFollowing: function(){
			this.$api.getFollowing({uid: this.person.id,page: 1}).then((res)=>{
				this.relation.followData = res.data.msg
				if(res.data.msg.length == 10)this.relation.ferFlag = true
			})
		},
		appendFollower: function(){
			this.relation.fingPage++
			let para = {
				uid: this.person.id,
				page: this.relation.fingPage
			}
			this.$api.getFollower(para).then((res)=>{
				this.relation.followingData = this.relation.followingData.concat(res.data.msg)
				if(res.data.msg.length < 10)this.relation.fingFlag = false
			})
		},
		appendFollowing: function(){
			this.relation.ferPage++
			let para = {
				uid: this.person.id,
				page: this.relation.ferPage
			}
			this.$api.getFollowing(para).then((res)=>{
				this.relation.followData = this.relation.followData.concat(res.data.msg)
				if(res.data.msg.length < 10)this.relation.ferFlag = false
			})
		},
		justRelation: function(){
			let para = {
				follower: this.user.id,
				follow: this.person.id
			}
			this.$api.justRelation(para).then((res)=>{
				if(res.data.code == 0){
					this.relation.following = res.data.msg.following
					this.relation.follow = res.data.msg.follow
				}
				else{
					this.Layer.tips(res.data.msg)
				}
			})
		},
		getMyPosts: function(){
			let post = this.statis.posts
			let para = {
				userId: this.person.id,
				page: post.page
			}
			this.$api.getMyPosts(para).then((res)=>{
				if(res.data.code == 0){
					if(res.data.msg.length == 10)post.flag = true;
					else post.flag = false;
					post.data = res.data.msg
					post.total = res.data.total
				}
				else{
					console.log(res.data.msg)
				}
			})
		},
		getMySaves: function(){
			let save = this.statis.saves
			let para = {
				userId: this.person.id,
				page: save.page
			}
			this.$api.getMySaves(para).then((res)=>{
				if(res.data.code == 0){
					if(res.data.msg.length == 10)save.flag = true;
					else save.flag = false;
					save.data = res.data.msg
					save.total = res.data.total
				}
				else{
					console.log(res.data.msg)
				}
			})
		},
		getMySupports: function(){
			let support = this.statis.supports
			let para = {
				userId: this.person.id,
				page: support.page
			}
			this.$api.getMySupports(para).then((res)=>{
				if(res.data.code == 0){
					if(res.data.msg.length == 10)support.flag = true;
					else support.flag = false;
					support.data = res.data.msg
					support.total = res.data.total
				}
				else{
					console.log(res.data.msg)
				}
			})
		},
		getMyReports: function(){
			let report = this.statis.reports
			let para = {
				userId: this.person.id,
				page: report.page
			}
			this.$api.getMyReports(para).then((res)=>{
				if(res.data.code == 0){
					if(res.data.msg.length == 10)report.flag = true;
					else report.flag = false;
					report.data = res.data.msg
					report.total = res.data.total
				}
				else{
					console.log(res.data.msg)
				}
			})
		},
		getMore: function(str){
			let api = 'getMyPosts'
			switch(str){
				case 'saves': api = 'getMySaves';break;
				case 'supports': api = 'getMySupports';break;
				case 'reports': api = 'getMyReports';break;
				default: api = null;
			}
			if(!api)return
			this.statis[str].page++
			let para = {
				userId: this.person.id,
				page: this.statis[str].page
			}
			this.$api[api](para).then((res)=>{
				if(res.data.code == 0){
					if(res.data.msg.length < 10)this.statis[str].flag = false
					this.statis[str].data = this.statis[str].data.concat(res.data.msg)
					this.statis[str].total = res.data.total
				}
				else{
					this.statis[str].page--
				}
			})
		},
		goArticle: function(aid){
			sessionStorage.article = aid
			location.href = '#/articleDetail'
		},
		follow: function(){
			let para = {
				follower: this.user.id,
				follow: this.person.id
			}
			this.relation.following = true
			this.person.follower++
			this.$api.addRelation(para).then((res)=>{
				if(res.data.code == 0){
					this.getFollower()
				}
				else{
					this.Layer.tips(res.data.msg)
					this.relation.following = false
					this.person.follower--
				}
			})
		},
		cancelFollow: function(){
			let para = {
				follower: this.user.id,
				follow: this.person.id
			}
			this.relation.following = false
			this.person.follower--
			this.$api.cancelRelation(para).then((res)=>{
				if(res.data.code == 0){
					this.getFollower()
				}
				else{
					this.Layer.tips(res.data.msg)
					this.relation.following = true
					this.person.follower++
				}
			})
		},
		goPerson: function(id){
			console.log(id)
			this.$utils.setLocal('articleUserId',id)
			sessionStorage.articleUserId = id
			window.open(location)
		}
	},
	beforeMount(){
		this.init()
	}
}
</script>

<style scoped>
	.div_title{display:flex;height:50px;align-items:center;border-bottom:2px solid #ddd;justify-content:center;font-size:20px;color:#555;letter-spacing:30px;text-shadow:0 5px 5px #bbb;margin-bottom:20px;}
	.btn{padding:0 10px;width:auto!important;}
	.btn_follow{width:60px;height:28px;float:right;}
	.follow_single{background-color:#ff8547;}
	.follow_each{background-color:#bbb;}
	.div_base>p,.div_statis>p,.div_relation>p{color:#999;font-size:18px;margin-bottom:20px;margin-top:20px;}
	.div_base{color:#555;font-size:14px;}
	.base_msg>div{padding:15px 30px;}
	.base_msg>div>*{display:inline-block;}
	.base_msg>div>label{width:150px;text-align:right;}
	.base_msg>div>span{width:200px;}
	.statis_msg>div{border-right:1px dashed #ddd;}
	.statis_msg>div:last-child{border-right:none;}
	.statis_item{float:left;width:24.5%;}
	.item_title{text-align:center;height:40px;line-height:40px;border-bottom:1px solid #ddd;}
	.null_msg{width:100%;min-height:270px;background:url(./img/null.png) no-repeat center;display:flex;justify-content:center;align-items:center;color:#ddd;}
	.null_msg>span{margin-top:50px;font-size:14px;}
	.item_container{height:300px;overflow:auto;}
	.item_container .items_msg p>span{padding:0 6px;background-color:#8eb9f5;color:#fff;}
	.item_container .items_msg:nth-child(1) span{background-color:#f54545;}
	.item_container .items_msg:nth-child(2) span{background-color:#ff8547;}
	.item_container .items_msg:nth-child(3) span{background-color:#ffac38;}
	.item_more{display:block!important;text-align:left;width:80%!important;float:left;}
	.item_more label{font-size:14px;color:#3896f8;text-decoration:underline;cursor:pointer;margin-left:10px;}
	.one_article{padding:3px 10px;font-size:14px;color:#555;cursor:pointer;width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
	.one_article label:hover{text-decoration:underline;color:#3896f8;cursor:pointer;}
	.div_follow span{color:#3896f8;cursor:pointer;}
	.relations>div{width:49%;float:left;height:300px;}
	.relations>div:nth-child(1){border-right:1px dashed #ddd}
	.relation_container{height:250px;overflow:auto;}
	.relation_container>div{width:45%;height:55px;float:left;color:#555;margin:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
	.relation_container>div span:nth-child(1){font-size:14px;margin-left:5px;width:50%;display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
	.relation_container>div span:nth-child(2){font-size:12px;color:#bbb;float:right;margin-right:8px;}
	.one_relation{border:1px solid #ddd;width:95%;height:50px;line-height:50px;transition: margin-bottom 0.3s,box-shadow 0.3s;min-width:250px;}
	.one_relation:hover{margin-bottom:1px;box-shadow:0px 5px 15px 0px #ddd;}
</style>