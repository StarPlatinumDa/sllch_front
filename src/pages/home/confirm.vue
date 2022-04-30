<template>
	<view>
		<text>skdjf</text>
		<view>
			<image></image>
		</view>
<!-- 		<view>
			<el-form :label-position="left">
				<el-form-item label="病害等级">
					<el-select v-model="level" placeholder="请选择">
						<el-option label="1级病害" value=1></el-option>
						<el-option label="2级病害" value=2></el-option>
						<el-option label="3级病害" value=3></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="桥梁位置">
					<el-input v-model="location" placeholder="位置信息" suffix-icon="el-icon-location-information" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="备注信息">
					<el-input v-model="comment" placeholder="可为空"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" round>确认添加</el-button>
				</el-form-item>
			</el-form>
		</view> -->
		<view>
			<uni-calendar 
			:insert="true"
			:lunar="true" 
			:start-date="'2019-3-2'"
			:end-date="'2019-5-20'"
			 />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				level: "",
				location: "",
				comment: "",
			}
		},
		methods: {
			
		}
	}
</script>

<style>
/* 	.el-input {
		display:block;
		width: 80%;
		margin: auto;
	}
	.el-button {
		display:block;
		width: 80%;
		margin: auto;
	} */
</style>
