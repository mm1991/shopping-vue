<template>
	<div>
	    <el-input
			placeholder="请搜索商品"
			suffix-icon="el-icon-search"
			v-model="keyword"
			class="search"
		>
	    </el-input>
		<el-table :data="goodListRender">
			<el-table-column prop="gid" label="商品ID" ></el-table-column>
			<el-table-column prop="name" label="商品名称"></el-table-column>
			<el-table-column prop="intro" label="商品简介"></el-table-column>
			<el-table-column prop="price" label="单价"></el-table-column>
			<el-table-column prop="amount" label="库存"></el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="primary" icon="el-icon-plus" @click="addToCart( scope.row )">加入购物车</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import {
    mapMutations,
    mapGetters,
    mapState
} from 'vuex';
export default {
    name: 'goods',
    computed: {
        ...mapGetters([
            'totalNum'
        ]),
        ...mapState([
            'good_list'
        ]),
        goodListRender() {
            return this.good_list.filter((ele) => {
                return ele.name.indexOf(this.keyword) > -1;
            });
        }
    },
    data() {
        return {
            keyword: ''
        };
    },
    methods: {
        ...mapMutations([
            'ADD_TO_CART'
        ]),
        addToCart(product) {
            this.ADD_TO_CART(product.gid);
        }
    }
}
</script>

<style scoped>
	.search {
	    float: right;
	    width: 300px;
	}
</style>
