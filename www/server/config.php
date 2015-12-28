<?php

class ConnDB{
	
	var $dbtype;
	var $host;
    var $user;
    var $pwd;
    var $dbname;
    
	//构造方法
    function ConnDB($dbtype,$host,$user,$pwd,$dbname){
		$this->dbtype=$dbtype;
    	$this->host=$host;
		$this->user=$user;
		$this->pwd=$pwd;
		$this->dbname=$dbname;
	}

    //实现数据库的连接并返回连接对象
    function GetConnId(){
     	
    	if($this->dbtype=="mysql" || $this->dbtype=="mssql"){
    		$dsn="$this->dbtype:host=$this->host;dbname=$this->dbname";
		}else{
			$dsn="$this->dbtype:dbname=$this->dbname";
		}    
		try {
    		$conn = new PDO($dsn, $this->user, $this->pwd); 	//初始化一个PDO对象，就是创建了数据库连接对象$pdo
			$conn->query("set names utf8");
    		return $conn;
		} catch (PDOException $e) {
    		die ("Error!: " . $e->getMessage() . "<br/>");
		}

     	
    }	
}



//数据库管理类
class AdminDB{
	
	
	function ExecSQL($sqlstr,$conn){
		
		$sqltype=strtolower(substr(trim($sqlstr),0,6));
		$rs=$conn->prepare($sqlstr);		//准备查询语句
		$rs->execute();					//执行查询语句，并返回结果集
		if($sqltype=="select"){
			$array=$rs->fetchAll(PDO::FETCH_ASSOC);		//获取结果集中的所有数据
			if(count($array)==0 || $rs==false)
				return false;
			else
				return $array;
		}elseif ($sqltype=="update" || $sqltype=="insert" || $sqltype=="delete"){			
			if($rs)
			    return true;
			else 
			    return false;    
		}
	}
}

$connobj=new ConnDB("mysql","localhost","root","123","db_database18");//数据库连接类实例化
$conn=$connobj->GetConnId();    //执行连接操作，返回连接标识
$admindb=new AdminDB();//数据库操作类实例化    

?>