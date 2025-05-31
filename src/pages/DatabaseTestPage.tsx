
import DatabaseTestPanel from '@/components/admin/DatabaseTestPanel';

export default function DatabaseTestPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Database Testing</h1>
          <p className="text-muted-foreground mt-2">
            Validate data integrity and test all CRUD operations
          </p>
        </div>
        
        <DatabaseTestPanel />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            This panel tests all database operations to ensure data integrity and proper validation.
            Run tests after making changes to database schema or validation rules.
          </p>
        </div>
      </div>
    </div>
  );
}
