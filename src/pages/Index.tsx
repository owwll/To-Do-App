import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, ListChecks, Shield, Zap } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <span className="font-serif font-bold text-xl text-foreground">Taskflow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Sign in</Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="gap-1.5">
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
        <div className="animate-fade-in space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Zap className="h-3.5 w-3.5" />
            Simple. Beautiful. Productive.
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-bold text-foreground leading-tight">
            Organize your life,{' '}
            <span className="text-primary">one task</span> at a time
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            A beautifully crafted to-do app that helps you stay focused and accomplish more with less clutter.
          </p>

          <div className="flex gap-3 justify-center">
            <Link to="/register">
              <Button size="lg" className="gap-2 text-base px-8">
                Start for free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-20 w-full animate-slide-up">
          {[
            { icon: ListChecks, title: 'Task Management', desc: 'Add, edit, complete, and delete tasks with ease' },
            { icon: Shield, title: 'Secure & Private', desc: 'Your tasks are protected with JWT authentication' },
            { icon: Zap, title: 'Lightning Fast', desc: 'Real-time updates with a snappy, responsive UI' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
              <Icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-serif font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-muted-foreground">
        Crafted with care using React
      </footer>
    </div>
  );
};

export default Index;
