<?php  

	include "config.php";

	if($_GET['full_name'])
	{
		$full_name = $_GET['full_name'];
                $query = "SELECT * FROM contacts WHERE full_name = '$full_name' ORDER BY id DESC";

	}
	else
	{
                $query = "SELECT * FROM contacts ORDER BY id DESC";
		
	};

	$contacts = $admindb->ExecSQL($query,$conn);

echo json_encode($contacts);

?>

