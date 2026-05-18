import React from 'react';

const LoginForm: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <p className="text-muted-foreground">Authentication coming soon.</p>
      </div>
    </div>
  );
};

export { LoginForm };
export default LoginForm;
