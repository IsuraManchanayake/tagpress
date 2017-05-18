DROP DATABASE TAGPRESS;
CREATE DATABASE TAGPRESS;
USE TAGPRESS;

CREATE TABLE `category` (
    cid INT NOT NULL AUTO_INCREMENT,
    cname VARCHAR(20) NOT NULL UNIQUE,
    color VARCHAR(20),
    PRIMARY KEY(cid)
);

CREATE TABLE `tag` (
    tid INT NOT NULL AUTO_INCREMENT,
    cid INT,
    tname VARCHAR(20) NOT NULL,
    PRIMARY KEY(tid),
    FOREIGN KEY(cid) REFERENCES category(cid) ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE `tag` ADD UNIQUE (cid, tname);

CREATE TABLE `indexedfolders` (
    folid INT NOT NULL AUTO_INCREMENT,
    fpath VARCHAR(500) NOT NULL UNIQUE,
    PRIMARY KEY(folid)
);

CREATE TABLE `indexedfiles` (
  `folid` INT(11) NOT NULL,
  `filename` varchar(100) NOT NULL,
  `filid` INT(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY(filid),
  FOREIGN KEY(folid) REFERENCES indexedfolders(folid) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `filetag` (
  `filid` INT(11) NOT NULL,
  `tid` INT(11) NOT NULL,
  FOREIGN KEY(filid) REFERENCES indexedfiles(filid) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(tid) REFERENCES tag(tid) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `filetag` ADD UNIQUE (filid, tid);

INSERT INTO `category` (`cid`, `cname`, `color`) VALUES
    (1001, 'default', 'green'),
    (1002, 'music', 'darkcyan'),
    (1003, 'font', 'darkmagenta'), 
    (1004, 'rating', 'gold'),
    (1005, 'date', 'indianred'),
    (1006, 'current-state', 'orangered'),
    (1007, 'priority', 'red')
;

INSERT INTO `tag` (`tid`, `cid`, `tname`) VALUES
    (2001, 1002, 'Jazz'),
    (2002, 1002, 'Pop'),
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
    (2013, 1002, 'Indie'),
    (2014, 1003, 'Serif'),
    (2015, 1003, 'Sans-Serif'),    
    (2016, 1003, 'Script'),
    (2017, 1003, 'Decorative'),    
    (2018, 1004, '5-Stars'),
    (2019, 1004, '4-Stars'),    
    (2020, 1004, '3-Stars'),
    (2021, 1004, '2-Stars'),
    (2022, 1004, '1-Star'),
    (2023, 1006, 'done'),
    (2024, 1006, 'next'),
    (2025, 1006, 'maybe'),
    (2026, 1006, 'waiting'),
    (2027, 1007, 'high'),
    (2028, 1007, 'medium'),
    (2029, 1007, 'low')
;
