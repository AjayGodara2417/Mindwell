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
│   ├── (main_pages)/
│   ├── dashboard/
│   ├── stats/          
│   ├── profile/
│   ├── settings/
│   ├── planner/
│   ├── face-diary/
│   ├── resources/
│   ├── doctors/
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
│
├── components/
├── lib/                ← DB connection & helpers
├── types/              ← TypeScript types
```

---

## 🗄️ **Database Design (MySQL)**

### 📌 `users`

```sql
id
email
password
role (patient/doctor)
created_at
```

---

### 📌 `assessments`

```sql
id
patient_email
score
severity
created_at
```

---

### 📌 `sleep`

```sql
id
email
hours
created_at
```

---

### 📌 `doctor_patient`

```sql
id
doctor_email
patient_email
```

---

## 📊 **Charts Implementation**

Library: `recharts`

### Key Fix Applied:

* Use `toISOString()` for unique X-axis values
* Prevents tooltip mismatch

```ts
date: new Date(created_at).toISOString()
```

---

## 🎨 **UI/UX Design Principles**

* Card-based layout
* Clean spacing (`p-6`, `rounded-2xl`)
* Soft shadows (`shadow-lg`)
* Responsive design
* Focus states for inputs
* Minimal + modern dashboard style

---

## ⚙️ **Setup Instructions**

---

### 1️⃣ Install Dependencies

```bash
git clone
```
 After Installation

```bash
npm install
```

---

### 2️⃣ Configure Environment

`.env.local`

```env
NEXT_PUBLIC_ML_API_URL=http://localhost:5000
JWT_SECRET=

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mental_health
```

---

### 3️⃣ Run Development Server

```bash
npm run dev
```

---

### 4️⃣ Open App

```
http://localhost:3000
```

---

## 🔐 **Authentication Flow**

1. User logs in
2. JWT stored in `localStorage`
3. Token sent in headers:

```ts
Authorization: Bearer <token>
```

4. Backend verifies token

---

## 📈 **Future Improvements**

### 🚀 High Impact Features

* AI-based mental health insights
* Sleep vs stress correlation
* Weekly analytics dashboard
* Notifications/reminders
* Dark mode

---

### 📊 Advanced Analytics

* Average score trends
* Risk detection system
* Doctor alerts

---

## 🧑‍💻 **Author**

**Ajay Godara**
Full stack web Developer (Next.js + Tailwind + MySQL)

