<template>
<div>
    <el-header >后台</el-header>
    <div class="clearfix">
        <el-button type="success" class="addGoods" @click="dialogFormVisible = true">添加商品</el-button>
    </div>
  	<el-container style="height: 500px; border: 1px solid #eee">
  <el-container>
    <el-main>
      <el-table :data="goodsData">
        <el-table-column prop="gid" label="商品ID" width="180"></el-table-column>
        <el-table-column prop="name" label="名称" width="140">
        </el-table-column>
        <el-table-column prop="intro" label="描述" width="300">
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column prop="amount" label="库存">
        </el-table-column>
        <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
                <i class="el-icon-delete" @click="deleteClick(scope.row)"></i>
            </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</el-container>

<el-dialog title="添加商品" :visible.sync="dialogFormVisible">
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name">
      <el-input v-model="ruleForm.name" maxlength="20"></el-input>
    </el-form-item>
    <el-form-item label="商品描述" :label-width="formLabelWidth"  prop="intro">
      <el-input v-model="ruleForm.intro" type="textarea" maxlength="50"></el-input>
    </el-form-item>
    <el-form-item label="商品价格" :label-width="formLabelWidth" prop="price">
      <el-input v-model="ruleForm.price" class="inputShort"></el-input>
    </el-form-item>
    <el-form-item label="库存" :label-width="formLabelWidth" prop="amount">
      <el-input v-model="ruleForm.amount" class="inputShort"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="success" @click="submitForm('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
</div>
</template>

<script>
import {$http} from '../utils/fetch';
export default {
    name: 'backStage',
    data() {
        return {
            goodsData: [],
            dialogFormVisible: false,
            ruleForm: {
                name: '',
                intro: '',
                price: '',
                amount: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'},
                    {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                ],
                intro: [
                    {required: true, message: '请输入商品简介', trigger: 'blur'}
                ],
                price: [
                    {pattern: /^-?\d+\.?\d*$/, required: true, message: '请输入正确价格', trigger: 'blur'}
                ],
                amount: [
                    {pattern: /^\d+$/, required: true, message: '请输入正确库存', trigger: 'blur'}
                ]
            },
            formLabelWidth: '120px'
        };
    },
    created() {
        this.getGoods();
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.requestForm();
                    this.dialogFormVisible = false;
                    this.$refs[formName].resetFields();
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async requestForm() {
            let params = {
                ...this.ruleForm
            };
            let result;
            try {
                result = await $http('http://127.0.0.1:3333/addGoods', {
                    method: 'POST',
                    params
                });
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (result && result.errno === 0) {
                this.goodsData.push(result.data);
            }

        },
        async getGoods() {
            let result;
            try {
                result = await $http('http://127.0.0.1:3333/getGoods');
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (result && result.errno === 0 && result.data) {
                this.goodsData = result.data;
            }

        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        deleteClick(row) {
            let {gid} = {
                ...row
            };
            this.$confirm('确认删除？')
                .then(_ => {
                    this.requestDelete(gid);
                })
                .catch(_ => {
                });
        },
        async requestDelete(gid) {
            let result;
            try {
                result = await $http('http://127.0.0.1:3333/delGoods', {
                    method: 'POST',
                    params: {
                        gid
                    }
                });
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (result && result.errno === 0) {
                let index = this.goodsData.findIndex((ele) => {
                    return ele.gid === gid;
                });
                this.goodsData.splice(index, 1);
            }

        }
    }
}
</script>

<style scoped>
.el-header {
    line-height: 60px;
    color: #fff;
    background-color: #67c23a;
}

.el-aside {
    color: #333;
}

.addGoods {
    float: right;
    margin: 20px;
}
.clearfix:after {
    content: " ";
    display: block;
    visibility: hidden;
    clear: both;
    overflow: hidden;
    height: 0;
}
.inputShort {
    width: 200px;
}
.el-icon-delete:hover {
    color: #f00;
}
.el-form {
    text-align: left;
}
</style>
