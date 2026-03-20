# 📘 **Mental Health Tracking Web App – Documentation**


## 🧠 **Overview**

This is a full-stack mental health tracking platform built using:

* **Next.js 14 (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **MySQL (custom API, no ORM)**

The platform allows:

* Patients to take mental health assessments
* Track trends over time
* Log sleep data
* Doctors to monitor patient progress

---

## 🚀 **Features**

### 👤 Authentication

* Patient & Doctor signup/login
* JWT-based authentication
* Role-based access

---

### 🧑‍⚕️ Patient Features

* Take mental health assessments
* View:

  * Latest result
  * Trend charts

* Sleep tracking system
* Profile management

---

### 🩺 Doctor Features

* View linked patients
* Access patient assessment history
* Dashboard with charts

---

### 📊 Stats Page

* Mental health trend (line chart)
* Sleep tracker (input + chart)
* Latest score card
* Real-time database sync

---

## 🏗️ **Project Structure**

```
src/
│
├── app/
│   ├── (doctor)/
│   ├── doctor-dashboard/
│   ├── patient/
│   ├── patient/[email]          
│   ├── doctorSettings/
│   ├── layout.tsx
│   │
│   ├── (main_pages)/
│   ├── dashboard/
│   ├── stats/          
│   ├── profile/
│   ├── settings/
│   ├── planner/
│   ├── face-diary/
│   ├── resources/
│   ├── doctors/
│   ├── layout.tsx
│   │
│   ├── api/
│   │   ├── assessment/
│   │   ├── sleep/
│   │   ├── login/
│   │   ├── signup/
│   │   ├── profile/
│   │   ├── change-password/
│   │   ├── link-doctor/
│   │   ├── doctor-patients/
│   │
│   ├── login/
│   ├── signup
│   ├── layout.tsx
│   ├── page.tsx
│
├── components/
├── lib/                ← DB connection & helpers
│    ├── db.ts/
├── types/              ← TypeScript types
│    ├── assessment.ts/
│    ├── user.ts/
```

---

## 🗄️ **Database Design (MySQL)**

### 📌 `database`

```sql
CREATE DATABASE mindwell;
USE mindwell;
```

### 📌 `doctors`

```sql
CREATE TABLE doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  doctor_id VARCHAR(50) UNIQUE NOT NULL,
  speciality VARCHAR(255),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📌 `patient`

```sql
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  symptoms TEXT,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  linked_doctor_id VARCHAR(255),
  points INT DEFAULT 0,
  tasks_completed INT DEFAULT 0
);
```

### 📌 `assessments`

```sql
CREATE TABLE assessments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_email VARCHAR(255),
  score INT,
  percentage FLOAT,
  severity VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📌 `planner tasks`

```sql
CREATE TABLE planner_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_email VARCHAR(255),
  text TEXT,
  type ENUM('daily','weekly','monthly'),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

### 📌 `mood logs`

```sql
CREATE TABLE mood_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  mood_points INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 📌 `sleep logs`

```sql
CREATE TABLE sleep_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  hours INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📊 **Charts Implementation**

Library: `recharts`

```bash
npm i recharts
```

## 🎨 **UI/UX Design Principles**

* Card-based layout
* Clean spacing (`p-6`, `rounded-2xl`)
* Soft shadows (`shadow-lg`)
* Responsive design
* Focus states for inputs
* Minimal + modern dashboard style

---

## ⚙️ **Setup Instructions**

### 1️⃣ Install Dependencies

```bash
fork this repository
```

```bash
git clone 'forked repository link'
```

After Installation, enter the directory and run:

```bash
npm install
```

### 2️⃣ Run the app

```bash
npm run dev
```

---

### 3️⃣ Configure Environment
Create an environment variable file:

`.env.local`
Add the following to the file

```bash
NEXT_PUBLIC_ML_API_URL=http://localhost:5000
JWT_SECRET= your_secret_key

DB_HOST= localhost
DB_USER= root
DB_PASSWORD= your_password
DB_NAME= mental_health
```

### 4️⃣ Run Development Server

```bash
npm run dev
```

### 5️⃣ Open App

Open in web:
```bash
http://localhost:3000
```

## 🔐 **Authentication Flow**

1. User logs in
2. JWT stored in `localStorage`
3. Token sent in headers

```ts
Authorization: Bearer <token>
```

Backend verifies token


## 📈 **Future Improvements**

### 🚀 High Impact Features

* AI-based mental health insights
* Sleep vs stress correlation
* Weekly analytics dashboard
* Notifications/reminders
* Dark mode


### 📊 Advanced Analytics

* Average score trends
* Risk detection system
* Doctor alerts


## 🧑‍💻 **Author**

**Ajay Godara**
Full stack web Developer (Next.js + Tailwind + MySQL)