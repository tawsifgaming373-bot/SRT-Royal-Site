# 🎨 SRT Royal Site - Frontend Designer Hiring Platform

![SRT Royal](public/Logo_Image.png)

> **An intelligent platform connecting businesses with visionary frontend designers worldwide.**

---

## 📋 Overview

**SRT Royal Site** is a modern, secure full-stack platform designed to simplify the hiring process between clients and professional frontend designers. Clients can fill out a simple hire request form and get connected with talented designers through WhatsApp or Email.

---

## ✨ Key Features

- 🔐 **Secure Authentication** - User sign-in & sign-up with JWT tokens
- 🛡️ **Advanced Security** - JWT-based authorization (7 days expiry) + bcryptjs password hashing
- 👤 **User Profiles** - Manage designer profiles and portfolios
- 📋 **Hire Request Form** - Simple form for clients to submit designer hire requests
- 💬 **Direct Contact** - Connect via WhatsApp or Email
- 🌐 **CORS Enabled** - Seamless frontend-backend integration
- 📱 **Responsive Design** - Works on all devices
- ⚡ **RESTful API** - Clean, scalable backend architecture

---

## 🎯 How It Works

### For Clients:
1. ✅ Browse or sign up on the platform
2. ✅ Fill out the **Hire Designer Form** with project details
3. ✅ Receive direct contact information (WhatsApp/Email)
4. ✅ Connect with the perfect designer

### For Designers:
1. ✅ Create your profile
2. ✅ Showcase your portfolio
3. ✅ Receive client inquiries
4. ✅ Start collaborating

---

## 🛠 Tech Stack

### Backend
- **Node.js** (v14+) - Runtime environment
- **Express.js** - Web framework
- **JWT** - Secure authentication
- **bcryptjs** - Password encryption
- **CORS** - Cross-origin support

### Frontend
- **HTML5** - Markup structure
- **CSS3** - Modern styling
- **Vanilla JavaScript** - Interactive features
- **Responsive Design** - Mobile-first approach

### Database
- **JSON** - Lightweight data storage

---

## 📦 Installation

### Prerequisites
```bash
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git
```

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tawsifgaming373-bot/SRT-Royal-Site.git
   cd SRT-Royal-Site
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure your .env file:**
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-key-here
   JWT_EXPIRY=7d
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Access the application:**
   - Open your browser and navigate to: `http://localhost:3000`

---

## 📁 Project Structure

```
SRT-Royal-Site/
├── public/                      # Frontend files
│   ├── index.html              # Main HTML page
│   ├── app.js                  # Frontend JavaScript (auth, forms, profile)
│   ├── style.css               # Main styles
│   ├── Logo_Image.png          # SRT brand logo
│   └── T.jpg                   # CEO profile photo
├── data/                        # Data storage
│   └── users.json              # User data (auto-created)
├── server.js                    # Express backend server
├── package.json                 # Dependencies & scripts
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
└── README.md                   # Documentation
```

---

## 🔑 Authentication Flow

### Sign Up
1. User enters email and password
2. Password is hashed using bcryptjs
3. User data is stored securely
4. JWT token is generated (7 days validity)

### Sign In
1. User provides credentials
2. Password is verified against stored hash
3. JWT token is issued on success
4. Token is used for subsequent requests

### Logout
1. Token is cleared from browser
2. Session ends

---

## 📝 Hire Designer Form

The platform includes a simple **Hire Designer Form** where clients can:
- Enter project details
- Specify design requirements
- Choose communication preference (WhatsApp/Email)
- Submit inquiry

**Form Fields:**
- Project Title
- Project Description
- Budget Range
- Timeline
- Design Style Preferences
- Client Name
- Client Email
- Client WhatsApp Number (optional)

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user

### Designers
- `GET /api/designers` - Get all designers
- `GET /api/designers/:id` - Get designer profile
- `PUT /api/designers/:id` - Update designer profile

### Hire Requests
- `POST /api/hire-requests` - Submit hire request
- `GET /api/hire-requests/:id` - Get hire request details

---

## 🔒 Security Features

✅ **JWT Authentication** - Secure token-based auth  
✅ **Password Hashing** - bcryptjs encryption  
✅ **CORS Protection** - Controlled cross-origin requests  
✅ **Input Validation** - Prevent malicious data  
✅ **Secure Headers** - Additional protection layers  

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com)
- [JWT Guide](https://jwt.io)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [MDN Web Docs](https://developer.mozilla.org)

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📋 To-Do / Roadmap

- [ ] Add payment integration
- [ ] Implement designer ratings & reviews
- [ ] Add portfolio upload feature
- [ ] Email notifications
- [ ] Advanced search filters
- [ ] Designer availability calendar
- [ ] Project tracking dashboard
- [ ] Video call integration

---

## 🐛 Known Issues & Troubleshooting

### Issue: Port already in use
**Solution:** Change the port in `.env` file or kill the process using port 3000

### Issue: Database not connecting
**Solution:** Ensure `data/` directory exists and has write permissions

### Issue: JWT token invalid
**Solution:** Clear browser cache and login again. Check JWT_SECRET in .env

---

## 📞 Support & Contact

- **Issues & Bugs:** [GitHub Issues](https://github.com/tawsifgaming373-bot/SRT-Royal-Site/issues)
- **Email:** support@srtroyal.com
- **WhatsApp:** [Contact us](https://wa.me/1234567890)

---

## 👨‍💼 About

**SRT Royal Site** is built with ❤️ by the SRT development team to bridge the gap between businesses and talented frontend designers worldwide.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### What you can do:
✅ Use commercially  
✅ Modify the code  
✅ Distribute the software  
✅ Private use  

### What you must do:
⚠️ Include license and copyright notice  

---

## 🙏 Acknowledgments

- Express.js community
- Node.js foundation
- All our amazing designers and clients
- Open source contributors

---

## 📊 Statistics

- **Platform Type:** Full-Stack Web Application
- **Current Version:** 1.0.0
- **Status:** Active Development
- **Last Updated:** May 18, 2026

[⬆ Back to Top](#-srt-royal-site---frontend-designer-hiring-platform)
