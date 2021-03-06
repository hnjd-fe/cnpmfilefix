# cnpmfilefix

## 使用说明
    修复cnpm文件缺失

    使用原理：通过分析 cnpm 同步 log, 获取无法安装的npm安装包，然后通过taobao npm源下载缺失的安装包
    
    解决疼点：cnpm 私有源同步时丢失安装包，这个工具下载丢失的安装包到对应位置
    
## 使用依赖

    * 使用 npm package.json 安装依赖的前端项目
    
    * wget 命令
    
    * find 命令
    
    * ag 命令(The Silver Searcher)

## 一键初始化 (切换到项目根目录, 然后执行以下命令)
    sudo npm install -g cnpmfilefix && cnpmfilefix --auto

## 安装全局指令
    sudo npm install -g cnpmfilefix

## 设置处理指令与配置文件、并处理最近30天的日志文件: cnpmfilefix --auto 
    cd projectRoot && cnpmfilefix --auto
    
    # cnpmfilefix --auto = cnpmfilefix --setup && cnpmfilefix --full
    
## 其他操作
    
### 设置提交指令并拷贝配置文件: cnpmfilefix --setup 
    cd projectRoot && cnpmfilefix --setup
    
    # 这个指令自动添加1个npm模块 cnpmfilefix
    # 并在 package.json 的 scripts 添加 cnpmfilefix 指令
    # 拷贝 cnpmfilefix 模块里的 cnpmfilefix.config.js 到项目根目录
    
### 处理所有文件指令: cnpmfilefix --full 
    cd projectRoot && cnpmfilefix --full
    
    # 处理所有符合条件的文件

### 处理指定文件指令: cnpmfilefix --target 
    cd projectRoot && cnpmfilefix --target /feuid/download/feuid-1.0.21.tgz
    
    # 处理单个指定的文件

### 检查存在异常的文件: cnpmfilefix --check
    cd projectRoot && cnpmfilefix --check
    
    # 检查存在异常的文件，该指令只做检查用，不进行实际文件操作
    
### 显示帮助指令: cnpmfilefix --help
    cnpmfilefix --help
    
    # 显示所有可用命令
    
## 参数配置文件 cnpmfilefix.config.js
	如果运行命令的项目根目录有 cnpmfilefix.config.js，工具会自动读取配置参数

## cnpmfilefix.config.js 说明
	{
        logsPath: "./dataDir/logs/"                               //设置日志文件目录
        , dataDir: "./dataDir/nfs/"                               //设置安装包根目录
        , lastDay: -30                                            //需要处理最近N天的日志
        , resolveRegistry: "https://registry.npm.taobao.org/"     //用于下载缺失文件的npm源
	}
