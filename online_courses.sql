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
  `CourseName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `TinyDes` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `FullDes` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Price` int(11) NOT NULL,
  `PricePromotion` int(11),
  `CatID` int(11) NOT NULL,
  PRIMARY KEY (`CourseID`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci;

-- ----------------------------
-- Table structure for courses
-- ----------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses`  (
  `CourseID` int(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `CatID` int(11) NOT NULL,
  `CourseName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `TinyDes` varchar(100) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `FullDes` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Price` int(11) NOT NULL,
  `PricePromotion` int(11),
  `LastUpdate` date NOT NULL,
  `Active` boolean NOT NULL,
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
  `ChapterName` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
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
  `Comment` varchar(100),
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