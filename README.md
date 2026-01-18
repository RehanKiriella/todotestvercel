**How to Run Locally**


1. Clone and Install

git clone https://github.com/RehanKiriella/todoabacappfinal.git

cd todoabacappfinal

npm install

2. Please create a file named .env in the root directory and add the following:

NEXT_PUBLIC_APP_URL="http://localhost:3000"

BETTER_AUTH_URL="http://localhost:3000"

DATABASE_URL="file:./dev.db"

BETTER_AUTH_SECRET="any_long_random_string_here"


3. Initialise the Local Database

npx drizzle-kit push


4. Start Server

npm run dev

**Access the app at: http://localhost:3000/**
