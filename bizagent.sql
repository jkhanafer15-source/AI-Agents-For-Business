-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 18, 2026 at 03:25 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bizagent`
--

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `business_type` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `products_services` text DEFAULT NULL,
  `target_customers` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `goals` text DEFAULT NULL,
  `problems` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `company_name`, `business_type`, `description`, `products_services`, `target_customers`, `location`, `goals`, `problems`, `created_at`, `user_id`) VALUES
(6, 'TechStore', 'Electronics Retail', 'An electronics retailer selling consumer technology products.', 'Laptops, smartphones, headphones and accessories', 'Students, professionals and technology enthusiasts', 'Lebanon', 'Increase revenue, grow the customer base and improve product sales', 'Some products have low sales and customer retention needs improvement', '2026-09-15 15:45:31', 1),
(7, 'TechNova Solutions', 'Technology', 'A technology company providing software and digital solutions for businesses.', 'Web development, mobile applications, AI solutions, and business software', 'Small and medium-sized businesses', 'Lebanon', 'Increase revenue, acquire more customers, and expand digital services', 'Customer churn, inconsistent sales growth, and marketing efficiency', '2026-09-15 19:31:54', 2);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `sentiment` varchar(50) NOT NULL,
  `joined_date` date NOT NULL,
  `left_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `company_id`, `customer_name`, `status`, `sentiment`, `joined_date`, `left_date`) VALUES
