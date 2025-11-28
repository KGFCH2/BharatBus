import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

function getStrengthLevel(password: string): { score: number; label: string; color: string } {
  const passedCount = requirements.filter((req) => req.test(password)).length;
  
  if (passedCount === 0) return { score: 0, label: '', color: 'bg-gray-500' };
  if (passedCount <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
  if (passedCount <= 2) return { score: 2, label: 'Fair', color: 'bg-orange-500' };
  if (passedCount <= 3) return { score: 3, label: 'Good', color: 'bg-yellow-500' };
  if (passedCount <= 4) return { score: 4, label: 'Strong', color: 'bg-green-500' };
  return { score: 5, label: 'Very Strong', color: 'bg-emerald-500' };
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const { score, label, color } = getStrengthLevel(password);

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full ${color} rounded-full`}
          />
        </div>
        {label && (
          <span className={`text-xs font-medium ${color.replace('bg-', 'text-')}`}>
            {label}
          </span>
        )}
      </div>

      {/* Requirements checklist */}
      <div className="grid grid-cols-1 gap-1">
        {requirements.map((req, index) => {
          const passed = req.test(password);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2 text-xs ${
                passed ? 'text-green-400' : 'text-white/40'
              }`}
            >
              {passed ? (
                <Check className="w-3 h-3" />
              ) : (
                <X className="w-3 h-3" />
              )}
              <span>{req.label}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
