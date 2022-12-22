<?php
    session_start();
    
    if (!isset($_SESSION['loggedin'])) {
        $error = array('error' => 'Score not saved: player is not log in');
        print json_encode($error);
        exit;
    }

    include 'connectMySQL.php';

    if ( isset($_SESSION['account_id'], $_GET['difficulty'], $_GET['level'], $_GET['score']) ){
        $id = $_SESSION['account_id'];
        $difficulty = $_GET['difficulty'];
        $level = $_GET['level'];
        $newScore = $_GET['score'];
    
        // Prepare our SQL to prevent SQL injection
        if ( $stmt = $mysqli->prepare('SELECT score FROM scores WHERE account_id = ? AND difficulty = ?') ) {
            //Bind parameters
            $stmt->bind_param('is', $id, $difficulty);
            $stmt->execute(); //prevents SQL injection
            //Store the result so we can check if this username already exists in the database
            $stmt->store_result();
    
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($oldScore);
                $stmt->fetch();
                if ($newScore > $oldScore) {
                    $query = "UPDATE legend_of_pirok.scores SET level = '{$level}', score = '{$newScore}' WHERE account_id = '{$id}' AND difficulty = '{$difficulty}';";
                    $query_result = $mysqli->query($query);
                    $result = array('result' => $query_result);
                    print json_encode($result);
                }
            } else if ($stmt->num_rows() == 0) {
                $query = "INSERT INTO legend_of_pirok.scores (`account_id`, `difficulty`, `level`, `score`) VALUES ('{$id}', '{$difficulty}', '{$level}', '{$newScore}');";
                $query_result = $mysqli->query($query);
                $result = array('result' => $query_result);
                print json_encode($result);
            }
    
            $stmt->close();
        }

    } else {
        $error = array('error' => 'Incorrect parameters');
        print json_encode($error);
    }

?>