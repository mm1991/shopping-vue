<template>
	<div>
		<el-row :gutter="20">
		  	<el-col :span="6">总数：{{totalNum}}</el-col>
		  	<el-col :span="6">合计价格：{{totalPrice}}</el-col>
		  	<el-col :span="10" class="el-col-6">
		  		<el-button type="danger" size="medium" icon="el-icon-delete" @click="dialogDeleteAll">清空购物车</el-button>
				<el-button type="primary" size="medium" icon="el-icon-goods" @click="shoppingNow">立即购买</el-button>
		  	</el-col>
		</el-row>

		<el-dialog title="注意" :visible.sync="dialogVisible" width="20%">
		  	<span>要清空购物车吗?</span>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="dialogSure">确 定</el-button>
		  	</span>
		</el-dialog>
	</div>
  	
</template>

<script>
import { mapMutations, mapGetters, mapState } from 'vuex'
import {$http} from '../utils/fetch';

export default {
	name: 'info',
  	data() {
		return {
			dialogVisible : false
		}
	},
	computed:{
		...mapState([
            'added'
        ]),
		...mapGetters(['totalPrice','totalNum'])
	},
	methods: {
		...mapMutations(['CLEAR']),
		dialogDeleteAll(){
			this.dialogVisible = true;
		},
		dialogSure(){
			this['CLEAR']();
        	this.dialogVisible = false;
      	},
		async shoppingNow() {
			let result;
            try {
                result = await $http('http://127.0.0.1:3333/cartSubmit', {
                    method: 'POST',
                    params: {
                        added: JSON.stringify(this.added)
                    }
                });
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (result && result.errno === 0) {
                this['CLEAR']();
				this.$message({
					showClose: true,
					message: '下单成功',
					type: 'success'
				});
            } else {
                this.$message.error(result && result.errmsg || '下单失败');
            }
		}
    }
}
</script>

<style scoped>
	.el-col-6{
		padding: 20px;
		text-align: center;
	}
</style>
