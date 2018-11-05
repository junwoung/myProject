<template>
	<div>
		<p>用户列表</p>
		<table class="list">
			<thead>
				<th v-for="item in table.title" :style="{width:item.width}">{{item.name}}</th>
			</thead>
			<tbody>
				<tr v-for="item in table.data">
					<td>{{item.id}}</td>
					<td>{{item.name}}</td>
					<td>{{item.email}}</td>
					<td>{{item.phone}}</td>
					<td>{{item.gender == 1 ? '男':(item.gender == 2 ? '女': '未知')}}</td>
					<td>{{item.addr}}</td>
					<td>{{item.birth}}</td>
					<td>{{item.avaliable == 1 ? '可用' : '未知'}}</td>
					<td>{{item.rigester_time}}</td>
				</tr>
			</tbody>
		</table>
		<div class="div_page">
			<my-pagination :page="pageObj" @turn_page="turn"></my-pagination>
		</div>
		
	</div>
</template>
<script>
	export default{
		name: 'userList',
		data(){
			return{
				table: {
					title: [
						{name:'id',width:0.05},
						{name:'姓名',width:0.10},
						{name:'邮件地址',width:0.15},
						{name:'电话号码',width:0.1},
						{name:'性别',width:0.05},
						{name:'地址',width:0.2},
						{name:'生日',width:0.1},
						{name:'状态',width:0.05},
						{name:'注册时间',width:0.2}
					],
					data: []
				},
				pageObj: {
					size: 7
				}
			}
		},
		methods: {
			init: function(){
				this.getData(1,7)
			},
			getData: function(page,size){
				let that = this
				let user = JSON.parse(this.$utils.getLocal('user'))
				let para = {
					page: page,
					size: size
				}
				this.Layer.loading('正在查询')
				this.$api.getUserList(para).then((res)=>{
					if(res.status == 200){
						that.$set(that.pageObj,'total',res.data.total)
						that.Layer.hideAll()
						that.table.data = res.data.data
					}
				})
			},
			turn: function(page,size){
				this.getData(page,size)
			}
		},
		mounted(){
			this.init()	
		}
	}
</script>
<style scoped>
.div_page{margin-top:30px;}
</style>