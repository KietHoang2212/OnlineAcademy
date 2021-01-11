SET NAMES utf8;
#SET FOREIGN_KEY_CHECKS = 0;


-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories`  (
  `CatID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `CatName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `CatParentID` int(11) UNSIGNED,
  PRIMARY KEY (`CatID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 3 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students`  (
  `s_ID` int(11) NOT NULL AUTO_INCREMENT,
  `s_Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `s_Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `s_Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `s_Email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `s_DOB` date NOT NULL,
  PRIMARY KEY (`s_ID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for lecturers
-- ----------------------------
DROP TABLE IF EXISTS `lecturers`;
CREATE TABLE `lecturers`  (
  `l_ID` int(11) NOT NULL AUTO_INCREMENT,
  `l_Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `l_Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `l_Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `l_Email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `l_Occupation` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `l_Description` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL, 
  `l_DOB` date NOT NULL,
  PRIMARY KEY (`l_ID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for admins
-- ----------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`  (
  `a_ID` int(11) NOT NULL AUTO_INCREMENT,
  `a_Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `a_Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `a_Name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `a_Email` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `a_DOB` date NOT NULL,
  PRIMARY KEY (`a_ID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;



-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `CourseID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `CatID` int(11) NOT NULL,
  `CourseName` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `TinyDes` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `FullDes` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Price` int(11) NOT NULL,
  `PricePromotion` int(11),
  `LastUpdate` date NOT NULL,
  `Active` boolean NOT NULL,
  `NumberSeen` int(11) unsigned not null,
  PRIMARY KEY (`CourseID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for chapters
-- ----------------------------
DROP TABLE IF EXISTS `chapters`;
CREATE TABLE `chapters`  (
  `ChapterID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `CourseID` int(11) NOT NULL,
  `ChapterNo` int(11) NOT NULL,
  `ChapterName` varchar(150) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`ChapterID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;


-- ----------------------------
-- Table structure for enrolls
-- ----------------------------
DROP TABLE IF EXISTS `enrolls`;
CREATE TABLE `enrolls`  (
  `EnrollID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `EnrollDate` datetime(0) NOT NULL,
  `s_ID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL,
  `Rate` int,
  `Comment` varchar(255),
  PRIMARY KEY (`EnrollID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for oncourse
-- ----------------------------
DROP TABLE IF EXISTS `oncourse`;
CREATE TABLE `oncourse`  (
  `OnCourseID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `l_ID` int(11) NOT NULL,
  `CourseID` int(11) NOT NULL,
  PRIMARY KEY (`OnCourseID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for enrollrdetails
-- ----------------------------
DROP TABLE IF EXISTS `enrolldetails`;
CREATE TABLE `enrolldetails`  (
  `ID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `s_ID` int(11) NOT NULL,
  `ChapterID` int(11) NOT NULL,
  `Time` int(11) NOT NULL,
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;




#SET FOREIGN_KEY_CHECKS = 1;


ALTER TABLE categories ADD CONSTRAINT fk_categories_categories FOREIGN KEY (CatParentID) REFERENCES categories(CatID);
ALTER TABLE courses ADD CONSTRAINT fk_courses_categories FOREIGN KEY (CatID) REFERENCES categories(CatID);
ALTER TABLE chapters ADD CONSTRAINT fk_chapters_courses FOREIGN KEY (CourseID) REFERENCES courses(CourseID);
ALTER TABLE enrolls ADD CONSTRAINT fk_enrolls_courses FOREIGN KEY (CourseID) REFERENCES courses(CourseID);
ALTER TABLE enrolls ADD CONSTRAINT fk_enrolls_students FOREIGN KEY (s_ID) REFERENCES students(s_ID);
ALTER TABLE enrolldetails ADD CONSTRAINT fk_enrolldetails_chapters FOREIGN KEY (ChapterID) REFERENCES chapters(ChapterID);
ALTER TABLE enrolldetails ADD CONSTRAINT fk_enrolldetails_students FOREIGN KEY (s_ID) REFERENCES students(s_ID);
ALTER TABLE oncourse ADD CONSTRAINT fk_oncourse_courses FOREIGN KEY (CourseID) REFERENCES courses(CourseID);
ALTER TABLE oncourse ADD CONSTRAINT fk_oncourse_lecturers FOREIGN KEY (l_ID) REFERENCES lecturers(l_ID);


-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` VALUES (1, 'IT', NULL), (2, 'Web', 1), (3, 'Mobile', 1);
COMMIT;

INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'The Web Developer Bootcamp 2020', 'JUST COMPLETELY REDONE - The only course you need to learn web development - HTML, CSS, JS, Node, and More!', 'None', '100000', '2021/01/01', '0', '200');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `PricePromotion`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('3', 'Appium -Mobile Automation Testing from Scratch + Frameworks', 'Appium -Top class 200 +Lectures on Mobile Automation from basics to Framework level with real time examples', 'None', '50000', '45000', '2021/01/05', '1', '234');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('3', 'Mobile App Marketing 2021: ASO, Advertising & Monetization', 'Create a great mobile app business! Get 1,000,000+ downloads with app store optimization ASO (SEO) & strong monetization', 'None', '99000', '2020/11/11', '0', '100');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `PricePromotion`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('3', 'Running a Mobile App Dev Business: The Complete Guide', 'Learn how to start and grow a mobile app development business. Get up & running in less than 1 week.', 'None', '10000', '1000', '2020/12/01', '1', '204');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('3', 'UI/UX design with Adobe XD: Design & Prototype a Mobile App', 'Learn how to design a beautiful and engaging mobile app with Adobe Experience Design (XD). Learn-by-doing approach.', 'None', '75000', '2020/06/01', '1', '16');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('3', 'Mobile Penetration Testing of Android Applications', 'Computer security is no more about PCs. Is your TV, fridge and mobile phone. Learn to audit mobile apps!', 'None', '80000', '2020/12/22', '1', '17');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'The Complete Front-End Web Development Course!', 'Get started as a front-end web developer using HTML, CSS, JavaScript, jQuery, and Bootstrap!', 'None', '20000', '2020/11/01', '1', '22');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'Web Design for Beginners: Real World Coding in HTML & CSS', 'Launch a career as a web designer by learning HTML5, CSS3, responsive design, Sass and more!', 'None', '17000', '2021/01/05', '0', '12');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'Beginner Full Stack Web Development: HTML, CSS, React & Node', 'Learn web development with HTML, CSS, Bootstrap 4, ES6 React and Node', 'None', '32000', '2020/04/12', '0', '99');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'The Complete 2020 Web Development Course - Build 15 Projects', 'The only course you need to become a full-stack web developer. Covers HTML5, CSS3, JS, ES6, Node, APIs, Mobile & more!', 'None', '89000', '2020/12/03', '0', '500');
INSERT INTO `online_courses`.`courses` (`CatID`, `CourseName`, `TinyDes`, `FullDes`, `Price`, `LastUpdate`, `Active`, `NumberSeen`) VALUES ('2', 'The Complete Web Developer in 2021: Zero to Mastery', 'Learn to code and become a Web Developer in 2021 with HTML, CSS, Javascript, React, Node.js, Machine Learning & more!', 'None', '21000', '2020/11/30', '0', '123');



INSERT INTO `online_courses`.`students` (`s_Username`, `s_Password`, `s_Name`, `s_Email`, `s_DOB`) VALUES ('anhkiet', 'anhkiet', 'Hoang Anh Kiet', 'anhkiet@gmail.com', '1999/12/22');
INSERT INTO `online_courses`.`students` (`s_Username`, `s_Password`, `s_Name`, `s_Email`, `s_DOB`) VALUES ('quangkhanh', 'quangkhanh', 'Duong Hoang Quang Khanh', 'quangkhanh@gmail.com', '1999/11/11');
INSERT INTO `online_courses`.`students` (`s_Username`, `s_Password`, `s_Name`, `s_Email`, `s_DOB`) VALUES ('conghuy', 'conghuy', 'Nguyen Tran Cong Huy', 'conghuy@gmail.com', '1999/02/28');


INSERT INTO `online_courses`.`lecturers` (`l_Username`, `l_Password`, `l_Name`, `l_Email`, `l_DOB`,`l_Occupation`,`l_Description`) VALUES ('nth', 'nth', 'NTH', 'nth@gmail.com', '1951/01/01', 'gamer','');
INSERT INTO `online_courses`.`lecturers` (`l_Username`, `l_Password`, `l_Name`, `l_Email`, `l_DOB`,`l_Occupation`,`l_Description`) VALUES ('mourinho', 'mourinho', 'Jose Mourinho', 'JM@gmail.com', '1963/01/26','gamer','');


INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`, `Comment`) VALUES ('2021/01/05', '1', '1', '5', 'Good');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`, `Comment`) VALUES ('2020/01/05', '1', '2', '4', 'Very good!!!');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '1', '3', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '1', '4', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '1', '5', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '1', '6', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '1', '7', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '1', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '5', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '6', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '7', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '8', '3');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '2', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '4', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '2', '3', '3');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '1', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '2', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '3', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '4', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '5', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '6', '4');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '7', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '8', '5');
INSERT INTO `online_courses`.`enrolls` (`EnrollDate`, `s_ID`, `CourseID`, `Rate`) VALUES ('2020/01/05', '3', '9', '5');


INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '1');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('2', '2');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('2', '3');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '4');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '5');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('2', '6');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '7');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('2', '8');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('2', '9');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '10');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '11');
INSERT INTO `online_courses`.`oncourse` (`l_ID`, `CourseID`) VALUES ('1', '2');

INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('1','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('1','2', 'Conclusion');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('2','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('3','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('4','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('5','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('6','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('7','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('8','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('9','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('10','1', 'Introduction');
INSERT INTO `online_courses`.`chapters` (`CourseID`, `ChapterNO`, `ChapterName`) VALUES('11','1', 'Introduction');



