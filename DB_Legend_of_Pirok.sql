-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dic 22, 2020 alle 17:50
-- Versione del server: 5.6.20
-- PHP Version: 5.5.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `legend_of_pirok`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `accounts`
--

CREATE TABLE IF NOT EXISTS `accounts` (
`id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Dump dei dati per la tabella `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`) VALUES
(1, 'Player1', '$2y$10$2O5ubQFGiSjxk6/hqH7zNezjA2mCMrtzuRpYDfCvsV8NuPFbf8Y7C'),
(2, 'Player2', '$2y$10$Kq8MFAgxCzYuub9se6UWF.1GnCewMq1SUtykCk9alo4RgYVnRWWqq'),
(3, 'Player3', '$2y$10$8j5pPKRqxHdGRkJ8ZXY.p.641zUQhm5DlwpH6GybpDBEobnPdiCYa'),
(4, 'Player4', '$2y$10$WbiOBpUQp0Fswwra2X7ffuzd8NyPy.BxuydHrYUyZY5dyMA.0Yxd2'),
(5, 'Player5', '$2y$10$Q3oVAl3aJwYAOV1kaNy1Q.kJ75zMJJD3Lx8b1GU9dTWeVSjVVOwam'),
(6, 'Player6', '$2y$10$qcgBxVPlvsZ.PClZnKpmOuQy.BvI/F/NIkWhUHEe08mYsS2JMKM0e'),
(7, 'Player7', '$2y$10$SQB11AO77NgPGxxV5OVDq.SNH/Wa3NT2qg9xxuKyjSqXMbW4e6Aou'),
(8, 'Player8', '$2y$10$dlEd8K0SoDLmEQBHBnPseebaH/l8Fn/1msJrC0mtC1ZkBKLvdSY7C'),
(9, 'Player9', '$2y$10$IgAYurABN84OcQtwEyW0Vej/qqnW4866GIVFEHBgdxRhICSKACWym'),
(10, 'Player10', '$2y$10$1/4F5Cne6eidqFC7UPFV/OINBu/iyCUee0PCu5Iwi9u/LVpilftO2'),
(11, 'Player11', '$2y$10$oHb7i/gXGrcgjJYbnnJ6HuQXjjSp39GX.3eKPtbE3jpmD7DgB95WC');

-- --------------------------------------------------------

--
-- Struttura della tabella `scores`
--

CREATE TABLE IF NOT EXISTS `scores` (
  `account_id` int(11) NOT NULL,
  `difficulty` varchar(50) NOT NULL,
  `level` int(11) NOT NULL,
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dump dei dati per la tabella `scores`
--

INSERT INTO `scores` (`account_id`, `difficulty`, `level`, `score`) VALUES
(1, 'Easy', 3, 49),
(1, 'Hard', 1, 22),
(1, 'Normal', 3, 111),
(2, 'Hard', 1, 3),
(3, 'Normal', 3, 127),
(4, 'Easy', 2, 27),
(5, 'Normal', 1, 10),
(6, 'Normal', 1, 10),
(7, 'Normal', 1, 13),
(8, 'Easy', 1, 2),
(9, 'Hard', 1, 1),
(10, 'Hard', 1, 27),
(11, 'Normal', 1, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
 ADD PRIMARY KEY (`account_id`,`difficulty`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `scores`
--
ALTER TABLE `scores`
ADD CONSTRAINT `scores_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
