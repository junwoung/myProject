<template>
	<div>
		<div class="control_input">
			<label class="require">标题</label>
			<div>
				<input type="text" v-model='article.title' class="input input_long" placeholder="请输入标题" max-length='30'>
				<span class="tips">不多于30个字</span>
			</div>
		</div>
		<div class="control_input">
			<label class="require">正文</label>
			<div>
				<textarea class="textarea" v-model='article.context' placeholder="请尽情发挥 . . ." max-length='1000'></textarea>
				<span class="tips">不少于10个字,1000字以内</span>
			</div>
		</div>
		<div class="control_button">
			<button class="btn btn_default btn_small" @click='submit'>提交</button>
			<a href='#/articleList' class="btn btn_small">取消</a>
		</div>
	</div>
</template>

<script>
export default{
	name: 'newArticle',
	data(){
		return{
			article: {
				title: '',
				context: ''
			}
		}
	},
	methods: {
		init: function(){

		},
		submit: function(){
			let ret = this.check();
			let that = this
			if(typeof ret == 'object'){
				this.$api.createArticle(ret).then(function(res){
					if(res.status == 200){
						if(res.data.code == 0){
							that.Layer.tips('添加成功')
							location.href="#/articleList"
						}
						else{
							that.Layer.alert(res.data.msg)
						}
					}
				})
			}
			else{
				this.Layer.tips(ret)
			}
		},
		check: function(){
			let user = this.$utils.getLocal('user')
			let at = this.article
			user = user ? JSON.parse(user):null
			if(!user)return '请登录！';
			let uid = user.id;
			if (!at.title) return '标题不能为空';
			if(at.title.length > 30) return '标题过长';
			if(!at.context)return '正文不能为空';
			if(at.context.length < 10) return '正文不能少于10字符';
			let msg = null
			return msg = {
				userId: uid,
				title: at.title,
				context: at.context
			}
		}
	},
	mounted(){
		this.init()
	}
}
</script>
<style scoped>
.control_button{text-align:left;margin-top:50px;}
.control_button button:nth-child(1){margin-left:200px;margin-right:50px;}
</style>