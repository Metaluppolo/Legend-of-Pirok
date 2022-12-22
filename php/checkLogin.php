<?php
    session_start();
    
    $result = isset($_SESSION['loggedin']);
    if($result)
        $result = $_SESSION['username'];
    printf($result);
?>