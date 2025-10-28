import React from 'react';

import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { FilterSelectProps } from '@/typings';

export const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  placeholder = 'Selecione...',
  options,
  value,
  onValueChange,
  className,
}) => {
  return (
    <div className={className}>
      {label && <Label className="mb-2 block text-sm font-medium">{label}</Label>}
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};