# 🎯 Dart Scorer

Dart Scorer is a web application designed to help dart players easily track scores, manage game modes, and analyze throws. Built with modern technologies like **React**, **Tailwind CSS**, and the **Tremor** npm package, it offers a sleek and responsive interface for both casual and competitive players.

## 🚀 Features

### Core Functionality
- **Scoring Darts**: Keep track of scores with an intuitive interface.
- **Examples for Throws**: Display possible throws to finish a leg.
- **Game Modes**: Play various dart game modes like 301, 501, or custom games.
- **Live Updates**: Scores and suggested throws update in real-time.
- **Player Management**: Add multiple players and switch between turns seamlessly.

### Advanced Features
- **Leg Suggestions**: Receive possible finish options (e.g., for 170: T20, T20, Bull).
- **Statistics and Analytics**: View metrics like average score per turn, hit rate, and double checkout percentage.
- **Responsive Design**: Optimized for desktop and mobile use.

---

## 🛠️ Built With

- **React**: For building the interactive user interface.
- **Tailwind CSS**: For modern, customizable styling.
- **Tremor**: For beautiful and interactive data visualization components.

---

## 📖 Examples

### Scoring Darts
Add scores directly by entering dart values (e.g., T20 for Triple 20, D10 for Double 10). The app calculates the total and updates the leg status in real time.

### Example Throws to End a Leg
For a target score of 170, suggested throws might include:
1. Triple 20, Triple 20, Bullseye.
2. Triple 20, Triple 18, Double 16.

### Play Different Game Modes
- **301/501**: Standard dart games with double-out rule.
- **Custom Modes**: Configure unique rules and starting scores.

---

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/comhendrik/dart-scorer.git
   ```  
2. Navigate to the project directory:
   ```bash
   cd dart-scorer
   ```  
3. Install dependencies:
   ```bash
   npm install
   ```  
4. Start the development server:
   ```bash
   npm start
   ```  

---

## 🚢  Docker Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/comhendrik/dart-scorer.git
   ```  
2. Navigate to the project directory:
   ```bash
   cd dart-scorer
   ```  
3. Create Docker Image:
   ```bash
   docker build -t dart-scorer:latest .
   ```  
4. Run Docker Image:
   ```bash
   docker run -dp 80:80 --name dart-scorer --restart=always dart-scorer:latest
   ```  

---

## 🌟 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request to improve the project.

---

Enjoy your game! 🎯  
For questions or suggestions, please reach out to [hendrik0807@icloud.com](mailto:hendrik0807@icloud.com).

--- 

Let me know if you'd like any further adjustments!