(11, 6, 'Customer 1', 'active', 'positive', '2026-01-05', NULL),
(12, 6, 'Customer 2', 'active', 'positive', '2026-01-12', NULL),
(13, 6, 'Customer 3', 'active', 'neutral', '2026-01-20', NULL),
(14, 6, 'Customer 4', 'churned', 'negative', '2026-01-25', '2026-03-10'),
(15, 6, 'Customer 5', 'active', 'positive', '2026-02-03', NULL),
(16, 6, 'Customer 6', 'active', 'positive', '2026-02-14', NULL),
(17, 6, 'Customer 7', 'churned', 'negative', '2026-02-20', '2026-03-15'),
(18, 6, 'Customer 8', 'active', 'neutral', '2026-03-02', NULL),
(19, 6, 'Customer 9', 'active', 'positive', '2026-03-08', NULL),
(20, 6, 'Customer 10', 'active', 'positive', '2026-03-15', NULL),
(21, 7, 'Ahmad Hassan', 'active', 'positive', '2026-01-10', NULL),
(22, 7, 'Sara Ali', 'active', 'positive', '2026-01-18', NULL),
(23, 7, 'Mohammad Khalil', 'active', 'neutral', '2026-02-05', NULL),
(24, 7, 'Lina Saad', 'churned', 'negative', '2026-02-12', '2026-06-20'),
(25, 7, 'Omar Hamdan', 'active', 'positive', '2026-03-03', NULL),
(26, 7, 'Maya Nasser', 'active', 'positive', '2026-03-19', NULL),
(27, 7, 'Karim Daher', 'churned', 'negative', '2026-04-07', '2026-07-15'),
(28, 7, 'Rana Abbas', 'active', 'neutral', '2026-04-21', NULL),
(29, 7, 'Ali Mansour', 'active', 'positive', '2026-05-11', NULL),
(30, 7, 'Nour Khoury', 'active', 'positive', '2026-05-27', NULL),
(31, 7, 'Hassan Saleh', 'active', 'neutral', '2026-06-14', NULL),
(32, 7, 'Diana Farah', 'active', 'positive', '2026-07-02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `marketing_campaigns`
--

CREATE TABLE `marketing_campaigns` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `campaign_name` varchar(255) NOT NULL,
  `spend` decimal(10,2) NOT NULL,
  `leads` int(11) NOT NULL,
  `conversions` int(11) NOT NULL,
  `revenue` decimal(10,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `marketing_campaigns`
--

INSERT INTO `marketing_campaigns` (`id`, `company_id`, `campaign_name`, `spend`, `leads`, `conversions`, `revenue`, `start_date`, `end_date`) VALUES
(1, 7, 'Social Media Campaign', 1200.00, 180, 35, 4500.00, '2026-01-01', '2026-01-31'),
(2, 7, 'Google Ads Campaign', 1800.00, 240, 52, 7200.00, '2026-02-01', '2026-02-28'),
(3, 7, 'Email Marketing', 600.00, 150, 42, 3800.00, '2026-03-01', '2026-03-31'),
(4, 7, 'AI Solutions Promotion', 2200.00, 300, 68, 10500.00, '2026-04-01', '2026-04-30'),
(5, 7, 'Summer Digital Campaign', 1600.00, 260, 57, 8200.00, '2026-05-01', '2026-05-31'),
(6, 7, 'Business Software Campaign', 2000.00, 320, 75, 12000.00, '2026-06-01', '2026-06-30');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender` varchar(50) NOT NULL,
  `text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `sender`, `text`, `created_at`, `user_id`) VALUES
(12, 'user', 'How can AI help my business?', '2026-09-18 12:05:43', 2),
(13, 'ai', 'As your BizAgent AI, I can help your business in numerous ways. Here are some practical examples:\n\n1. **Sales**: I can assist with lead generation, email marketing, and personalized sales outreach. My AI-powered chatbots can engage with potential customers, answer questions, and qualify leads.\n\n2. **Marketing**: I can help with content creation, social media management, and campaign optimization. My AI can analyze market trends, suggest relevant content, and even create content for you.\n\n3. **Customer Service**: I can provide 24/7 customer support through AI-powered chatbots, helping to reduce response times and improve customer satisfaction. My AI can also analyze customer feedback and sentiment to identify areas for improvement.\n\n4. **Product Development**: I can assist with product research, market analysis, and product recommendation. My AI can also help with product development, including product design, prototyping, and testing.\n\n5. **Business Strategy**: I can analyze your business data and provide insights to inform strategic decisions. My AI can help identify areas for growth, optimize operations, and suggest new business opportunities.\n\n6. **Business Performance**: I can track key performance indicators (KPIs) and provide data-driven insights to help you optimize your business performance. My AI can also help with forecasting, budgeting, and financial planning.\n\n7. **Automation**: I can automate routine tasks, such as data entry, bookkeeping, and email management, freeing up your time to focus on high-priority tasks.\n\n8. **Competitor Analysis**: I can analyze your competitors\' strengths, weaknesses, and market strategies, helping you stay ahead of the competition.\n\n9. **Influencer Identification**: I can identify potential influencers and brands to collaborate with, helping you expand your reach and build brand awareness.\n\n10. **Predictive Analytics**: I can use machine learning algorithms to predict customer behavior, sales trends, and market shifts, helping you make informed business decisions.\n\nThese are just a few examples of how I, your BizAgent AI, can help your business. What specific challenge or area of your business would you like to tackle first?', '2026-09-18 12:05:57', 2);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `sale_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `company_id`, `product_name`, `quantity`, `unit_price`, `sale_date`) VALUES
(19, 6, 'Product A', 10, 50.00, '2026-01-10'),
(20, 6, 'Product B', 5, 80.00, '2026-01-15'),
(21, 6, 'Product C', 8, 40.00, '2026-01-20'),
(22, 6, 'Product A', 15, 50.00, '2026-02-05'),
(23, 6, 'Product B', 7, 80.00, '2026-02-12'),
(24, 6, 'Product C', 6, 40.00, '2026-02-20'),
(25, 6, 'Product A', 20, 50.00, '2026-03-04'),
(26, 6, 'Product B', 10, 80.00, '2026-03-13'),
(27, 6, 'Product C', 5, 40.00, '2026-03-22'),
(44, 7, 'Website Development', 2, 1500.00, '2026-01-10'),
(45, 7, 'AI Business Solution', 1, 3000.00, '2026-01-20'),
(46, 7, 'Website Development', 3, 1500.00, '2026-02-08'),
(47, 7, 'Mobile Application', 1, 2500.00, '2026-02-18'),
(48, 7, 'AI Business Solution', 2, 3000.00, '2026-03-05'),
(49, 7, 'Website Development', 2, 1500.00, '2026-03-22'),
(50, 7, 'Mobile Application', 2, 2500.00, '2026-04-11'),
(51, 7, 'Website Development', 4, 1500.00, '2026-04-25'),
(52, 7, 'AI Business Solution', 3, 3000.00, '2026-05-09'),
(53, 7, 'Mobile Application', 2, 2500.00, '2026-05-21'),
(54, 7, 'Website Development', 5, 1500.00, '2026-06-06'),
(55, 7, 'AI Business Solution', 3, 3000.00, '2026-06-19'),
(56, 7, 'Mobile Application', 4, 2500.00, '2026-07-07'),
(57, 7, 'AI Business Solution', 4, 3000.00, '2026-07-23'),
(58, 7, 'Website Development', 6, 1500.00, '2026-08-05'),
(59, 7, 'Mobile Application', 5, 2500.00, '2026-08-20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'j', 'j@example.com', '$2b$10$crC/UiVQwOCXPdwZW5szOOeBfaN.W.wT8MVE0ArjkF68e4mxhg2Na', '2026-09-15 12:12:55'),
(2, 'j', 'ja@example.com', '$2b$10$Kzee8M2sylDQmtjCJ5nwg./SoX2Qrzt.hjZGVVwQCcB6/O0CiDJrO', '2026-09-15 19:16:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_company_name` (`company_name`),
  ADD KEY `fk_company_user` (`user_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `marketing_campaigns`
--
ALTER TABLE `marketing_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_messages_user` (`user_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `marketing_campaigns`
--
ALTER TABLE `marketing_campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `fk_company_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketing_campaigns`
--
ALTER TABLE `marketing_campaigns`
  ADD CONSTRAINT `marketing_campaigns_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `fk_messages_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
