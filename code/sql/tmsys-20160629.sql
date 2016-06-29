DROP DATABASE IF EXISTS `tmSys`;
CREATE DATABASE `tmSys`;

USE `tmSys`;
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for attachment
-- ----------------------------
DROP TABLE IF EXISTS `attachment`;
CREATE TABLE `attachment` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '附件ID',
  `name` varchar(255) DEFAULT NULL COMMENT '附件原名称',
  `user_task_id` int(11) NOT NULL COMMENT '执行者与任务关联ID',
  `sql_path` varchar(255) DEFAULT NULL COMMENT 'SQL附件文件路径',
  `image_path` varchar(255) DEFAULT NULL COMMENT '图片附件路径',
  `other_path` varchar(255) DEFAULT NULL COMMENT '其他附件路径',
  `summary` varchar(500) DEFAULT NULL COMMENT '附件说明',
  `created_date` datetime DEFAULT NULL COMMENT '附件创建日期',
  PRIMARY KEY (`id`),
  KEY `user_task_id` (`user_task_id`),
  CONSTRAINT `attachment_ibfk_1` FOREIGN KEY (`user_task_id`) REFERENCES `user_task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for change_log
-- ----------------------------
DROP TABLE IF EXISTS `change_log`;
CREATE TABLE `change_log` (
  `task_id` int(11) DEFAULT NULL COMMENT '任务ID',
  `performer` varchar(20) DEFAULT NULL COMMENT '执行者，如果当前任务日志与执行者无关，则值为null',
  `manager` varchar(20) NOT NULL COMMENT '任务管理员',
  `created_date` datetime DEFAULT NULL COMMENT '日志创建时间',
  `action` char(20) NOT NULL COMMENT '动作类型',
  `note` varchar(500) DEFAULT NULL COMMENT '动作说明',
  KEY `task_id` (`task_id`),
  KEY `performer` (`performer`),
  KEY `manager` (`manager`),
  CONSTRAINT `change_log_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `change_log_ibfk_2` FOREIGN KEY (`performer`) REFERENCES `user` (`account`),
  CONSTRAINT `change_log_ibfk_3` FOREIGN KEY (`manager`) REFERENCES `user` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for issue
-- ----------------------------
DROP TABLE IF EXISTS `issue`;
CREATE TABLE `issue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL COMMENT '问题名称',
  `task_id` int(11) DEFAULT NULL COMMENT '问题关联的任务ID',
  `created_date` datetime DEFAULT NULL COMMENT '创建时间',
  `description` text COMMENT '问题描述',
  `solution` text COMMENT '解决方案',
  `created_by` varchar(20) NOT NULL COMMENT '问题创建者',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `task_id` (`task_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `issue_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  CONSTRAINT `issue_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `user` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `name` varchar(20) NOT NULL COMMENT '任务名称',
  `project_id` int(11) NOT NULL COMMENT '模块所属项目ID',
  `created_date` datetime DEFAULT NULL COMMENT '模块创建日期',
  `created_by` varchar(20) NOT NULL COMMENT '模块创建者',
  `note` varchar(500) DEFAULT NULL COMMENT '模块说明',
  `status` int(1) DEFAULT NULL COMMENT '模块状态',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`project_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `module_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `project` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for project
-- ----------------------------
DROP TABLE IF EXISTS `project`;
CREATE TABLE `project` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `name` varchar(50) DEFAULT NULL COMMENT '项目名称',
  `created_date` datetime DEFAULT NULL COMMENT '项目创建日期',
  `created_by` varchar(20) NOT NULL COMMENT '项目创建者',
  `note` varchar(50) DEFAULT NULL COMMENT '项目描述',
  `status` int(1) DEFAULT NULL COMMENT '项目状态：启用、禁用',
  `ico_path` varchar(255) DEFAULT NULL COMMENT '项目图标',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `project_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`account`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for task
-- ----------------------------
DROP TABLE IF EXISTS `task`;
CREATE TABLE `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `name` varchar(50) NOT NULL COMMENT '任务名称',
  `module_id` int(11) DEFAULT NULL COMMENT '所属模型ID',
  `created_date` datetime DEFAULT NULL COMMENT '创建日期',
  `target_date` datetime DEFAULT NULL COMMENT '期望完成日期',
  `finish_date` datetime DEFAULT NULL COMMENT '实际完成日期',
  `created_by` varchar(20) DEFAULT NULL COMMENT '任务创建者（管理员）',
  `status` int(2) NOT NULL COMMENT '任务状态',
  `order` int(1) NOT NULL COMMENT '任务优先级',
  `note` varchar(500) DEFAULT NULL COMMENT '任务描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `created_by` (`created_by`),
  KEY `module_id` (`module_id`),
  CONSTRAINT `task_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`account`),
  CONSTRAINT `task_ibfk_2` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `account` varchar(20) NOT NULL COMMENT '用户账户',
  `name` varchar(255) DEFAULT NULL COMMENT '真实姓名',
  `pwd` char(64) NOT NULL COMMENT '加密密码',
  `identity` int(11) NOT NULL COMMENT '用户类型',
  `created_by` varchar(255) DEFAULT NULL COMMENT '用户创建者',
  `created_date` datetime DEFAULT NULL COMMENT '创建日期',
  PRIMARY KEY (`account`),
  UNIQUE KEY `account` (`account`),
  KEY `create_by` (`created_by`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `user` (`account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for user_task
-- ----------------------------
DROP TABLE IF EXISTS `user_task`;
CREATE TABLE `user_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户任务关联ID',
  `task_id` int(11) NOT NULL COMMENT '任务ID',
  `performer` varchar(20) NOT NULL COMMENT '任务执行者',
  `created_date` datetime DEFAULT NULL COMMENT '执行者接受任务时间',
  `finash_date` datetime DEFAULT NULL COMMENT '任务完成时间',
  `manager` varchar(20) DEFAULT NULL COMMENT '任务分配者，执行者主动接受时值为null',
  `order` int(11) DEFAULT NULL COMMENT '在执行者任务库中的优先级',
  `status` int(1) NOT NULL COMMENT '执行者任务库中，任务的状态',
  PRIMARY KEY (`id`),
  KEY `performer` (`performer`),
  KEY `manager` (`manager`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `user_task_ibfk_1` FOREIGN KEY (`performer`) REFERENCES `user` (`account`),
  CONSTRAINT `user_task_ibfk_2` FOREIGN KEY (`manager`) REFERENCES `user` (`account`),
  CONSTRAINT `user_task_ibfk_3` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;


INSERT INTO `tmsys`.`user` (`account`, `name`, `pwd`, `identity`, `created_by`, `created_date`) VALUES ('admin', 'Super Admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '0', 'admin', '2016-03-27 13:56:26');
