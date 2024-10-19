<template>
    <div class="alarm">
        <el-row :gutter="20">
            <el-col :span="2">
                <div class="passage">
                    走廊
                </div>
            </el-col>
            <el-col :span="8">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="item in list['0']" :key="item">
                        <div :class="['seat', data.selectList.indexOf(item) > -1 ? 'active' : '']" @click="add(item)">
                            {{ item }}<h5>{{ data.stuSeat[item - 1] }}</h5>
                        </div>
                    </el-col>
                </el-row>
            </el-col>
            <el-col :span="2">
                <div class="passage">
                    过道
                </div>
            </el-col>
            <el-col :span="12">
                <el-row :gutter="20">
                    <el-col :span="4" v-for="item in list['1']" :key="item">
                        <div :class="['seat', data.selectList.indexOf(item) > -1 ? 'active' : '']" @click="add(item)">
                            {{ item }}</div>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
import { reactive, computed } from 'vue';
const data = reactive({
    seatList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], // 模拟后台返回的座位表
    stuSeat: ["aaa", "bbb", "ccc", "ddd"],
    selectList: [] as number[], // 所选座位表id
})

// 根据每行多少列拆分数组，目前1行8列(根据自己需求来，如果只有6列修改%8=>%6)
const list = computed(() => {
    let arr = [[] as number[], [] as number[]]  // 定义二维数组的变位表
    let a = [[] as number[]]

    for (const key in data.seatList) {
        let item = data.seatList[key]

        // 第一、二列添加到一个数组
        if (item % 10 == 1 || item % 10 == 2 || item % 10 == 3 || item % 10 == 4) {
            arr['0'].push(item)
            // 第七、八列添加打一个数组, ==7位列数减一(根据自己需求来)
        } else {
            // 中间列
            arr['1'].push(item)
        }
    }
    arr['0'].reverse()
    a[0] = arr['0'].splice(0, 4).reverse()
    a[1] = arr['0'].splice(0, 4).reverse()
    a[2] = arr['0'].splice(0, 4).reverse()
    a[3] = arr['0'].splice(0, 4).reverse()
    a[4] = arr['0'].splice(0, 4).reverse()
    a[5] = arr['0'].splice(0, 4).reverse()
    for (let i = 0; i < 6; i++) {
        arr['0'] = arr['0'].concat(a[i])
    }

    arr['1'].reverse()
    a[0] = arr['1'].splice(0, 6).reverse()
    a[1] = arr['1'].splice(0, 6).reverse()
    a[2] = arr['1'].splice(0, 6).reverse()
    a[3] = arr['1'].splice(0, 6).reverse()
    a[4] = arr['1'].splice(0, 6).reverse()
    a[5] = arr['1'].splice(0, 6).reverse()
    a[6] = arr['1'].splice(0, 6).reverse()
    for (let i = 0; i < 6; i++) {
        arr['1'] = arr['1'].concat(a[i])
    }
    console.log(arr)

    return arr
})
// 选择座位表
const add = (id: number) => {
    // 已选则删除，否则添加
    if (data.selectList.indexOf(id) > -1) {
        let index = data.selectList.indexOf(id)
        data.selectList.splice(index, 1)
    } else {
        data.selectList.push(id)
    }
    console.log(data.selectList)
}
</script>

<style lang="scss" scoped>
.alarm {
    padding: 2rem;
    margin: 2rem;
    border-radius: 7px;
    background: #fff;

    .passage {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .seat {
        width: 100%;
        height: 100px;
        border: solid 1px blue;
        cursor: pointer;
    }

    .seat.active {
        background: red;
        color: #fff;
    }

    ::v-deep(.el-col) {
        margin: 0.5rem 0;
    }
}
</style>
