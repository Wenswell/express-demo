软件使用: https://www.heidisql.com/

# sqlite3基础

## 数据类型

**INTEGER** 值是一个带符号的整数，根据值的大小存储在1、2、3、4、6或8字节中
**REAL** 值是一个浮点值，存储为8字节的IEEE浮点数字
**TEXT** 值是一个文本字符串，使用数据库编码（UTF-8、UTF-16BE或UTF-16LE）存储。
**BLOB** 值是一个blob数据，完全根据它的输入存储。

## 关系模型

关系数据库是建立在关系模型上的。而关系模型本质上就是若干个存储数据的二维表

- 表的每一行称为记录（Record），记录是一个逻辑意义上的数据。

- 表的每一列称为字段（Column），同一个表的每一行记录都拥有相同的若干字段。

## 创建表

```sqlite
CREATE TABLE "user" (
  "id" BIGINT NOT NULL,
  "name" VARCHAR(50) NULL,
  "account" VARCHAR(50) NULL,
  "password" VARCHAR(50) NULL,
  "token" VARCHAR(50) NULL,
  "creat_time" BIGINT NULL,
  "balance" BIGINT NULL,
  PRIMARY KEY ("id")
);
```


## 查询数据

### 基本查询 SELECT
```sqlite
SELECT * FROM `user`
```
- `SELECT`是关键字，表示将要执行一个查询，`*`表示“所有列”，`FROM`表示将要从哪个表查询
- 不带 FROM 如 `SELECT 1;` 用来测试数据库连接

### 去重 SELECT DISTINCT
```sqlite
SELECT DISTINCT column1, column2, ...
FROM table_name;
```

### 条件查询
通过 `WHERE` 条件来设定查询条件
```sqlite
SELECT * FROM students WHERE score >= 80
```
- 不加括号，条件运算按照 `NOT`、`AND`、`OR` 的优先级进行

- 不等于： `<>` `!=`

- `BETWEEN` 在某个范围内

- `LIKE`  搜索某种模式，如**通配符**

- `IN`  指定针对某个列的多个可能值
```sqlite
SELECT column1, column2, ...
FROM table_name
WHERE column IN (value1, value2, ...);
```

### 投影查询
```sqlite
SELECT 列1, 列2, 列3 FROM ...
SELECT 列1 别名1, 列2 别名2, 列3 别名3 FROM ...
```
- 让结果集仅包含指定列
- 结果集的列的顺序可以更改
- 结果集的列名可以更改

### 分页查询 limit
```sqlite
SELECT `id`,`name`,`balance`
FROM `user`

-- 只查询前 2 条
LIMIT 2;

-- 返回2条记录，但跳过前4条，从第3页开始
LIMIT 2 OFFSET 4;

-- 从第 3 条开始往后查询 6 条
LIMIT 3,6;
```

### 排序 order by

```sqlite
-- 默认 ASC 升序 ASC 可省略
SELECT * FROM `user` ORDER BY `creat_time` ASC;

-- 后面添加 DESC 降序排序
SELECT * FROM `user` ORDER BY `creat_time` DESC;

-- 可以指定多个字段进一步排序
SELECT * FROM `user` ORDER BY `creat_time`, `id` LIMIT 3

-- 如果有 WHERE子句，那么ORDER BY子句要放到WHERE子句后面
SELECT id, name, gender, score
FROM students
WHERE class_id = 1
ORDER BY score DESC;
```



## 修改数据

- 最好先用`SELECT`语句来测试`WHERE`条件是否筛选出了期望的记录集，然后再更新/删除



###  插入 INSERT

`INSERT`语句的基本语法是：

```sqlite
INSERT INTO <表名> (字段1, 字段2, ...) VALUES (值1, 值2, ...);
```
```sqlite
-- 添加反引号（`）将关键字和列名括起来 可以确保 SQL 语句在不同的数据库中都能够正常运行
INSERT INTO `user` 
(`id`, `name`, `account`, `PASSWORD`, `creat_time`, `balance`)
VALUES 
-- VALUES 后面可以有多组值并用 , 逗号分隔
(1, 'Paul', 'tetasf01', '123456', 123456, 100),
(2, 'John', 'user02', 'pass123', 124000, 200),
(3, 'Lily', 'lily15', 'flower15', 122000, 50);
-- 语句末尾使用 ;

