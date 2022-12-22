<?php
    session_start();

    include 'connectMySQL.php';

    if ( isset($_POST['username'], $_POST['password']) ) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Prepare our SQL to prevent SQL injection
        if ( $stmt = $mysqli->prepare('SELECT id, password FROM accounts WHERE username = ?') ) {
            //Bind parameters
            $stmt->bind_param('s', $username);
            $stmt->execute(); //prevents SQL injection
            //Store the result so we can check if this username already exists in the database
            $stmt->store_result();

            //Check if exists one account with that username in the database and fetch the result
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($id, $password_hash);
                $stmt->fetch();

                //If account exists, verify the password
                if (password_verify($password, $password_hash)) {
                    //Create sessions so we know the user is logged in
                    session_regenerate_id();
                    $_SESSION['loggedin'] = TRUE;
                    $_SESSION['username'] = $_POST['username'];
                    $_SESSION['account_id'] = $id;

                    $result = array('result' => $_SESSION['loggedin']);
                    print json_encode($result);
                } else {
                    //Wrong password
                    $error = array('error' => 'Wrong unsername or password!');
                    print json_encode($error);
                }
            } else {
                //Wrong username
                $error = array('error' => 'Wrong unsername or password!');
                print json_encode($error);
            }
            
            $stmt->close();
        }

    } else {
        $error = array('error' => 'Incorrect parameters');
        print json_encode($error);
    }
?>