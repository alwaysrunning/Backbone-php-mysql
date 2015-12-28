<?php
    include "config.php";

    $id = $_GET['id'];
    $full_name = $_GET['full_name'];
    $email = $_GET['email'];
    $phone = $_GET['phone'];
    $address = $_GET['address'];

    	if ( empty($id) ) 
        {
            $query = "INSERT INTO contacts (full_name, email, phone, address) VALUE ('$full_name', '$email', '$phone', '$address')";

            $result = $admindb->ExecSQL($query,$conn);

            if($result)
            {
                exit(json_encode(array('success' => true, 'msg' => 'Saved!')));
            }
  		
    	} 
        elseif ( $id > 0 )
        {

             $query = "UPDATE contacts SET full_name = '$full_name', email = '$email', phone = '$phone', address = '$address' WHERE id = '$id'";

             $result = $admindb->ExecSQL($query,$conn);

             if($result)
             {
                exit(json_encode(array('success' => true, 'msg' => 'Saved!')));
             }
		
    	}

?>
