# 📦 Stock Manager

## 📌 Description
Stock Manager is a full-stack web application designed to manage stocks and customers efficiently.  
It provides functionalities to add, update, and remove stocks, manage customer information, and handle stock transactions such as buying and selling.  

The backend is powered by **Spring Boot REST APIs** with **Spring Data JPA** for Oracle database integration, while the frontend is built using **Angular** for an interactive user experience.

---

## 🚀 Features

### 🔹 Stock Management
- **Add Stock** – Add new stocks with details such as name, symbol, price, and quantity.  
- **Remove Stock** – Remove stocks from the system using their symbol.  
- **Update Stock** – Update stock details (price, quantity).  

### 🔹 Customer Management
- **Add Customer** – Add new customers with name, ID, and email.  
- **Remove Customer** – Remove customers by ID.  

### 🔹 Stock Transactions
- **Purchase Stocks** – Customers can purchase available stocks. Updates stock quantity and maintains purchase history.  
- **Sell Stocks** – Customers can sell their owned stocks. Updates stock quantity and maintains sale history.  

### 🔹 Persistence
- Data is stored in **Oracle Database tables**.  
- **Spring Data JPA** (with Hibernate) handles database operations.  

---

## 🛠️ Tech Stack
- **Backend**: Spring Boot (REST APIs, Spring Data JPA, Hibernate)  
- **Frontend**: Angular  
- **Database**: Oracle DB  
- **Build Tools**: Maven / Gradle  
- **Version Control**: GitHub  

---

## ⚙️ Project Structure
