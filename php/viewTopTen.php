<?php
    session_start();

    include 'connectMySQL.php';

    if ( $stmt = $mysqli->prepare(' SELECT A.username, S2.difficulty, S2.level, S2.score 
                                    FROM ( SELECT account_id, MAX(score) AS maxScore FROM scores GROUP BY account_id ) AS S
                                        INNER JOIN scores S2 ON S.account_id = S2.account_id AND S.maxScore = S2.score
                                        INNER JOIN accounts A ON S2.account_id = A.id 
                                    ORDER BY S2.score DESC, S2.level DESC
                                    LIMIT 10; ')
        ) {

        $stmt->execute();
        $stmt->store_result();

        $result = array();

        for ($i = 0; $i < 10; $i++) {
            $stmt->bind_result($username, $difficulty, $level, $score);
            $stmt->fetch();
            
            if ($score === null)
                break;

            $elem = array('username'=>$username, 'difficulty'=>$difficulty, 'level'=>$level, 'score'=>$score);
            array_push($result, $elem);
        }

        print json_encode($result);

        $stmt->close();
    }
?>