-- 可以不换行
INSERT INTO user VALUES (1, 'John');
```


### 更新 UPDATE

- `UPDATE`语句的`WHERE`条件和`SELECT`语句的`WHERE`条件是一样的
- 如果`WHERE`条件没有匹配到任何记录，`UPDATE`语句不会报错，也不会有任何记录被更新
- 不带`WHERE`条件的`UPDATE`语句会更新**整个表**的数据

```sqlite
UPDATE <表名> SET 字段1=新值1, 字段2=新值2, ... WHERE ...;

-- 选择表
UPDATE table_name
-- 设置新值
-- '字符串'用单引号包裹
SET column1 = value1, column2 = value2, ...
-- 确定修改哪条/些数据
WHERE condition;
```

### 删除 DELETE

- 如果`WHERE`条件没有匹配到任何记录，`DELETE`语句不会报错，也不会有任何记录被删除
- 和`UPDATE`类似，不带`WHERE`条件的`DELETE`语句会删除**整个表**的数据


```sqlite
DELETE FROM <表名> WHERE ...;
```



## 索引 Index

- 索引的目的是加快数据检索,相当于一个指向表数据的指针。
- 索引通过预排序数据来实现高效检索,避免扫描全表。
- 索引效率取决于索引列值的散列性。值越不相同,效率越高。
- 可以为一张表创建多个索引。这提高了查询效率, 但影响插入、修改、删除等操作。
- 主键索引效率最高,因为主键保证唯一。
- 需要避免在某些场景使用索引:
  - 小表
  - 频繁更新的表
  - 包含大量NULL值的列
  - 频繁操作的列

```sqlite
-- 语法
CREATE [UNIQUE] INDEX index_name ON table_name (column_name, column_name);

-- 索引类型 * 3

-- 单列索引
CREATE INDEX test_index ON `user` (`account`);

-- 唯一索引
CREATE UNIQUE INDEX test_index ON `user` (`account`);

-- 组合索引
CREATE INDEX test_index ON `user` (`account`, `name`);
```
```sqlite
-- 查看索引
SELECT * FROM sqlite_master WHERE type = 'index'
```
```sqlite
-- 删除索引
DROP INDEX test_index;
```



### 约束

约束是在创建表的时候，可以给表的字段添加相应的约束，添加约束的目的是为了保证表中数据的合法性、有效性、完整性。
常见的约束有：非空约束（not null）唯一约束（unique）、主键约束（primary key）
**NOT NULL** 约束
**UNIQUE** 约束
**PRIMARY Key** 约束



## 常用函数

[官方文档](https://www.sqlite.org/lang_corefunc.html)
序号函数&描述

`COUNT`：计算一个数据库表中的行数

`MAX`/`MIN`：选择某列的最大/最小值

`AVG`：计算某列的平均值

`SUM`：数值列计算总和

```sqliteite
-- 使用 AS 重命名（原始值为查询语句 COUNT(*) ）
SELECT COUNT(*) AS `count` FROM `user`
```



## 子查询 IN

子查询或称为内部查询、嵌套查询，指的是在SQLite查询中的WHERE子句中嵌入查询语句


```sqlite
select * from user where id in (select id from user_log)
select * from user where id in (select id from user_log where login_times>5)
```

## JOIN 查询

> JOIN 默认为 **INNER JOIN**

INNER JOIN查询的写法是：

1. 先确定主表，仍然使用`FROM <表1>`的语法；
2. 再确定需要连接的表，使用`INNER JOIN <表2>`的语法；
3. 然后确定连接条件，使用`ON <条件...>`，这里的条件是`s.class_id = c.id`，表示`students`表的`class_id`列与`classes`表的`id`列相同的行需要连接；
4. 可选：加上`WHERE`子句、`ORDER BY`等子句。

**INNER JOIN**只返回同时存在于两张表的行数据，由于`students`表的`class_id`包含1，2，3，`classes`表的`id`包含1，2，3，4，所以，INNER JOIN根据条件`s.class_id = c.id`返回的结果集仅包含1，2，3。

**LEFT OUTER JOIN**返回左表都存在的行。如果某一行仅在左表存在，那么结果集就会以`NULL`填充剩下的字段。


> SQLite只支持 **LEFT OUTER JOIN**
>
> RIGHT OUTER JOIN 返回右表都存在的行。如果某一行仅在右表存在，那么结果集就会以`NULL`填充剩下的字段。
> FULL OUTER JOIN 它会把两张表的所有记录全部选择出来，并且，自动把对方不存在的列填充为NULL

```sqlite
SELECT * FROM `user` INNER JOIN `user_log` ON `user`.`id` = `user_log`.`id`;
-- 效果一样
SELECT * FROM `user` JOIN `user_log` ON `user`.`id` = `user_log`.`id`;

