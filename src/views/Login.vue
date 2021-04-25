<template>
<div class="login-main">
    <h1 class="login-title">登录</h1>
    <el-container>
        <el-main>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="密码"  prop="password">
                <el-input v-model="ruleForm.password" type="password" maxlength="50"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" class="login-btn" @click="submitForm('ruleForm')">登录</el-button>
        </el-main>
        
    </el-container>

</div>
</template>

<script>
import {$http} from '../utils/fetch';
import {rsaEncrypt} from '../utils/rsa';
export default {
    name: 'login',
    data() {
        return {
            ruleForm: {
                name: '',
                password: ''
            },
            rules: {
                name: [
                    {required: true, message: '请输入用户名', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'}
                ]
            }
        };
    },
    created() {

    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.requestForm();
                }
                else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async requestForm() {
            let password = rsaEncrypt(this.ruleForm.password);
            let result;
            try {
                result = await $http('http://127.0.0.1:3333/login', {
                    method: 'POST',
                    params: {
                        username: this.ruleForm.name,
                        password
                    }
                });
            }
            catch (e) {
                console.log(e);
                return;
            }
            if (result && result.errno === 0) {
                document.location.href = this.$route.query.u && this.$route.query.u.href || '/';
            } else {
                this.$message.error(result.errmsg);
            }
        }
    }
}
</script>

<style scoped>
.login-main {
    width: 500px;
    margin: 200px auto;
    border: 1px dashed #eee;
    border-radius: 10px;
    text-align: center;
}
</style>
