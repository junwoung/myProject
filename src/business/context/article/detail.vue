<template>
	<div>
		<div>
			<a class="a a_link" href="#/articleList"><<返回列表</a>
		</div>
		<div class="div_operations" v-if="article">
			<span @click='deleteArticle' class="sp_delete" v-if="userId == article.userId">删除</span>
			<span @click="saveArticle" :class="{'sp_operation_selected':saveFlag}" :title="saveFlag ? '取消':'收藏'"><span v-if='saveFlag'>已</span>收藏({{operation.save}})</span>
			<span @click='support(null)' :class="{'sp_operation_selected':supportFlag}" :title="supportFlag ? '取消':'点赞'"><span v-if='supportFlag'>已</span>点赞({{operation.support}})</span>
			<span @click="turn">转发({{operation.report}})</span>
		</div>
		<div class="div_article" v-if="article">
			<div class="div_context">
				<div class="div_title">{{article.title}}</div>
				<div class="div_user">
					<span>楼主：{{article.name}}</span>
					<span>发帖日期：{{article.date}}</span>
					<span title="浏览量"><img src="./commoIcon/eye.png" height="16" width="16">{{operation.read}}</span>
					<span title="评论量"><img src="./commoIcon/view.png" height="16" width="16">{{operation.comment}}</span>
				</div>
				<div class="context">
					{{article.context}}
				</div>
				<div class="div_reply">
					<span class="div_reply_span" @click="commentFlag = !commentFlag">回复</span>
					<transition name="fade">
						<div class="div_textarea" v-if="commentFlag">
							<textarea maxlength="1000" class="textarea" v-model='newComment'></textarea>
							<span @click='submitComment(1)'>发布</span>
						</div>
					</transition>
					
				</div>
			</div>
			<div class="div_comments">
				<div class="no_comment" v-if="!comments || !comments.length">暂无评论</div>
				<div v-if="comments && comments.length">
					<p>相关评论</p>
					<div v-for="comment in comments">
						<div class="comment_item">
							<p>
								<span class="sp_name">{{comment.name}}：</span>
								<span @click="reply(comment)" title='点击回复'>{{comment.comment}}</span>
								<span class="sp_time">{{comment.commentDate}}</span>
								<span v-if="comment.userId == userId" @click='deleteReply(comment.commentId)' class="sp_delete_reply" title="删除回复和底下的评论">删除</span>
							</p>
							<div class="div_replies" :data-id="comment.commentId" >
								<div class="reply_items" data-page='1' @click="listenOperate">
									
								</div>
								<p v-if="comment.commentNum > 0 && !deleteFlag">
									<a class="a a_link" @click="seeMore(comment)">点击查看{{comment.commentNum}}条回复</a>
								</p>
								<p v-if="(comment.commentNum <= 0 && comment.flag) || deleteFlag">
									<a class="a a_link" @click="hideReply()">点击收起</a>
								</p>
							</div>
							<div v-if="replyIndex === comment.commentId">
								<input type="text" class="input input_reply" placeholder="回复：" v-if="" v-model="commentComment" maxlength='1000'>
								<span class="sp_reply" @click="submitReply(comment)">发送</span>
							</div>
						</div>
					</div>
					<div @click='getMore' class="div_more" v-if="moreFlag">
						<span>点击加载更多</span>
					</div>
					<div class="div_more" v-if="!moreFlag">
						<span>没有更多~~</span>
					</div>
				</div>
			</div>
		</div>
		<div class="div_fixed" v-if="showTopFlag">
			<div class="div_top" @click="goTop"></div>
		</div>
	</div>
