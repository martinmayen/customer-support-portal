# 🏨 Speke Hotel Customer Support Portal-(Demo)

A responsive **Customer Support Portal** designed for Speke hotel in Uganda.  
Built with **HTML**, **CSS**, **Bootstrap**, and **vanilla JavaScript** — no build tools required.  
This version includes a **single dashboard** with login, ticket management, and FAQs all in one page.

![Speke Hotel Customer Support Portal UI](assets/screenshot.png)

---

## 📌 Features
- **Simulated Login** for Guest and Admin roles
  - Guest: Can view FAQs and open tickets
  - Admin: Can view all tickets (open/closed) and respond
- **Ticket Management**
  - Create tickets (Guest)
  - View tickets by status
  - Change ticket status (Admin)
- **Hotel-Themed FAQ Section**
  - Bootstrap accordions with common questions
  - Scroll seamlessly from login to FAQs
- **Responsive Design**
  - Mobile-friendly navigation and layout
  - Hotel-style typography using Google Fonts (`Merriweather`)
- **Branding**
  - Placeholder logo in the navbar (replace with your own hotel logo)

---

## 📂 Project Structure
customer/support-portal/
│
├── index.html              # Main page (Dashboard with Login + FAQ)
│
├── assets/
│   ├── css/
│   │   └── style.css       # Custom hotel-themed styling
│   ├── js/
│   │   └── app.js          # Simulated login + tickets logic
│   └── logo.png            # Hotel logo placeholder

---

## 🚀 How to Run
1. **Download or Clone** this repository.
2. Open `index.html` in any modern web browser.
3. No installation needed — everything runs in the browser.

---

## 🔑 Login Details
For demo purposes:
- **Admin Login:**  
  - Username: `admin`  
  - Password: `admin123`
- **Guest Login:**  
  - Username: `guest`  
  - Password: `guest123`

---

## 🛠️ Technologies Used
- **HTML5**
- **CSS3** (Custom + Bootstrap)
- **Bootstrap 5** (CDN)
- **Vanilla JavaScript**

---

## 🎨 Customization
- Replace `assets/logo.png` with your hotel’s logo.
- Update FAQ content inside `index.html` under the `<section id="faq-section">`.
- Modify styles in `assets/css/style.css` to match your hotel’s branding.

---

## 📄 License
This project is open source and available under the MIT License.
