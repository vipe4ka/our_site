-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: file_sharing
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `download_audit`
--

DROP TABLE IF EXISTS `download_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `download_audit` (
  `audit_id` int NOT NULL AUTO_INCREMENT,
  `file_id` int NOT NULL,
  `file_owner_id` int NOT NULL,
  `downloader_id` int NOT NULL,
  `download_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`),
  KEY `file_id` (`file_id`),
  KEY `file_owner_id` (`file_owner_id`),
  KEY `downloader_id` (`downloader_id`),
  CONSTRAINT `download_audit_ibfk_1` FOREIGN KEY (`file_id`) REFERENCES `files` (`file_id`),
  CONSTRAINT `download_audit_ibfk_2` FOREIGN KEY (`file_owner_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `download_audit_ibfk_3` FOREIGN KEY (`downloader_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `download_audit`
--

LOCK TABLES `download_audit` WRITE;
/*!40000 ALTER TABLE `download_audit` DISABLE KEYS */;
INSERT INTO `download_audit` VALUES (1,1,1,2,'2025-03-27 22:50:41'),(2,2,2,1,'2025-03-27 22:50:41'),(3,3,3,4,'2025-03-27 22:50:41'),(4,4,4,3,'2025-03-27 22:50:41'),(5,5,5,6,'2025-03-27 22:50:41'),(6,6,6,5,'2025-03-27 22:50:41'),(7,7,7,7,'2025-03-27 22:50:41');
/*!40000 ALTER TABLE `download_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_types`
--

DROP TABLE IF EXISTS `file_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_types` (
  `file_type_id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(50) NOT NULL,
  PRIMARY KEY (`file_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_types`
--

LOCK TABLES `file_types` WRITE;
/*!40000 ALTER TABLE `file_types` DISABLE KEYS */;
INSERT INTO `file_types` VALUES (1,'jpg'),(2,'pptx'),(3,'pdf'),(4,'txt'),(5,'mp4'),(6,'xlsx'),(7,'rar');
/*!40000 ALTER TABLE `file_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_type_id` int NOT NULL,
  `file_size` bigint NOT NULL,
  `owner_id` int NOT NULL,
  `file_path` varchar(512) NOT NULL,
  `upload_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  KEY `file_type_id` (`file_type_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`file_type_id`) REFERENCES `file_types` (`file_type_id`),
  CONSTRAINT `files_ibfk_2` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (1,'vacation_photo.jpg',1,2456789,1,'/uploads/1/vacation_photo.jpg','2025-03-27 22:50:41'),(2,'report.pdf',3,1234567,2,'/uploads/2/report.pdf','2025-03-27 22:50:41'),(3,'presentation.pptx',2,3456789,3,'/uploads/3/presentation.pptx','2025-03-27 22:50:41'),(4,'notes.txt',4,1024,4,'/uploads/4/notes.txt','2025-03-27 22:50:41'),(5,'budget.xlsx',6,2345678,5,'/uploads/5/budget.xlsx','2025-03-27 22:50:41'),(6,'movie.mp4',5,123456789,6,'/uploads/7/movie.mp4','2025-03-27 22:50:41'),(7,'project.rar',7,3456789,7,'/uploads/9/project.rar','2025-03-27 22:50:41');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `personal_pages_info`
--

DROP TABLE IF EXISTS `personal_pages_info`;
/*!50001 DROP VIEW IF EXISTS `personal_pages_info`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `personal_pages_info` AS SELECT 
 1 AS `user_id`,
 1 AS `nickname`,
 1 AS `registration_date`,
 1 AS `files_visibility`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `encrypted_password` varchar(255) NOT NULL,
  `registration_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `files_visibility` enum('public','private') DEFAULT 'public',
  `deletion_date` datetime DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `nickname` (`nickname`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'petrov_ivan','ivan@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','public',NULL),(2,'vasilyeva_anna','anna@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','private',NULL),(3,'ivanov_alex','alex@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','public',NULL),(4,'kotova_maria','maria@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','public',NULL),(5,'zel_ivan','david@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','private',NULL),(6,'belolga','olga@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','public',NULL),(7,'fedsergey','sergey@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-27 22:50:41','private',NULL),(8,'mih_mih','new_user@example.com','$2a$10$hashedpassword123','2025-03-27 22:50:42','public',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'file_sharing'
--

--
-- Dumping routines for database 'file_sharing'
--
/*!50003 DROP FUNCTION IF EXISTS `authenticate_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `authenticate_user`(
    p_nickname VARCHAR(50),
    p_password VARCHAR(255)) RETURNS tinyint(1)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users
        WHERE nickname = p_nickname 
        AND encrypted_password = p_password);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `check_trusted_source` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `check_trusted_source`(p_viewer_id INT, p_profile_user_id INT) RETURNS tinyint(1)
    READS SQL DATA
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM download_audit
        WHERE file_owner_id = p_profile_user_id
        AND downloader_id = p_viewer_id
    );
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `uni_nickname` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `uni_nickname`(
    p_nickname VARCHAR(50)) RETURNS tinyint(1)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM users
        WHERE nickname = p_nickname);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP FUNCTION IF EXISTS `user_exists_by_email` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `user_exists_by_email`(p_email VARCHAR(100)) RETURNS tinyint(1)
    READS SQL DATA
    DETERMINISTIC
BEGIN
    DECLARE user_count INT;
    
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE email = p_email;
    
    RETURN user_count > 0;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_new_user` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `add_new_user`(
    IN p_nickname VARCHAR(50),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE user_count INT;
    -- Проверка на существование пользователя с таким же nickname или email
    SELECT COUNT(*) INTO user_count
    FROM users
    WHERE nickname = p_nickname OR email = p_email;
    
    IF user_count > 0 THEN
        -- Пользователь уже существует
        SELECT 'Error: User with this nickname or email already exists' AS message;
    ELSE
        -- Добавление нового пользователя
        INSERT INTO users (nickname, email, encrypted_password, registration_date, files_visibility)
        VALUES (p_nickname, p_email, p_password, CURRENT_TIMESTAMP, 'public');
        -- Возвращаем информацию о добавленном пользователе
        SELECT 'User successfully added' AS message, user_id, nickname, email, registration_date
        FROM users
        WHERE user_id = LAST_INSERT_ID();
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `personal_pages_info`
--

/*!50001 DROP VIEW IF EXISTS `personal_pages_info`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `personal_pages_info` AS select `users`.`user_id` AS `user_id`,`users`.`nickname` AS `nickname`,`users`.`registration_date` AS `registration_date`,`users`.`files_visibility` AS `files_visibility` from `users` group by `users`.`user_id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 22:54:53
