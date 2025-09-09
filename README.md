# StocksManager_2025
This is the problem statement / project details:

Stock Manager
Project Overview
Stock Manager is a robust Java-based application developed to efficiently manage stock inventories and customer data within a simplified interface. The system provides core functionalities such as adding, updating, and removing stocks, handling customer information, and facilitating stock transactions including purchases and sales. Designed with maintainability and scalability in mind, Stock Manager leverages Oracle database integration for persistent data storage, ensuring data integrity across sessions.

Key Features

Stock Management
Add New Stock: Users can add new stocks by specifying key details such as the stock name, symbol, price, and quantity. Remove Stock: Enables the deletion of stock entries based on their unique symbol. Update Stock: Allows modification of existing stock records, including changes to stock price and available quantity. Retrieve Stock: Retrieves existing stock records

Customer Management
Add New Customer: Users can register new customers by entering details such as name, customer ID, and email address. Remove Customer: Provides functionality to delete a customer profile using their unique customer ID. Update Customer: Allows modification of existing customer records. Retrieve Customer: Retrieves existing customer records

Stock Transactions
Purchase Stocks: Customers can buy stocks from the system. The purchase updates the stock quantity in the inventory and logs the transaction in the customer’s history.

Sell Stocks: Allows customers to sell previously purchased stocks. The transaction adjusts the stock quantity accordingly and records the sale in the customer's history.

Data Persistence
Database Integration:

The application employs Oracle database tables for persistent storage of stock and customer information.

Technologies Used Programming Language: Java version 21, Java EE 7 Platform, Spring Boot 5, Apache Tomcat 10

Database: Oracle Version 23

Architecture: Object-Oriented Design

Your application should be able to generate the following reports (OPTIONAL)

List of customers, stocks details and their total assets including the txn type
List the customer whose asset value is the maximum
List the customer whose asset value is the minimum
List the stock name which has been transacted more number of times
List the stock name which has been transacted less number of times
List the stock name whose price is the highest
List all the stock details
List all the customer details
List all the txn details 10.List which txn is more (sell or buy) 11.Display total assests of all customers
100.0%
Footer
