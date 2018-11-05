import index from '@/business/index/index.vue'
import newArticle from '@/business/context/article/new.vue'
import articleList from '@/business/context/article/list.vue'
import articleDetail from '@/business/context/article/detail.vue'
import personal from '@/business/context/personal/personal.vue'

const routes = [
	{
		path: '/index',
		component: index
	},
	{
		path: '/newArticle',
		component: newArticle
	},
	{
		path: '/articleList',
		component: articleList
	},
	{
		path: '/articleDetail',
		component: articleDetail
	},
	{
		path: '/personalWeb',
		component: personal
	}
	// {
	// 	path: '*',
	// 	redirect: '/index'
	// }
];

export default routes