DROP DATABASE TAGPRESS;

-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 03, 2017 at 02:30 ප.ව.
-- Server version: 10.1.19-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tagpress`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `cid` int(11) NOT NULL,
  `cname` varchar(20) NOT NULL,
  `color` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`cid`, `cname`, `color`) VALUES
(1001, 'default', 'green'),
(1002, 'music', 'darkcyan'),
(1003, 'font', 'darkmagent'),
(1004, 'rating', 'gold'),
(1005, 'date', 'indianred'),
(1006, 'current-state', 'orangered'),
(1007, 'priority', 'red');

-- --------------------------------------------------------

--
-- Table structure for table `filetag`
--

CREATE TABLE `filetag` (
  `filid` int(11) NOT NULL,
  `tid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `indexedfiles`
--

CREATE TABLE `indexedfiles` (
  `folid` int(11) NOT NULL,
  `filename` varchar(50) NOT NULL,
  `filid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `indexedfolders`
--

CREATE TABLE `indexedfolders` (
  `fid` int(11) NOT NULL,
  `fpath` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tag`
--

CREATE TABLE `tag` (
  `tid` int(11) NOT NULL,
  `cid` int(11) DEFAULT NULL,
  `tname` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tag`
--

INSERT INTO `tag` (`tid`, `cid`, `tname`) VALUES
(2001, 1002, 'Jazz'),
(2002, 1002, 'Hip-Hop'),
(2003, 1002, 'Electronic'),
(2004, 1002, 'Reggae'),
(2005, 1002, 'Classical'),
(2006, 1002, 'Rap'),
(2007, 1002, 'Country'),
(2008, 1002, 'Metal'),
(2009, 1002, 'Rock'),
(2010, 1002, 'Disco'),
(2011, 1002, 'Opera'),
(2012, 1002, 'Dance'),
(2013, 1003, 'Serif'),
(2014, 1003, 'Sans-Serif'),
(2015, 1003, 'Script'),
(2016, 1003, 'Decorative'),
(2017, 1004, '5-Stars'),
(2018, 1004, '4-Stars'),
(2019, 1004, '3-Stars'),
(2020, 1004, '2-Stars'),
(2021, 1004, '1-Star'),
(2022, 1005, 'done'),
(2023, 1005, 'next'),
(2024, 1005, 'maybe'),
(2025, 1005, 'waiting'),
(2026, 1006, 'high'),
(2027, 1006, 'medium'),
(2028, 1006, 'low');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `filetag`
--
ALTER TABLE `filetag`
  ADD KEY `filid` (`filid`),
  ADD KEY `tid` (`tid`);

--
-- Indexes for table `indexedfiles`
--
ALTER TABLE `indexedfiles`
  ADD PRIMARY KEY (`filid`),
  ADD KEY `folid` (`folid`);

--
-- Indexes for table `indexedfolders`
--
ALTER TABLE `indexedfolders`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`tid`),
  ADD KEY `cid` (`cid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `filetag`
--
ALTER TABLE `filetag`
  ADD CONSTRAINT `filetag_ibfk_1` FOREIGN KEY (`filid`) REFERENCES `indexedfiles` (`filid`) ON DELETE CASCADE,
  ADD CONSTRAINT `filetag_ibfk_2` FOREIGN KEY (`tid`) REFERENCES `tag` (`tid`) ON DELETE CASCADE;

--
-- Constraints for table `indexedfiles`
--
ALTER TABLE `indexedfiles`
  ADD CONSTRAINT `indexedfiles_ibfk_1` FOREIGN KEY (`folid`) REFERENCES `indexedfolders` (`fid`) ON DELETE CASCADE;

--
-- Constraints for table `tag`
--
ALTER TABLE `tag`
  ADD CONSTRAINT `tag_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `category` (`cid`) ON DELETE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
