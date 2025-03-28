-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: file_sharing
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `download_audit`
--

LOCK TABLES `download_audit` WRITE;
/*!40000 ALTER TABLE `download_audit` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_types`
--

LOCK TABLES `file_types` WRITE;
/*!40000 ALTER TABLE `file_types` DISABLE KEYS */;
INSERT INTO `file_types` VALUES (1,'Picture'),(2,'Microsoft Office'),(3,'PDF'),(4,'TXT'),(5,'Audio'),(6,'Video'),(7,'Archive'),(8,'Executable'),(9,'Other');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
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
INSERT INTO `users` VALUES (1,'petrov_ivan','ivan@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','public',NULL),(2,'vasilyeva_anna','anna@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','private',NULL),(3,'ivanov_alex','alex@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','public',NULL),(4,'kotova_maria','maria@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','public',NULL),(5,'zel_ivan','david@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','private',NULL),(6,'belolga','olga@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','public',NULL),(7,'fedsergey','sergey@example.com','$2a$10$xJwL5v5zJz6Z6Z6Z6Z6Z6e','2025-03-28 12:52:59','private',NULL),(8,'mih_mih','new_user@example.com','$2a$10$hashedpassword123','2025-03-28 12:52:59','public',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

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

-- Dump completed on 2025-03-28 12:56:53
