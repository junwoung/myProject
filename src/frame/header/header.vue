<template>
	<div id="frame_header" class="frame_header clearfix">
		<div class="frame_div_title">
			<i class="frame_icon"></i>
			<span class="frame_title">{{frame_title}}</span>
		</div>
		<div class="frame_user">
			<i class="frame_user_icon"></i>
			<span class="frame_user_login" v-if="frame_username" :class="{'frame_username':frame_username}"><span>欢迎，</span>{{frame_username}}</span>
			<span class="frame_user_login" v-if="!frame_username"><a class="a" href="#/login">请登录</a></span>
			<span class="frame_exit" v-if="frame_username" @click='exit'>退出</span>
		</div>
	</div>
</template>

<script>
	export default{
		name: 'myheader',
		data(){
			return{
				frame_title: 'personal web',
				frame_username: ''
			}
		},
		methods: {
			init: function(){
				let user = this.$utils.getLocal('user');
				if(user){
					user = JSON.parse(user)
					this.frame_username = user.name
				} 
			},
			exit: function(){
				this.$utils.removeLocal('user');
				location.href = '#/login';
			}
		},
		mounted(){
			this.init();
		}
	}
</script>

<style>
	.frame_header{height: 44px;background-color: #3896f8;padding: 8px 20px 8px 28px;color: #fff;min-width: 1200px;font-family:'微软雅黑'}
	.frame_div_title{float: left;}
	.frame_icon{background:url(./logo.png) no-repeat;display:inline-block;width:42px;height:40px;float:left;}
	.frame_title{display:inline-block;height:40px;line-height:40px;float:left;margin-left:20px;font-size:20px;}
	.frame_user{float:right;font-size:14px;}
	.frame_user_icon{background:url(./user.png) no-repeat;display:inline-block;width:42px;height:42px;float:left;}
	.frame_user_login{float:left;display:inline-block;padding:0 15px;margin-top:11px;margin-right:10px;cursor:pointer;}
	.frame_username{float:left;display:inline-block;padding:0 15px;margin-top:11px;border-right:2px solid #fff;margin-right:10px;cursor:pointer;}
	.frame_username:after{content:'';position:relative;display:inline-block;width:0;height:0;border-top:5px solid #fff;border-right:5px solid transparent;border-left:5px solid transparent;left:5px;top:-1px;}
	.frame_exit{float:left;display:inline-block;height:42px;line-height:42px;cursor:pointer;}
	.a{color:#fff;}
</style>