</template>
<script>
	export default{
		name: 'articleDetail',
		data(){
			return{
				userId: null,
				commentFlag: false,
				replyIndex: null,
				page: {
					current: 1,
					size: 10
				},
				article: null,
				comments: [],
				newComment: '',
				commentComment: '',
				moreFlag: false,
				operation:{
					support: 0,
					save: 0,
					report: 0,
					read: 0,
					comment: 0
				},
				supportFlag: false,
				showTopFlag: false,
				deleteFlag: false,
				saveFlag: false
			}
		},
		methods: {
			init: function(){
				let userStr = this.$utils.getLocal('user')
				let user = userStr ? JSON.parse(userStr):''
				if(user)this.userId = user.id
				this.getArticle()
			},
			increRead: function(){
				let para = {id: this.article.id}
				this.$api.increRead(para).then((res)=>{
					if(res.data.code == 0)this.operation.read++
				})
			},
			getArticle: function(){
				// this.article = JSON.parse(sessionStorage.article)
				let id = sessionStorage.article
				this.$api.getArticle({articleId: id}).then((res)=>{
					if(res.data.code == 0){
						this.article = res.data.msg[0]
						this.getComments()
						this.increRead()
						let o = this.operation,d = res.data.msg[0]
						o.support = d.support
						o.save = d.save
						o.report = d.report
						o.read = d.read
						o.comment = d.comment
						let s = d.totalS
						let sa = d.totalSave
						if(s){
							if(s.split(',').indexOf(this.userId) !== -1)this.supportFlag = true;
						}
						if(sa){
							if(sa.split(',').indexOf(this.userId) !== -1)this.saveFlag = true;
						}
					}
					else{
						this.Layer.tips('获取点赞等信息失败')
					}
				})
			},
			getComments: function(){
				let para = {
					postId: this.article.id,
					page: this.page.current,
					size: this.page.size
				}
				let that = this
				this.$api.getComment(para).then(function(res){
					if(res.status == 200){
						if(res.data.code == 0){
							that.comments = that.comments.concat(res.data.msg)
							if(res.data.msg.length == 10){
								that.moreFlag = true
							}
							else
								that.moreFlag = false
						}
						else{
							console.log(res.data.msg)
						}
					}
				})
			},
			getComments2: function(){
				this.page.current = 1
				let para = {
					postId: this.article.id,
					page: this.page.current,
					size: this.page.size
				}
				let that = this
				this.$api.getComment(para).then(function(res){
					if(res.status == 200){
						if(res.data.code == 0){
							that.comments = res.data.msg
							if(res.data.msg.length == 10){
								that.moreFlag = true
							}
							else
								that.moreFlag = false
						}
						else{
							console.log(res.data.msg)
						}
					}
				})
			},
			submitComment: function(type){
				let msg = this.check()
				let that = this
				if(!this.userId)msg = '请先登录'
				if(msg){
					this.Layer.tips(msg)
					return
				}
				let para = {
					userId: this.userId,
					postId: this.article.id,
					comment: this.newComment,
					commentType: type
				}
				this.$api.createComment(para).then(function(res){
					if(res.status == 200){
						that.Layer.tips(res.data.msg,1)
						if(res.data.code == 0){
							that.newComment = ''
							that.commentFlag = false
							that.operation.comment++
							that.getComments2()
						}						
					}
				})
			},
			check: function(){
				if(!this.newComment)return '评论不能为空';
				if(this.newComment.length > 1000)return '评论不能超过1000字符';
			},
			reply: function(cmt){
				this.commentComment = ''
				if(cmt.commentId !== this.replyIndex)this.replyIndex = cmt.commentId;
				else this.replyIndex = null
			},
			submitReply: function(cmt){
				let that = this
				let user = JSON.parse(this.$utils.getLocal('user'))
				if(!this.commentComment)return;
				if(!user)return this.Layer.tips('请先登录');
				let para = {
					userId: user.id,
					postId: this.article.id,
					comment: this.commentComment,
					commentType: 2,
					postCommentId: cmt.commentId
				}
				this.$api.createReply(para).then(function(res){
					if(res.data.code == 0){
						that.replyIndex = null
						cmt.commentNum++
						that.operation.comment++
					}
					else
						that.Layer.alert(res.data.msg)
				})
			},
			seeMore: function(cmd){
				let div = event.target.parentNode.parentNode.firstChild
				let that = this
				let para = {
					commentId: cmd.commentId
				}
				this.$api.getReply(para).then(function(res){
					if(res.data.code == 0){
						that.appendReply(div,res.data.msg)
						cmd.flag = true
						cmd.commentNum=0
					}
					else{
						that.Layer.tips(res.data.msg)
					}
				})
			},
			appendReply: function(dom,data){
				let initHtml ='',html = ''
				for(let i = 0,len = data.length; i < len; i++){
					html+="<div><p><span style='color: #3896fe;cursor:pointer;margin-right:10px;'>"+data[i].name+"</span><span>"+data[i].comment+"</span><span style='color:#bbb;font-size:12px;margin-left:10px;'>"+data[i].commentDate+"</span>"+(this.userId == data[i].userId ? ("<span data-id="+data[i].commentId+"  style='color:#ca0c16;cursor:pointer;font-size:12px;margin-left:20px;'>删除</span>") : "")+"</p></div>"
				}
				html = initHtml+html
				dom.innerHTML = html
			},
			hideReply: function(){
				let dom = event.target.parentNode.parentNode.firstChild
				if(!dom.style.height || dom.style.height != '0px'){
					dom.style.height = 0
					event.target.innerText = '点击查看'
				}
				else{
					dom.style.height = 'auto'
					event.target.innerText = '点击收起'
				} 
				
			},
			getMore: function(){
				this.page.current++;
				this.getComments()
			},
			turn: function(){
				let that = this
				let value = this.article.title
				this.Layer.prompt('请输入标题',value,function(val){
					let para = {
						userId: that.userId,
						title: val,
						context: that.article.context,
						resource: 1,
						from: that.article.id
					}
					that.$api.createArticle(para).then(function(res){
						if(res.data.code == 0){
							that.Layer.tips('转发成功')
							that.operation.report++
						}
					})
				})
			},
			support: function(cid){
				let that = this
				let type = 0
				if(cid)type = 1
				let para = {
					userId: this.userId,
					postId: this.article.id,
					type: type,
					commentId: cid || 0,
					flag: !this.supportFlag
				}
				if(this.supportFlag){
					this.operation.support--
				}
				else{
					this.operation.support++
				}
				this.supportFlag = !this.supportFlag
				this.$api.addSupport(para).then(function(res){
					if(res.data.code != 0){
						console.log(res.data.msg)
					}
				})
			},
			deleteArticle: function(){
				this.Layer.confirm('删除帖子会删除所有评论，请确认？',()=>{
					let para = {
						articleId: this.article.id,
						userId: this.userId
					}
					this.$api.deleteArticle(para).then((res)=>{
						if(res.data.code == 0){
							location.href = '#/articleList'
						}
						else{
							this.Layer.alert(res.data.msg)
						}
					})
				})
			},
			deleteReply: function(cid){
				this.Layer.confirm('删除该评论会同时删除底下的评论！请确认是否继续？',()=>{
					let para = {
						userId: this.userId,
						commentId: cid
					}
					this.$api.deleteReply(para).then((res)=>{
						if(res.data.code == 0){
							this.Layer.tips('评论已删除')
							this.operation.comment = this.operation.comment - res.data.msg
							this.getComments2()
						}
						else{
							this.Layer.tips(res.data.msg)
						}
					})
				})
			},
			listenOperate: function(){
				let dom = event.target
				let dataId = dom.getAttribute('data-id')
				if(dataId){
					this.Layer.confirm('删除该评论会同时删除底下的评论！请确认是否继续？',()=>{
					let para = {
						userId: this.userId,
						commentId: dataId
					}
					this.$api.deleteReply(para).then((res)=>{
						if(res.data.code == 0){
							this.Layer.tips('评论已删除')
							this.operation.comment = this.operation.comment - res.data.msg
							dom = dom.parentNode
							dom.parentNode.removeChild(dom)
							this.getComments2()
							this.deleteFlag = true
						}
						else{
							this.Layer.tips(res.data.msg)
						}
					})
				})
				}
			},
			saveArticle: function(){
				if(!this.userId){
					this.Layer.alert('请先登录')
					return
				}
				let para = {
					userId: this.userId,
					articleId: this.article.id
				}
				if(!this.saveFlag){
					this.saveFlag = true
					this.operation.save++
					this.$api.addSave(para).then((res)=>{
						if(res.data.code != 0){
							this.Layer.alert(res.data.msg)
							this.saveFlag = false
							this.operation.save--
						}
					})
				}
				else{
					this.saveFlag = false
					this.operation.save--
					this.$api.cancelSave(para).then((res)=>{
						if(res.data.code != 0){
							this.Layer.alert(res.data.msg)
							this.saveFlag = true
							this.operation.save++
						}
					})
				}
				
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

		},
		beforeMount(){
			this.init()
			window.onscroll = ()=>{
				let scroll = document.documentElement.scrollTop
				if(scroll > 10){
					this.showTopFlag = true
				}
				else{
					this.showTopFlag = false
				}
			}
		}
	}
</script>
<style scoped>
	.div_operations{height:40px;text-align:right;font-size:14px;color:#555;border-bottom:2px dashed #ddd;}
	.div_operations>span{padding:5px 10px;text-align:center;background-color:#3896f8;color:#fff;border-radius:3px;cursor:pointer;}
	.sp_delete{background-color:#ca0c16!important;}
	.sp_operation_selected{background-color:#ff8547!important;}
	.div_context{border-bottom:1px solid #ddd;}
	.div_title{font-size:20px;height:40px;line-height:40px;}
	.div_user span:nth-child(2){margin-left:30px;color:#bbb;}
	.div_user span:nth-child(n+3){float:right;margin-left:10px;color:#bbb;}
	.div_user span:nth-child(n+3)>img{position:relative;top:3px;}
	.context{margin-top:20px;text-indent:35px;padding:20px;}
	.div_reply{text-align:right;font-size:14px;color:#3896fe;margin-right:20px;}
	.div_reply_span{display:block;cursor:pointer;user-select:none;}
	.div_reply textarea{height:40px;padding:5px;width:100%;}
	.div_textarea{text-align:left;}
	.div_textarea span{padding:5px 10px;color:#fff;background-color:#3896fe;display:inline-block;margin-bottom:10px;cursor:pointer;}
	.div_comments{margin-top:20px;}
	.no_comment{text-align:center;color:#999;}
	.comment_item{padding:15px 30px;font-size: 14px;border-bottom: 1px dashed #ddd;}
	.sp_name{color: #3896fe;cursor:pointer;margin-right:10px;}
	.sp_time{color:#bbb;font-size:12px;margin-left:10px;}
	.input_reply{width:90%;margin-top:10px;border-radius:20px;}
	.sp_reply{margin-left:10px;color:#3896fe;cursor:pointer;}
	.a_link{margin-top:5px;user-select:none;}
	.reply_items{height:auto;padding:0px 30px;background-color:#eee;overflow:hidden;transition: height 0.3s;}
	.div_more{background-color:#ddd;height:30px;line-height:30px;text-align:center;cursor:pointer;opacity:0.8;transition:opacity 0.2s;}
	.div_more:hover{opacity:1;}
	.div_fixed{position:fixed;bottom:60px;right:50px;width:50px;background-color:#fff;}
	.div_top{width:100%;height:50px;border:1px solid #ddd;background:url(./commoIcon/backTop_gray.png) no-repeat center;background-size:30px 30px;cursor:pointer;transition: background 0.3s,border 0.3s;}
	.div_top:hover{background:url(./commoIcon/backTop.png) no-repeat center;border:1px solid #3896f8;background-size:30px 30px;}
	.sp_delete_reply{position:relative;top:0px;right:-10px;color:#ca0c16;cursor:pointer;font-size:12px;}
</style>