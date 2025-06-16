
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Store } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: 'student' | 'faculty' | 'canteen_owner') => void;
  selectedRole?: string;
}

const RoleSelector = ({ onRoleSelect, selectedRole }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'student',
      title: 'Student',
      description: 'Order food from campus canteens',
      icon: User,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'faculty',
      title: 'Faculty',
      description: 'Order food from campus canteens',
      icon: User,
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'canteen_owner',
      title: 'Canteen Owner',
      description: 'Manage your canteen and receive orders',
      icon: Store,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Your Role</h3>
        <p className="text-sm text-gray-600">Select how you plan to use the platform</p>
      </div>
      
      <div className="grid gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          
          return (
            <Card 
              key={role.id}
              className={`cursor-pointer transition-all ${role.color} ${
                isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : ''
              }`}
              onClick={() => onRoleSelect(role.id as 'student' | 'faculty' | 'canteen_owner')}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 ${
                    role.id === 'canteen_owner' ? 'text-orange-600' : 
                    role.id === 'faculty' ? 'text-green-600' : 'text-blue-600'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{role.title}</h4>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
