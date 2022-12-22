<?php
    session_start();

    include 'connectMySQL.php';

    if ( isset($_POST['username'], $_POST['password']) ) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Prepare our SQL to prevent SQL injection
        if ( $stmt = $mysqli->prepare('SELECT id FROM accounts WHERE username = ?') ) {
            //Bind parameters
            $stmt->bind_param('s', $username);
            $stmt->execute(); //prevents SQL injection
            //Store the result so we can check if this username already exists in the database
            $stmt->store_result();

            //insert the new account only if this username doesn't already exists 
            if ($stmt->num_rows == 0) {
                $password_hash = password_hash($password, PASSWORD_BCRYPT); //encrypt password before sending it to MySQL
                $query = "INSERT INTO legend_of_pirok.accounts (`id`, `username`, `password`) VALUES (NULL, '{$username}', '{$password_hash}');";
                $query_result = $mysqli->query($query);
                $result = array('result' => $query_result);
                print json_encode($result);

                if ($result) {
                    $stmt->bind_result($id);
                    $stmt->fetch();
                    //Create sessions so we know the user is logged in
                    session_regenerate_id();
                    $_SESSION['loggedin'] = TRUE;
                    $_SESSION['username'] = $_POST['username'];
                    $_SESSION['account_id'] = $id;
                }

            } else {
                $error = array('error' => 'This username already exists');
                print json_encode($error);
            }

            $stmt->close();
        }

    } else {
        $error = array('error' => 'Incorrect parameters');
        print json_encode($error);
    }
?>