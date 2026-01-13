# Give & Get

> Welcome to the Give & Get project!
>
> *Empowering people to give, grow, and get inspired.*

---

## Overview
Give & Get is a web platform for sharing talents, learning new skills, and connecting people through smart matching and real-time chat. The project is built with modern technologies and a modular architecture for scalability and maintainability.

---

### ✨ See it in Action
<p align="center">
  <img src="https://github.com/user-attachments/assets/777e8e5d-b2c6-4ca5-b9fc-c4907dcffbe2" width="500" alt="Give & Get Project Demo">
</p>

---

## Features
- **Talent Exchange:** Offer your talents and request to learn new ones. Each user can define offered and wanted skills, including sub-talents.
- **Smart Matching:** Automatic matching between users based on their skills and interests using a custom algorithm.
- **Profile Management:** Register, login, edit your profile, upload a profile picture, and manage your talents.
- **Real-Time Chat:** Chat with matched users using SignalR-based messaging.
- **Transaction Management:** Track the status of talent exchanges and manage deals.
- **Comments & Feedback:** Leave comments and feedback to foster a supportive community.
- **Talent Requests:** Request new talents to be added. Requests are sent to the admin via email for approval.
- **Inspiration API:** Get motivational quotes translated to Hebrew.
- **Scoring System:** User scores are updated based on activity.
- **Admin Panel:** Admin can manage users, talents, and requests.

---

## Technologies Used

| Frontend | Backend | Database | Real-Time | Email |
|:---:|:---:|:---:|:---:|:---:|
| ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) <br> ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) <br> ![Material-UI](https://img.shields.io/badge/MUI-007FFF?style=for-the-badge&logo=mui&logoColor=white) <br> ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white) | ![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=for-the-badge&logo=.net&logoColor=white) <br> ![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white) <br> Entity Framework | ![SQL Server](https://img.shields.io/badge/SQL_Server-CC2927?style=for-the-badge&logo=microsoft-sql-server&logoColor=white) | SignalR | MailKit |

---

## Project Structure
- `client/Give-Get-client/` – React + TypeScript frontend
- `server/GiveAndGet-server/` – ASP.NET Core backend (Web API, Services, Repositories, Mock)

---

## Getting Started
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Racheli76/Give-Get.git
   ```
2. **Install dependencies:**
   - Frontend:
     ```bash
     cd client/Give-Get-client
     npm install
     ```
   - Backend:
     Open `GiveAndGet-server` in Visual Studio and restore NuGet packages.
3. **Run the applications:**
   - Frontend:
     ```bash
     npm start
     ```
   - Backend:
     Run the WebAPI project from Visual Studio.

---

## Value Proposition
Give & Get is more than a talent exchange. It is a community built on trust, generosity, and growth. By participating, you:
- Expand your skills and knowledge
- Build meaningful connections
- Inspire and be inspired
- Make a positive impact on others

---

## 👨‍💻 Developers

**Racheli Cohen**  
https://github.com/Racheli76

**Shulamit Halbershtadt**  
https://github.com/Shu6136713
