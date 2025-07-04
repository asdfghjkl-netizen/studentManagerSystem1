<template>
	<div class="login-container">
		<el-card class="login-card">
			<h2 class="login-title">管理员登录</h2>
			<el-form @keyup.enter="onSubmit" :model="form" :rules="rules" ref="formRef" label-width="80px">
				<el-form-item label="账号" prop="username">
					<el-input v-model="form.username" placeholder="请输入账号" />
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
				</el-form-item>
				<el-form-item class="login-btn-item no-label">
					<el-button @click="onSubmit" type="primary" class="login-btn">登录</el-button>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { login } from '@/utils/api/author';
import { ElMessage, ElForm, ElFormItem, ElButton, ElInput, ElCard } from 'element-plus';
import router from '@/router';

// 用 ref 包裹对象
const form = ref({
	username: '',
	password: ''
})

const rules = ref({
	username: [
		{ required: true, message: '请输入账号', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' }
	]
})

const formRef = ref()

const onSubmit = () => {
	(formRef.value as any).validate((valid: boolean) => {
		if (!valid) {
			ElMessage.error('请填写完整信息');
			return;
		}
		// 发送登录请求
		login({
			username: form.value.username,
			password: form.value.password
		}).then((res: any) => {
			// console.log('登录响应:', res);

			if (res.code === 200) {
				// 保存 token
				window.sessionStorage.setItem("token", res.data.token);
				window.sessionStorage.setItem('username', res.data.username);
				// 登录成功后跳转到管理页面
				router.push('/manage');
				ElMessage.success({ message: res.message });
			}
		}).catch((error) => {
			ElMessage.error({ message: `登录失败：${error.message}` });
		});
	})
}
</script>

<style lang="scss" scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background: #f5f7fa;

	.login-card {
		width: 350px;
		padding: 30px 20px 20px 20px;

		.login-title {
			text-align: center;
			margin-bottom: 20px;
		}

		.el-form {
			.login-btn-item.no-label {
				margin-top: 24px;
				margin-left: -80px; // label-width的负值，让按钮左移到label左侧
				padding-left: 0;

				.login-btn {
					width: calc(100% + 80px); // 让按钮宽度覆盖label+输入框
					height: 40px;
					font-size: 18px;
					letter-spacing: 6px;
				}
			}
		}
	}
}
</style>