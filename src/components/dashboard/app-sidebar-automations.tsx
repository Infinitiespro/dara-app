'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import {
  AlertTriangle,
  ChevronDown,
  CircleCheck,
  CircleX,
  Hourglass,
  Loader2,
  MoreHorizontal,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useActions } from '@/hooks/use-actions';
import { useUser } from '@/hooks/use-user';
import { NO_CONFIRMATION_MESSAGE } from '@/lib/constants';
import { EVENTS } from '@/lib/events';
import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

interface ActionMenuItemProps {
  action: any;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onEdit: (
    id: string,
    data: Partial<any>,
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const ActionMenuItem = ({ action, onDelete, onEdit }: ActionMenuItemProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: action.name || action.description,
    description: action.description.replace(NO_CONFIRMATION_MESSAGE, ''),
    frequency: action.frequency ?? null,
    maxExecutions: action.maxExecutions ?? null,
  });

  const handleDelete = async () => {
    const loadingToast = toast.loading('Deleting automation...');

    try {
      const result = await onDelete(action.id);
      if (result?.success) {
        toast.dismiss(loadingToast);
        toast.success('Automation deleted');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to delete automation');
    }
  };

  const handleEdit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const loadingToast = toast.loading('Updating automation...');

    try {
      const result = await onEdit(action.id, {
        name: formData.name,
        description: formData.description + NO_CONFIRMATION_MESSAGE,
        frequency: formData.frequency,
        maxExecutions: formData.maxExecutions,
      });

      if (result?.success) {
        toast.dismiss(loadingToast);
        toast.success('Automation updated');
        setIsEditing(false);
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to update automation');
    } finally {
      setIsLoading(false);
    }
  };

  // Show warning if action has failed more recently than last success
  const hasWarning = !!(
    action.lastFailureAt &&
    action.lastSuccessAt &&
    action.lastFailureAt > action.lastSuccessAt
  );

  // Show error is action has failed and never succeeded
  const hasError = !!(action.lastFailureAt && !action.lastSuccessAt);

  // Show success if action has succeeded more recently than last failure
  const hasSuccess = !!(
    action.lastSuccessAt &&
    (!action.lastFailureAt || action.lastSuccessAt > action.lastFailureAt)
  );

  // Show pending if action has never succeeded or failed
  const hasPending = !!!action.lastExecutedAt;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href={`/chat/${action.conversationId}`}>
            {hasWarning && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                </TooltipTrigger>
              </Tooltip>
            )}
            {hasError && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleX className="h-4 w-4 shrink-0 text-destructive" />
                </TooltipTrigger>
              </Tooltip>
            )}
            {hasSuccess && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <CircleCheck className="h-4 w-4 shrink-0 text-success" />
                </TooltipTrigger>
              </Tooltip>
            )}
            {hasPending && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Hourglass className="h-4 w-4 shrink-0" />
                </TooltipTrigger>
              </Tooltip>
            )}
            <span>{action.name}</span>
          </Link>
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction>
              <MoreHorizontal className="h-4 w-4" />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
              <PencilIcon className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete}>
              <TrashIcon className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <Dialog
        open={isEditing}
        onOpenChange={(open) => {
          if (!isLoading) {
            setIsEditing(open);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Automation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter action name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Message</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter message"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (seconds)</Label>
              <Input
                id="frequency"
                type="number"
                value={formData.frequency ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    frequency: e.target.value
                      ? parseInt(e.target.value, 10)
                      : null, // Parse or null
                  }))
                }
                placeholder="Enter frequency in seconds"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxExecutions">Max Executions</Label>
              <Input
                id="maxExecutions"
                type="number"
                value={formData.maxExecutions ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    maxExecutions: e.target.value
                      ? parseInt(e.target.value, 10)
                      : null, // Parse or null
                  }))
                }
                placeholder="Enter max executions"
                disabled={isLoading}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEdit}
                disabled={isLoading || !formData.description.trim()}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const AppSidebarAutomations = () => {
  const pathname = usePathname();
  const { isLoading: isUserLoading, user } = useUser();
  const {
    actions,
    isLoading: isActionsLoading,
    error,
    mutate: refreshActions,
  } = useActions(user?.id);
  const [isOpen, setIsOpen] = useState(true);

  // Listen for action creation events
  const handleActionMutation = async () => {
    try {
      await refreshActions();
    } catch (error) {
      console.error('[Sidebar] Error refreshing actions:', error);
    }
  };

  useEffect(() => {
    window.addEventListener(EVENTS.ACTION_CREATED, handleActionMutation);
    window.addEventListener(EVENTS.ACTION_REFRESH, handleActionMutation);

    return () => {
      window.removeEventListener(EVENTS.ACTION_CREATED, handleActionMutation);
      window.removeEventListener(EVENTS.ACTION_REFRESH, handleActionMutation);
    };
  }, [refreshActions]);

  // Add effect to log actions changes
  useEffect(() => {}, [actions]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete action');
      }

      await refreshActions();
      return data;
    } catch (error) {
      console.error('Failed to delete action:', error);
      throw error;
    }
  };

  const handleEdit = async (id: string, data: Partial<any>) => {
    try {
      const response = await fetch(`/api/actions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update action');
      }
      await refreshActions();
      return responseData;
    } catch (error) {
      console.error('Failed to edit action:', error);
      throw error;
    }
  };
};