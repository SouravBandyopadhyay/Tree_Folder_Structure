CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(20) NOT NULL,
  `parent` int DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci