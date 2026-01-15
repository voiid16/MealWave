# MealWave

MealWave is a React-based web application that helps users find restaurants and check their waiting times.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/mealwave.git
   cd mealwave
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Authentication and Firestore in your Firebase project
   - Create a web app in your Firebase project and copy the configuration
   - Create a `.env` file in the root directory and add your Firebase configuration:
     ```
     VITE_FIREBASE_API_KEY=your-api-key
     VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
     VITE_FIREBASE_APP_ID=your-app-id
     ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173` to view the application.

## Building for Production

To create a production build, run:
```
npm run build
```

The built files will be in the `dist` directory.

## Technologies Used

- React
- Vite
- Firebase (Authentication, Firestore)
- Tailwind CSS
- React Router

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
