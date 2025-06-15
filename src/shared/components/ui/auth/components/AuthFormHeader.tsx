import { memo } from 'react';

export const AuthFormHeader = memo(function AuthFormHeader() {
  return (
    <div className="mb-8 text-center">
      <div className="mb-4 flex items-center justify-center gap-3">
        <img
          src="/assets/hourglass_logo.svg"
          alt="Task Flow Logo"
          className="size-8"
        />
        <h1 className="text-3xl font-semibold tracking-wide text-foreground">
          Task Flow
        </h1>
      </div>
    </div>
  );
});
