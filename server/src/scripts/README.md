# Database Management Scripts

This directory contains scripts for managing the database of the IA4Nieup platform.

## Available Scripts

### 1. Reset Database

```bash
node src/scripts/resetDatabase.js
```

This script drops all collections in the database, effectively resetting it to a clean state.

### 2. Populate Initial Data

```bash
node src/scripts/populateInitialData.js
```

This script populates the database with initial data including goals, assessments, and other core content.

### 3. Populate Achievements

```bash
node src/scripts/populateAchievements.js
```

This script populates the database with achievement definitions for the gamification system.

### 4. Populate Collaborative Data

```bash
node src/scripts/populateCollaborativeData.js
```

This script populates the database with collaborative content like forum posts, shared resources, and study groups.

### 5. Populate Demo Data

```bash
node src/scripts/populateDemoData.js
```

This script creates demo users with different profiles, pathways, and gamification data for testing.

### 6. Fix Quiz Questions

```bash
node src/scripts/fixQuizQuestions.js
```

This script fixes quiz questions by randomizing the order of options so the first option isn't always the correct one.

### 7. Generate Random Quizzes

```bash
node src/scripts/generateRandomQuizzes.js
```

This script generates random quizzes for all modules in all goals.

### 8. Export/Import Database

```bash
# Export
node src/scripts/exportDatabase.js export

# Import
node src/scripts/exportDatabase.js import
```

These commands export the database to JSON files or import from previously exported files.

### 9. Setup Full Database

```bash
node src/scripts/setupFullDatabase.js
```

This script runs all the necessary scripts in sequence to set up a complete database from scratch.

## Demo Accounts

After running the setup scripts, the following demo accounts will be available:

- **Student**: student@ucad.edu.sn / Student123!
- **Admin**: admin@ucad.edu.sn / Admin123!
- **Advanced User**: advanced@ucad.edu.sn / Advanced123!
- **Beginner User**: beginner@ucad.edu.sn / Beginner123!

## Notes

- Make sure MongoDB is running before executing these scripts
- The scripts use the MongoDB URI from the .env file
- Some scripts depend on others (e.g., populateDemoData.js requires goals created by populateInitialData.js)
- For a complete setup, run setupFullDatabase.js which handles all dependencies
