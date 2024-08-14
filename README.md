# StudyPal

**StudyPal** is a React Native application designed to help users create and study flashcards. With StudyPal, you can create sets of cards, mark your favorite ones, and even use a Question and Answer (Q&A) mode to reinforce your learning. The app includes features like learning notifications, card flipping, and score tracking, making it a powerful tool for anyone looking to study efficiently.

## Features

- **Create and Manage Flashcards:** Organize your study materials into sets.
- **Learn Mode:** Flip cards and test your knowledge.
- **Question & Answer Mode:** Type in your answers for better retention.
- **Favorites:** Mark cards as favorites to access them quickly.
- **Learning Notifications:** Get reminders to study regularly.

## Prerequisites

To run StudyPal locally, you'll need the following:

- **Node.js** and **npm** (Node Package Manager)
- **Expo CLI**: A toolchain built around React Native to simplify development.
- **Android Studio**: For running the app on an Android emulator.
- **Android Virtual Device (AVD)**: We recommend using a Pixel 8 Pro virtual device for the best performance.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/PJR23/StudyPal.git
    ```

2. **Navigate to the project directory:**

    ```bash
    cd studypal
    ```

3. **Install the dependencies:**

    ```bash
    npm install
    ```

4. **Set up the Android emulator:**

    - Open **Android Studio** and navigate to the **AVD Manager**.
    - Create a new virtual device (we recommend **Pixel 8 Pro**).
    - Ensure that the AVD is running before starting the app.

## Running the App

1. **Start the Expo development server:**

    ```bash
    npx expo start
    ```

2. **Run the app on your Android emulator:**

    - Ensure your Android emulator (Pixel 8 Pro) is running in Android Studio.
    - In the Expo development server, press `a` to open the app on the Android emulator.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
