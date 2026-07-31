import Link from 'next/link';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function FeatureCard({ href, title, description, icon }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="block p-6 bg-bg-surface border border-border-subtle rounded-xl hover:border-accent-primary transition-colors group h-full"
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-bg-base border border-border-subtle text-accent-primary mb-4 group-hover:bg-accent-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-accent-primary transition-colors">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </Link>
  );
}
