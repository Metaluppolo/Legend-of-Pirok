<?php
    session_start();

    include 'connectMySQL.php';

    if (isset($_SESSION['loggedin'])) {
        $account_id = $_SESSION['account_id'];
        $username = $_SESSION['username'];

        if ( $stmt = $mysqli->prepare('SELECT difficulty, level, score FROM scores WHERE account_id = ?') ) {

            $stmt->bind_param('i', $account_id);
            $stmt->execute();
            $stmt->store_result();

            $result = array();

            for ($i = 0; $i < 3; $i++) {
                $stmt->bind_result($difficulty, $level, $score);
                $stmt->fetch();
                
                if ($score === null)
                    break;
    
                $elem = array('username'=>$username, 'difficulty'=>$difficulty, 'level'=>$level, 'score'=>$score);
                array_push($result, $elem);
            }
    
            print json_encode($result);

            $stmt->close();
        }
    } else {
        $error = array('error' => 'User is not logged in!');
        print json_encode($error);
    }
?>