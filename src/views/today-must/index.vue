<template>
  <div style="width:95%;margin: 5px auto;">
    <el-card class="box-card" style="width: 100%;">
      <div slot="header" class="clearfix" style="text-align: center;">
        <span style="font-size: 2em;margin: 0.67em 0;font-weight: bold;">今日必达</span>
      </div>
      <div class="app-container">
        <div class="filter-container">
          <el-input v-model="listQuery.title" :placeholder="$t('table.title')" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-select v-model="listQuery.complete" :placeholder="$t('table.state')" style="width: 140px" class="filter-item" @change="handleFilter">
            <el-option v-for="item in completeList" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <!-- 判断当前选中的是几条数据   如果是多条则是批量修改  如果是单条则是修改  如果是无则是添加 -->
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
          <el-button type="primary" class="filter-item" icon="el-icon-delete" @click="batchDelete">{{ $t('table.delete') }}</el-button>
          <el-button :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
        </div>
        <el-table ref="todayMustTable" class="todayMustTable" :data="todayMustList" tooltip-effect="dark" @row-click="handleSelectionChange">
          <el-table-column type="selection" width="50%" align="center" fixed />
          <el-table-column label="序号" type="index" width="50%" align="center" fixed />
          <el-table-column label="创建日期" width="150%" align="center" fixed>
            <template slot-scope="scope">{{ scope.row.createTime.substring(0,10) }}</template>
          </el-table-column>
          <el-table-column label="执行时间" width="150%" align="center" fixed>
            <template slot-scope="scope">
              <!-- 此处的表尽可能的根据时间的越来越近，并且任务待办的情况下，用颜色来表示轻重缓急 -->
              <i class="el-icon-time" />
              {{ scope.row.executionTime.substring(11) }}</template>
          </el-table-column>
          <el-table-column prop="title" label="必达主题" align="center" show-overflow-tooltip>
            <!--  如果是单条则是修改  -->
            <template slot-scope="scope">
              <div slot="reference" class="name-wrapper">
                <el-tag size="medium">{{ scope.row.title }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100%" align="center">
            <template slot-scope="scope">
              <!-- 此处尽可能改成标签 -->
              <el-tag v-if="scope.row.complete == false" type="danger">未完成</el-tag>
              <el-tag v-if="scope.row.complete == true" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100%" align="center" fixed="right">
            <template slot-scope="scope">
              <router-link :to="'/today-must/view/'+scope.row.id+'/view'">
                <el-button icon="el-icon-edit" size="mini" type="primary" />
              </router-link>
              <!--<el-button type="danger" size="mini" icon='el-icon-delete'></el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          :current-page="listQuery.page"
          :page-size="listQuery.limit"
          :page-sizes="[10, 20, 50]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import { getTodayMustList, batchDeleteTodayMust } from '@/api/today-must' // 请求

export default {
  name: 'TodayMustList',
  data() {
    return {
      // 查询条件
      listQuery: {
        user: 0,
        page: 1, // 第几页
        limit: 10, // 单页多少条
        today: true, // 是否是当天
        title: '', // 主题
        complete: null // 完成状态
      },
      total: 0,
      // 状态选框
      completeList: [{ label: '请选择', key: null }, { label: '未完成', key: false }, { label: '已完成', key: true }],
      // 今日必达事项
      todayMustList: [
        { id: '1', user: '1', createTime: '21:04:00', executionTime: '22:00:00', title: '示例主题', todaymust: '示例信息', complete: true, sort: 1 }
      ],
      // 是否正在下载文件
      downloadLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.getList()
  },
  methods: {
    handleFilter() {
      /**
       * 查询数据响应方法
       */
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      /**
       * 获取今日必达事项
       */
      this.listQuery.user = this.user
      getTodayMustList(this.listQuery).then(data => {
        this.todayMustList = data.todayMusts
        this.total = data.total
      })
    },
    batchDelete() {
      /**
       * 批量删除今日必达
       */
      batchDeleteTodayMust(this.$refs.todayMustTable.selection).then(response => {
        console.log('删除完毕')
      })
    },
    handleSelectionChange(row, column, event) {
      /**
       * 手动选择列表行
       * 输出当前选中行：this.$refs.todayMustTable.selection
       */
      this.$refs.todayMustTable.toggleRowSelection(row)
    },
    handleCreate() {
      /**
       * 添加页面
       */
      this.$router.push('/today-must/viewTodayMust/0/create')
    },
    handleDownload() {
      /**
       * 导出数据
       */
    },
    handleSizeChange(val) {
      /**
       * pageSize 改变时会触发
       */
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      /**
       * currentPage 改变时会触发
       */
      this.listQuery.page = val
      this.getList()
    }
  }
}
</script>

<style>
    todayMustTable {
      width: 100%;
      min-height: 600px;
    }
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: "";
    }
    .clearfix:after {
      clear: both
    }

    .box-card {
      width: 480px;
    }

    .bold {
        font-weight: bold;
    }
  </style>
