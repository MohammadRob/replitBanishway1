import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success';
}

const StatCard = ({ title, value, icon, trend, color = 'primary' }: StatCardProps) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary-700';
      case 'secondary':
        return 'bg-secondary-50 text-secondary-700';
      case 'accent':
        return 'bg-accent-50 text-accent-700';
      case 'success':
        return 'bg-success-50 text-success-700';
      default:
        return 'bg-primary-50 text-primary-700';
    }
  };

  const getBorderColor = () => {
    switch (color) {
      case 'primary':
        return 'border-primary-100';
      case 'secondary':
        return 'border-secondary-100';
      case 'accent':
        return 'border-accent-100';
      case 'success':
        return 'border-success-100';
      default:
        return 'border-primary-100';
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive ? 'text-success-600' : 'text-error-600';
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? '↑' : '↓';
  };

  return (
    <div className={`rounded-lg border ${getBorderColor()} bg-white p-6 shadow-sm`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`rounded-full ${getColorClasses()} p-2`}>{icon}</div>
      </div>

      <div className="mt-4">
        <p className="text-2xl font-semibold">{value}</p>
        
        {trend && (
          <p className={`mt-2 text-sm ${getTrendColor()}`}>
            {getTrendIcon()} {trend.value}% from last week
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;