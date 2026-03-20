import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';

const scoreSchema = z.object({
  value: z
    .number({ invalid_type_error: 'Score must be a number' })
    .int('Score must be a whole number')
    .min(1, 'Score must be at least 1')
    .max(45, 'Score must be at most 45'),
  date: z.string().min(1, 'Date is required'),
});

function ScoreEntry({ onAdd, loading, currentCount = 0 }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data) => {
    const result = await onAdd({ value: data.value, date: data.date });
    if (result?.success) {
      reset({ date: new Date().toISOString().split('T')[0], value: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score-value">Score (1-45)</Label>
          <Input
            id="score-value"
            type="number"
            min={1}
            max={45}
            placeholder="e.g. 32"
            {...register('value', { valueAsNumber: true })}
          />
          {errors.value && (
            <p className="text-xs text-red-400">{errors.value.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="score-date">Date</Label>
          <Input
            id="score-date"
            type="date"
            {...register('date')}
          />
          {errors.date && (
            <p className="text-xs text-red-400">{errors.date.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-forest-900/30 border-t-forest-900 rounded-full animate-spin" />
            Adding...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Score {currentCount >= 5 ? '(replaces oldest)' : `(${currentCount}/5)`}
          </span>
        )}
      </Button>
    </form>
  );
}

export default ScoreEntry;
