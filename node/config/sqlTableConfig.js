/** 
 * @description: 创建数据库表的SQL语句全局配置
 */
// 创建学生表
const createStudentTable = `
                   id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键id',
                   class varchar(50) NOT NULL COMMENT '班级名称',
                   student_id int(20) NOT NULL COMMENT '学生学号',
                   student_name varchar(100) NOT NULL COMMENT '学生姓名',
                   sex int(11) NOT NULL DEFAULT 0 COMMENT '0:男 1:女',
                `;
                
// 创建学生管理信息表
const createStudentmanagentinfoTable = `
                id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键id',
                class varchar(50) NOT NULL COMMENT '班级名称',
                student_id int(20) NOT NULL COMMENT '学生学号',
                student_name varchar(100) NOT NULL COMMENT '学生姓名',
                sex int(11) NOT NULL DEFAULT 0 COMMENT '0:男 1:女',
                group_name varchar(50) NOT NULL COMMENT '分组名称',
                seat_row int(11) NOT NULL COMMENT '座位行',
                seat_column int(11) NOT NULL COMMENT '座位列',
                seat_number int(11) NOT NULL COMMENT '座位号',
                course_name varchar(100) NOT NULL COMMENT '课程名称',
                course_id int(20) NOT NULL COMMENT '课程id',
            `;

// 创建单独学生的表
const createStudentTableForSingle = `
                id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键id',
                class varchar(50) NOT NULL COMMENT '班级名称',
                student_id int(20) NOT NULL COMMENT '学生学号',
                student_name varchar(100) NOT NULL COMMENT '学生姓名',
            `;

// 创建小组表
const createGroupTable = `
                id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键id',
                group_name varchar(50) NOT NULL COMMENT '分组名称',
                group_id int(20) NOT NULL COMMENT '分组id',
                group_leader varchar(100) NOT NULL COMMENT '组长姓名',
                group_leader_id int(20) NOT NULL COMMENT '组长学号',
                group_member varchar(100) NOT NULL COMMENT '组员姓名',
            `;

module.exports = {
    createStudentTable,
    createStudentmanagentinfoTable,
    createStudentTableForSingle,
    createGroupTable,
};