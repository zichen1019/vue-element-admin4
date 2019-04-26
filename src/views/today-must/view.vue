<template>
  <el-card v-loading.fullscreen.lock="loading" class="box-card" style="width:95%;margin: 5px auto;">
    <div slot="header" class="clearfix text-center">
      <div style="margin-bottom: 20px;text-align: left;">
        <el-button type="primary" icon="el-icon-upload" @click="save">提交</el-button>
      </div>
      <div style="border-bottom: 1px solid #ebeef5;width: 110%;margin-left: -20px;margin-bottom: 20px;" />
      <span>新增必达</span>
    </div>
    <el-form class="el-form" label-position="right" label-width="130px">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="创建时间" prop="createDate">
            <el-date-picker v-model="entity.createDate" type="datetime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-form-item label="执行时间">
            <el-date-picker v-model="entity.executionTime" type="datetime" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="主题信息">
            <el-input v-model="entity.title" placeholder="请输入主题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="详细信息">
            <markdown-editor id="contentEditor" ref="contentEditor" v-model="entity.todaymust" class="hideToHtmlBtn" placeholder="Markdown模式存储信息。快来试试吧" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="完成状态">
            <el-select v-model="entity.complete" placeholder="请选择">
              <el-option v-for="c in complete" :key="c.key" :label="c.val" :value="c.key" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="18">
          <el-form-item label="优先级">
            <el-input-number v-model="entity.sort" :min="0" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import MarkdownEditor from '@/components/MarkdownEditor'
import { saveTodayMust, getTodayMust } from '@/api/today-must'
export default {
  name: 'ViewTodayMust',
  components: { MarkdownEditor },
  data() {
    return {
      entity: {
        id: this.$route.params.id,
        createDate: new Date(),
        executionTime: new Date(),
        title: '1',
        todaymust: '2',
        complete: false,
        sort: 1
      },
      complete: [
        {
          key: false,
          val: '未完成'
        },
        {
          key: true,
          val: '已完成'
        }
      ],
      loading: false,
      state: this.$route.params.state
    }
  },
  created() {
    if (this.$route.params.state !== 'create') {
      this.getData()
    }
  },
  methods: {
    getData() {
      getTodayMust({ id: this.$route.params.id }).then(res => {
        if (res.data.success && res.data.todayMust) {
          this.entity = res.data.todayMust
          this.$message('获取数据成功')
        } else {
          this.$message('获取数据失败')
        }
      })
    },
    save() {
      this.loading = true
      saveTodayMust(this.entity).then(res => {
        this.loading = false
        if (res.data.success) {
          console.log(res.data)
          this.entity.id = res.data.todayMust.id
          this.$message('保存成功')
        } else {
          this.$message('保存失败')
        }
      })
    }
  }
}
</script>
<style>
  .el-form {
    border-color: #5695f9;
    width: 50%;
    margin: auto;
  }
</style>
