# Environment Setup

## Required Environment Variables

After completing PHASE 1 of the remediation plan, you need to create a `.env.local` file in the
project root with the following variables:

```env
VITE_SUPABASE_URL=https://wkossxqvqntqhzdiyfdn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb3NzeHF2cW50cWh6ZGl5ZmRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODYzMTgsImV4cCI6MjA2MzA2MjMxOH0.cOtb4R51ffsp70R3TR16bMAHeO1WFnnAzsGSeCkp5RM
```

## Setup Instructions

1. Create a `.env.local` file in the project root
2. Copy the environment variables above into the file
3. Save the file
4. Restart the development server with `npm run dev`

## Security Note

The hardcoded credentials have been removed from the source code as part of PHASE 1 security
improvements. All Supabase credentials are now loaded from environment variables.
