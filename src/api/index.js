import Vue from 'vue'
import axios from 'axios'
import Qs from 'qs'

Vue.prototype.$qs = Qs

// axios.defaults.withCredentials = true;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//axios 请求发送时拦截
axios.interceptors.request.use(config => {
	return config
},error => {
	
})

/** 请求的链接前缀，一般不变，当请求第三方接口链接时不引用 **/
const basePath = 'http://localhost.com/yii/testdrive/index.php?r=';

/** 基础api信息，存放各api的具体请求地址和调用方法 **/
const apiMessage = {
	getUser: {url: basePath + 'user/view',method: 'get'},
	createUser: {url: basePath + 'user/create',method: 'post'},
	login: {url: basePath + 'user/login',method: 'get'},
	getUserList: {url: basePath + 'user/list',method: 'get'},
	getUser: {url: basePath + 'user/view',method: 'get'},
	createArticle: {url: basePath + 'article/create',method: 'post'},
	articleList: {url: basePath + 'article/list',method: 'get'},
	getArticle: {url: basePath + 'article/getArticle',method: 'get'},
	deleteArticle: {url: basePath + 'article/deleteArticle',method: 'get'},
	createComment: {url: basePath + 'comment/create',method: 'post'},
	getComment: {url: basePath + 'comment/getcomment',method: 'get'},
	createReply: {url: basePath + 'comment/createReply',method: 'post'},
	getReply: {url: basePath + 'comment/getreply',method: 'get'},
	deleteReply: {url: basePath + 'comment/deleteReply',method: 'get'},
	increRead: {url: basePath + 'article/increRead',method: 'get'},
	addSupport: {url: basePath + 'support/addSupport',method: 'get'},
	addSave: {url: basePath + 'save/addSave',method: 'get'},
	cancelSave: {url: basePath + 'save/cancelSave',method: 'get'},
	getMyPosts: {url: basePath + 'article/getMyPosts',method: 'get'},
	getMySaves: {url: basePath + 'article/getMySaves',method: 'get'},
	getMySupports: {url: basePath + 'article/getMySupports',method: 'get'},
	getMyReports: {url: basePath + 'article/getMyReports',method: 'get'},
	addRelation: {url: basePath + 'follow/addRelation',method: 'get'},
	cancelRelation: {url: basePath + 'follow/cancelRelation',method: 'get'},
	justRelation: {url: basePath + 'follow/justRelation',method: 'get'},
	getFollower:{url: basePath + 'follow/getFollower',method: 'get'},
	getFollowing: {url: basePath + 'follow/getFollowing',method: 'get'}
};

/**
 * 构造Promise的函数
 * param 具体传入的参数
 * url 请求地址
 * method 请求方法，默认为get
 */
const createPromise = (param,url,method) => {
	method = method || 'GET'
	method = method.toUpperCase()
	let qs = Vue.prototype.$qs
	if(method == 'GET'){
		return new Promise(function(resolve,reject){
			axios({
				url: url,
				method: method,
				params: param
			}).then(function(res){
				resolve(res)
			}).catch(function(res){
				console.log(url + '请求失败...')
				console.log(res)
				reject(res)
			})
		})
	}
	else{
		return new Promise(function(resolve,reject){
			axios({
				url: url,
				method: method,
				data: qs.stringify(param)
			}).then(function(res){
				resolve(res);
			}).catch(function(res){
				console.log('请求失败...')
				console.log(res)
				reject(res)
			})
		})
	}
}

/**
 *暴露给外部调用封装好的接口
 */
const api = {
	getUser: function(param){
		return createPromise(param,apiMessage.getUser.url,apiMessage.getUser.method)
	},
	createUser: function(param){
		return createPromise(param,apiMessage.createUser.url,apiMessage.createUser.method)
	},
	login: function(param){
		return createPromise(param,apiMessage.login.url,apiMessage.login.method)
	},
	getUserList: function(param){
		return createPromise(param,apiMessage.getUserList.url,apiMessage.getUserList.method)
	},
	getUser: function(param){
		return createPromise(param,apiMessage.getUser.url,apiMessage.getUser.method)
	},
	createArticle: function(param){
		return createPromise(param,apiMessage.createArticle.url,apiMessage.createArticle.method)
	},
	articleList: function(param){
		return createPromise(param,apiMessage.articleList.url,apiMessage.articleList.method)
	},
	getArticle: function(param){
		return createPromise(param,apiMessage.getArticle.url,apiMessage.getArticle.method)
	},
	deleteArticle: function(param){
		return createPromise(param,apiMessage.deleteArticle.url,apiMessage.deleteArticle.method)
	},
	createComment: function(param){
		return createPromise(param,apiMessage.createComment.url,apiMessage.createComment.method)
	},
	getComment: function(param){
		return createPromise(param,apiMessage.getComment.url,apiMessage.getComment.method)
	},
	createReply: function(param){
		return createPromise(param,apiMessage.createReply.url,apiMessage.createReply.method)
	},
	getReply: function(param){
		return createPromise(param,apiMessage.getReply.url,apiMessage.getReply.method)
	},
	deleteReply: function(param){
		return createPromise(param,apiMessage.deleteReply.url,apiMessage.deleteReply.method)
	},
	increRead: function(param){
		return createPromise(param,apiMessage.increRead.url,apiMessage.increRead.method)
	},
	addSupport: function(param){
		return createPromise(param,apiMessage.addSupport.url,apiMessage.addSupport.method)
	},
	addSave: function(param){
		return createPromise(param,apiMessage.addSave.url,apiMessage.addSave.method)
	},
	cancelSave: function(param){
		return createPromise(param,apiMessage.cancelSave.url,apiMessage.cancelSave.method)
	},
	getMyPosts: function(param){
		return createPromise(param,apiMessage.getMyPosts.url,apiMessage.getMyPosts.method)
	},
	getMySaves: function(param){
		return createPromise(param,apiMessage.getMySaves.url,apiMessage.getMySaves.method)
	},
	getMySupports: function(param){
		return createPromise(param,apiMessage.getMySupports.url,apiMessage.getMySupports.method)
	},
	getMyReports: function(param){
		return createPromise(param,apiMessage.getMyReports.url,apiMessage.getMyReports.method)
	},
	addRelation: function(param){
		return createPromise(param,apiMessage.addRelation.url,apiMessage.addRelation.method)
	},
	cancelRelation: function(param){
		return createPromise(param,apiMessage.cancelRelation.url,apiMessage.cancelRelation.method)
	},
	justRelation: function(param){
		return createPromise(param,apiMessage.justRelation.url,apiMessage.justRelation.method)
	},
	getFollower: function(param){
		return createPromise(param,apiMessage.getFollower.url,apiMessage.getFollower.method)
	},
	getFollowing: function(param){
		return createPromise(param,apiMessage.getFollowing.url,apiMessage.getFollowing.method)
	}
}
console.log(api)
export default api