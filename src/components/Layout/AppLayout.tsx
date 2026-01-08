import React from 'react';
import NavBar from './NavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <NavBar />
            <main className="max-w-6xl mx-auto p-4">{children}</main>
        </div>
    );
}
