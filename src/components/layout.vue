<template>
  	<div>
		<el-header v-if="page == 'cart'">购物车</el-header>
		<el-header v-if="page == 'home'">商品列表</el-header>
  		<el-container>
		  	<el-aside width="200px">
		  		<el-menu router :default-active="$route.path" class="el-menu-vertical-demo nav">
		      		<el-menu-item index="/">
			        	<span slot="title">商品</span>
			      	</el-menu-item>
			      	<el-menu-item index="/cart">
			        	<span slot="title">
			        		购物车
			        		<el-badge class="mark" v-if="totalNum" :value="totalNum" />
			        	</span>
			      	</el-menu-item>
			    </el-menu>
		  	</el-aside>
		  	<el-main>
				<Goods v-if="page == 'home'"></Goods>
				<Cart v-if="page == 'cart'"></Cart>
		  	</el-main>
		</el-container>
    </div>
</template>

<script>
import {mapGetters} from 'vuex';
import Goods from './goods';
import Cart from './cart';

export default {
    name: 'layout',
    props: ['page'],
    data() {
        return {

        };
    },
    components: {
        Goods,
        Cart
    },
    computed: {
        ...mapGetters([
            'totalNum'
        ])
    }
}
</script>

<style scoped>
	.el-header {
	    line-height: 60px;
	    text-align: center;
	    color: #fff;
	    background-color: #409eff;
	}
</style>
