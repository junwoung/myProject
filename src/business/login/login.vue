<template>
	<div style="background-color:#f9fbff">
		<my-dialog ref="Layer"></my-dialog>
		<div class="login_header">
			<span>{{header}}</span>
		</div>
		<div class="login_body">
			<div class="login_window">
				<div class="inner_window">
					<div class="login" v-if="status == 'login'">
					<div class="control_input clearfix">
						<label class="require">账号</label>
						<div clearfix>
							<input class="input_underline" type="text" v-model="lData.name" placeholder="请输入账号" @change='tips.lname = ""'>
							<span class="tips" :class="tips.lname.type">{{tips.lname.value}}</span>
						</div>
					</div>
					<div class="control_input clearfix">
						<label class="require">密码</label>
						<div>
							<input class="input_underline" type="password" v-model="lData.password" placeholder="请输入密码" @change='tips.lpassword = ""'>
							<span class="tips" :class="tips.lpassword.type">{{tips.lpassword.value}}</span>
						</div>
					</div>
					<div class="control_button">
						<button @click='login' class="btn btn_default btn_media">登录</button>
					</div>
					<div class="control_footer">
						<span>没有账号？<a class="a" @click='status = "register"'>请注册</a></span>
					</div>
				</div>
				<div class="register" v-if="status == 'register'">
					<div class="control_input clearfix">
						<label class="require">用户名</label>
						<div>
							<input class="input_underline" v-model="rData.name" type="text" placeholder="请输入用户名">
							<span class="tips" :class="tips.name.type">{{tips.name.value}}</span>
						</div>
					</div>
					<div class="control_input clearfix">
						<label class="require">密码</label>
						<div>
							<input class="input_underline" v-model="rData.password" type="password" placeholder="请输入密码">
							<span class="tips" :class="tips.password.type">{{tips.password.value}}</span>
						</div>
					</div>
					<div class="control_input clearfix">
						<label class="require">确认密码</label>
						<div>
							<input class="input_underline" v-model="ensurePassword" type="password" placeholder="请输入确认密码">
							<span class="tips" :class="tips.ensurePassword.type">{{tips.ensurePassword.value}}</span>
						</div>
					</div>
					<div class="control_input clearfix">
						<label>邮箱</label>
						<div>
							<input class="input_underline" v-model="rData.email" type="text" placeholder="请输入邮箱">
						</div>
					</div>
					<div class="control_input clearfix">
						<label>电话号码</label>
						<div>
							<input class="input_underline" v-model="rData.phone" type="text" placeholder="请输入电话号码">
						</div>
					</div>
					<div class="control_input clearfix">
						<label>性别</label>
						<div style="position:relative;top:2px;">
							<my-select :select="gender"></my-select>
						</div>
					</div>
					<div class="control_input clearfix">
						<label>生日</label>
						<div>
							<my-time :timeObj="birth"></my-time>
						</div>
					</div>
					<div class="control_button clearfix">
						<button @click='register' class="btn btn_default btn_media">注册</button>
					</div>
					<div class="control_footer clearfix">
						<span>已有账号？<a class="a" @click='status = "login"'>请登录</a></span>
					</div>
				</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Vue from 'vue'
	export default{
		name: 'login',
		data(){
			return{
				header: '您好，请登录 or 先注册',
				status: 'login',
				gender: {
					type: 'radio',
					data: [
						{id: 0,name: '未知'},
						{id: 1,name: '男'},
						{id: 2,name: '女'}
					]
				},
				birth: {
					max: (new Date()).getTime()
				},
				lData: {
					name: null,
					password: null
				},
				rData: {
					name: null,
					password: null,
					email: '',
					phone: '',
					gender: 0,
					birth: ''
				},
				ensurePassword: null,
				tips: {
					lname: {value:'',type:''},
					lpassword: {value:'',type:''},
					name: {value:'',type:''},
					password: {value:'',type:''},
					ensurePassword: {value:'',type:''}
				}
			}
		},
		methods: {
			login: function(){
				let res = this.check();
				let that = this;
				if(!res){
					return;
				}
				// this.$utils.setCookie('usermsg',JSON.stringify(this.lData),1)
				this.$api.login(this.lData).then(function(res){
					if(res.data.code == 0){
						that.$utils.setLocal('user',res.data.msg)
						location.href = '#/index'
					}
					else{
						if(res.data.code == 1){
							that.tips.lname = {value: '账号或密码错误',type: 'error'};
						}
						else{
							that.tips.lname = {value: '账号不存在',type: 'error'}
						}
					}
				})
			},
			register: function(){
				let that = this
				let res = this.check();
				if(!res){
					return;
				}
				let data = this.rData;
				data.gender = this.gender.selected || 0
				data.birth = this.birth.selected || ''
				let pro = Vue.prototype
				pro.$api.createUser(data).then(function(res){
					if(res.status == 200){
						if(res.data.code == 0){
							pro.Layer.tips('注册成功');
							let user = JSON.parse(res.data.msg)[0]
							that.$utils.setLocal('user',JSON.stringify(user))
							location.href = '#/index'
						}
						else{
							pro.Layer.alert(res.data.msg)
						}
					}
				})
			},
			check: function(){
				let flag = true
				if(this.status === 'login'){
					let obj = this.lData;
					if (!obj.name) {
						this.tips.lname = {value: '账号不能为空',type: 'error'}
						flag = false
					}
					if(!obj.password){
						this.tips.lpassword = {value: '密码不能为空',type: 'error'}
						flag = false
					}
					return flag
				}
				if(this.status === 'register'){
					let obj = this.rData
					if(!obj.name){
						this.tips.name.value = '用户名不能为空';
						this.tips.name.type = 'error'
						flag = false
					} 
					if(!obj.password){
						this.tips.password = {
							value: '密码不能为空',
							type: 'error'
						}
						flag = false
					} 
					if(!this.ensurePassword){
						this.tips.ensurePassword = {
							value: '确认密码不能为空',
							type: 'error'
						}
						flag = false
					} 
					if(obj.password !== this.ensurePassword){
						this.tips.ensurePassword = {
							value: '两次密码不一致',
							type: 'error'
						}
						flag = false
					}
				}
				return flag
			}
		},
		mounted(){
			Vue.prototype.Layer = this.$refs.Layer;
		}
	}
</script>

<style scoped>
	.login_header{width: 100%;height: 70px;min-width: 1140px;line-height: 70px;background-color: #fff;box-shadow: 0 3px 4px rgba(0,0,0,0.1);text-align:center;font-size: 18px;}
	.login_body{width:100%;display:flex;align-items:center;justify-content:center;min-height:800px;}
	.login_body .login_window{max-width:500px;min-height:150px;box-shadow: 0 0 14px rgba(0,0,0,0.2);padding: 30px 20px;background-color:#fff;border-radius:5px;}
	.inner_window{margin:20px;display:flex;justify-content:center}
	.btn_default{width:250px;height:40px;}
	.control_button,.control_footer{transform:translate(-50px,0);}
	.a{color:#0075ff;}
</style>