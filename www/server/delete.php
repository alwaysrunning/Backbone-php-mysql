<?php

	include 'config.php';

	$id = $_GET['id'];


	 $query = "DELETE FROM contacts WHERE id = '$id' ";

     $result = $admindb->ExecSQL($query,$conn);
	

	 if ($result) 
	 {
	    echo json_encode(array('success' => true));
	 }
	 else 
	 {
	    echo json_encode(array(
	    	'success' => false,
	    	 'msg' => 'Something wrong '
	    ));
	 }

	 ?>