-- 左外查询
SELECT * FROM `user` LEFT OUTER JOIN `user_log` ON `user`.`id` = `user_log`.`id`;

-- 添加别名
SELECT s.id, s.name, s.class_id, c.name class_name, s.gender, s.score
FROM students s
INNER JOIN classes c
ON s.class_id = c.id;
```



### (了解) CROSS JOIN

一般使用主键或外键进行多表关联查询

又叫笛卡尔积，匹配前一个表与后一个表的每一行和每一列，这样得到的结果集为n*m行（n,m分别为每张表的行数），x+y列（x,y分别为每张表的列数）。

多表查询又称笛卡尔查询，一次查询两个表的数据，查询的结果也是一个二维表，它是`students`表和`classes`表的“乘积”，即`students`表的每一行与`classes`表的每一行都两两拼在一起返回。结果集的列数是`students`表和`classes`表的列数之和，行数是`students`表和`classes`表的行数之积

```sqlite
select * from user,user_log;
SELECT * FROM `user` CROSS JOIN `user_log` ON `user`.`id` = `user_log`.`id`;

-- 设置别名
SELECT
    s.id sid,
    s.name,
    s.gender,
    s.score,
    c.id cid,
    c.name cname
FROM students s, classes c;
```



## 事务

把多条语句作为一个整体进行操作的功能，被称为数据库***事务***。

数据库事务可以确保该事务范围内的所有操作都可以全部成功或者全部失败。

事务可以用来维护数据库的完整性，保证成批的SQL语句要么全部执行，要么全部不执行

如果事务失败，那么效果就和没有执行这些SQL一样，不会对数据库数据有任何改动

对于单条SQL语句，数据库系统自动将其作为一个事务执行，这种事务被称为*隐式事务*

数据库事务具有ACID这4个特性：

- A：Atomic，原子性
  - 将所有SQL作为原子工作单元执行，一组事务，要么成功；要么失败回滚
- C：Consistent，一致性
  - 事务完成后，所有数据的状态都是一致的，有非法数据（外键约束之类），事务撤回，
  - 即A账户只要减去了100，B账户则必定加上了100
- I：Isolation，隔离性，
  - 如果有多个事务并发执行，每个事务作出的修改必须与其他事务隔离
  - 一个事务处理后的结果，影响了其它事务，那么其它事务会撤回
  - 事务的100%隔离，需要牺牲速度
- D：Duration，持久性
  - 即事务完成后，对数据库数据的修改被持久化存储
  - 软、硬件崩溃后，SQLite数据表驱动会利用日志文件重构修改

使用`BEGIN`开启一个事务，使用`COMMIT`提交一个事务，这种事务被称为*显式事务*

`COMMIT`是指提交事务，即试图把事务内的所有SQL所做的修改永久保存。如果`COMMIT`语句执行失败了，整个事务也会失败。

`ROLLBACK`回滚事务，用于撤销尚未保存到数据库的事务，整个事务会失败（主动）

```sqlite
-- 开启事务
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- 回滚，以上操作无效
ROLLBACK;

-- 开启事务
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
-- 提交事务，保存数据
COMMIT;
```




```sqlite

```





```sqlite

```



# 踩坑

## 文件夹重名导致路径错误
```bash
C:.
├─db
│      index.js
│      SQLite.md
│      test-2023-06-15-19-42.sqlite3
│      
└─router
    ├─db
    │      index.js
    │      messages.js
    │      users.js
    └─default
```
在 `'../router/db/messages.js'` 里
引用 `const {db} = require('../db')` 
引用的文件是 `'../router/db/index.js'` 
而不是需要的 `'../db/index.js'`

结果报错 `Warning: Accessing non-existent property 'db' of module exports inside circular dependency`