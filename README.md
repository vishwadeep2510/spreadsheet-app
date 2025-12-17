# 📊 Spreadsheet Engine (React + Vite)

A lightweight spreadsheet application built using **React** and **Vite**, designed to mimic core spreadsheet functionalities such as formula evaluation, dynamic grid resizing, undo/redo support, and circular reference handling.


## ✨ Features

- Dynamic spreadsheet grid (up to **100 × 100**)
- Formula support with arithmetic operations
- Built-in functions:
  - `SUM`
  - `AVG`
  - `MIN`
  - `MAX`
- Cell range support (e.g. `SUM(A1:A5)`)
- Circular reference detection
- Undo and Redo functionality
- Single-click cell editing
- Scrollable and compact grid layout
- Clean, minimal spreadsheet-style UI



## 🧰 Tech Stack

- **React**
- **Vite**
- **JavaScript (ES6+)**
- **CSS (custom styling)**



## 🚀 Installation and Running the Project

### 1) Prerequisites

Make sure the following are installed on your system:

- **Node.js** (v16 or higher recommended)
- **npm**
- **Git**

Check versions:

```bash
node -v
npm -v
git --version
```
### 2)  Clone the Repository
```bash
git clone https://github.com/vishwadeep2510/spreadsheet-app.git
cd spreadsheet-app
```

### 3)  Install Dependencies

```bash
npm install
```
### 4) Run the deployment server
```bash
npm run dev
```

The application will be available at: http://localhost:5173

## Project Structure
```bash
src/
├── components/
│   ├── Spreadsheet.jsx
│   └── Cell.jsx
├── utils/
│   └── formula.js
├── styles.css
├── App.jsx
└── main.jsx
```
## Formula Examples
```bash
=A1 + B1
=SUM(A1:A5)
=AVG(B1:B10)
=MAX(A1, B1, C1)
=MIN(A2:A8)
```
