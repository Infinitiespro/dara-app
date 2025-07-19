'use client';

import { useEffect, useMemo, useState } from 'react';
import { Loader2, Pencil, Search, Star, Trash, PlusCircle, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { useUser } from '@/hooks/use-user';
import {
  createSavedPrompt,
  deleteSavedPrompt,
  editSavedPrompt,
  getSavedPrompts,
  setIsFavoriteSavedPrompt,
} from '@/server/actions/saved-prompt';
import { DeletePromptDialog } from './components/delete-prompt-dialog';
import { EditPromptDialog } from './components/edit-prompt-dialog';
import { FilterOption, FilterValue, PromptAction } from './types/prompt';

// Minimal Tooltip helper
function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <span className="group relative inline-block">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 scale-95 rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
        {label}
      </span>
    </span>
  );
}

const DEFAULT_FILTER: FilterValue = 'recentlyUsed';
const EMPTY_ACTION: PromptAction = { action: null, id: null };
const filterOptions: FilterOption[] = [
  { value: 'recentlyUsed', label: 'Recently Used' },
  { value: 'editedRecently', label: 'Edited Recently' },
  { value: 'latest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'favorites', label: 'Favorites' },
];

export default function SavedPromptsPage() {
  /**
   * To resuse the same dialog for both update and delete actions,
   * promptAction tracks what action is to be performed in which prompt (based on id)
   */
  const [promptAction, setPromptAction] = useState<PromptAction>(EMPTY_ACTION);

  const [filter, setFilter] = useState<FilterValue>(DEFAULT_FILTER);
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [savedPrompts, setSavedPrompts] = useState<any[]>([]);

  const { user } = useUser();

  useEffect(() => {
    async function fetchSavedPrompts() {
      try {
        const res = await getSavedPrompts();
        const savedPrompts = res?.data?.data || [];

        setSavedPrompts(savedPrompts);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    fetchSavedPrompts();
  }, []);

  // Primary Filter: Filter based on options, e.g. Recently used (or) Edited recently
  const primaryFilteredPrompts = useMemo(() => {
    if (filter === 'favorites') {
      return savedPrompts.filter((prompt) => prompt.isFavorite);
    }

    const promptsToSort = [...savedPrompts];
    if (filter === 'recentlyUsed') {
      sortPrompts(promptsToSort, 'lastUsedAt');
    } else if (filter === 'editedRecently') {
      sortPrompts(promptsToSort, 'updatedAt');
    } else if (filter === 'latest') {
      sortPrompts(promptsToSort, 'createdAt');
    } else if (filter === 'oldest') {
      sortPrompts(promptsToSort, 'createdAt', true);
    }

    return promptsToSort;
  }, [filter, savedPrompts]);

  // Secondary Filter : to filter based on the search term entered by the user in search bar
  const secondaryFilteredPrompts = useMemo(() => {
    const searchTerm = search.toLowerCase();
    return searchTerm !== ''
      ? primaryFilteredPrompts.filter((prompt) => {
          return (
            prompt.title.toLowerCase().includes(searchTerm) ||
            prompt.content.toLowerCase().includes(searchTerm)
          );
        })
      : primaryFilteredPrompts;
  }, [search, primaryFilteredPrompts]);

  function sortPrompts(
    prompts: any[],
    property: keyof any,
    swapComparison = false,
  ) {
    prompts.sort((a, b) => {
      const dateA =
        a[property] && typeof a[property] !== 'boolean'
          ? new Date(a[property]).getTime()
          : 0;

      const dateB =
        b[property] && typeof b[property] !== 'boolean'
          ? new Date(b[property]).getTime()
          : 0;

      return swapComparison ? dateA - dateB : dateB - dateA;
    });
  }

  async function handleSavePrompt() {
    if (!user) {
      toast.error('Unauthorized');
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error('Title cannot be empty');
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error('Prompt cannot be empty');
      return;
    }

    setIsLoading(true);

    toast.promise(
      createSavedPrompt({
        title: trimmedTitle,
        content: trimmedContent,
      }).then(async (res) => {
        if (!res?.data?.data) {
          throw new Error();
        }

        const savedPrompt = res.data.data;
        setSavedPrompts((old) => [...old, savedPrompt]);

        resetPromptAction();
      }),
      {
        loading: 'Saving prompt...',
        success: 'Prompt saved',
        error: 'Failed to save prompt',
      },
    );

    setIsLoading(false);
  }

  async function handleDeletePrompt() {
    if (!promptAction.id) return;

    setIsLoading(true);

    toast.promise(
      deleteSavedPrompt({ id: promptAction.id }).then(() => {
        setSavedPrompts((old) =>
          old.filter((element) => element.id !== promptAction.id),
        );

        resetPromptAction();
      }),
      {
        loading: 'Deleting prompt...',
        success: 'Prompt deleted',
        error: 'Failed to delete prompt',
      },
    );

    setIsLoading(false);
  }

  async function handleEditPrompt() {
    if (!promptAction.id) {
      toast.error('Prompt not found');
      return;
    }

    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }

    if (!content.trim()) {
      toast.error('Prompt cannot be empty');
      return;
    }

    setIsLoading(true);
    toast.promise(
      editSavedPrompt({
        id: promptAction.id,
        title: title.trim(),
        content: content.trim(),
      }).then(async (res) => {
        if (!res?.data?.data) {
          throw new Error();
        }

        const { id, title, content, updatedAt } = res.data.data;
        setSavedPrompts((old) =>
          old.map((element) =>
            element.id === id
              ? { ...element, title: title, content, updatedAt }
              : element,
          ),
        );

        resetPromptAction();
      }),
      {
        loading: 'Editing prompt...',
        success: 'Prompt edited',
        error: 'Failed to edit prompt',
      },
    );

    setIsLoading(false);
  }

  async function handleAddToFavorites(id: string, isFavorite: boolean) {
    toast.promise(
      setIsFavoriteSavedPrompt({ id, isFavorite }).then((res) => {
        if (!res?.data?.data) {
          throw new Error();
        }

        const { id, isFavorite } = res.data.data;
        setSavedPrompts((old) =>
          old.map((element) =>
            element.id === id ? { ...element, isFavorite } : element,
          ),
        );

        resetPromptAction();
      }),
      {
        loading: isFavorite
          ? 'Adding to favorites...'
          : 'Removing from favorites...',
        success: isFavorite
          ? 'Prompt added to favorites'
          : 'Prompt removed from favorites',
        error: 'Failed to add to favorites',
      },
    );
  }

  function resetPromptAction() {
    setPromptAction(EMPTY_ACTION);
  }

  function updatePromptAction(action: PromptAction) {
    setPromptAction(action);
  }

  function updateFilter(value: FilterValue) {
    // Unset current filter if selected again
    if (value === filter) {
      setFilter(DEFAULT_FILTER);
    } else {
      setFilter(value);
    }
  }

  // --- Filter Pills ---
  function FilterPills() {
    return (
      <div className="flex flex-row gap-2 overflow-x-auto">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateFilter(opt.value)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 whitespace-nowrap
              ${filter === opt.value ? 'bg-primary text-primary-foreground shadow' : 'bg-muted text-muted-foreground hover:bg-accent'}
            `}
            aria-pressed={filter === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  // --- Floating Action Button (FAB) ---
  function FabButton() {
    return (
      <button
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 shadow-xl hover:bg-primary/90 transition md:bottom-8 md:right-8 md:px-7 md:py-3.5"
        onClick={() => setPromptAction({ action: 'update', id: null })}
        aria-label="Add New Prompt"
      >
        <PlusCircle className="h-5 w-5" />
        <span className="font-semibold hidden sm:inline">New Prompt</span>
      </button>
    );
  }

  // --- Empty State ---
  function EmptyState() {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Inbox className="h-14 w-14 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No prompts saved yet</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-xs">Start by creating your first prompt. Organize, favorite, and edit your most powerful ideas for instant recall and creative flow.</p>
        <button
          className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2 shadow hover:bg-primary/90 transition"
          onClick={() => setPromptAction({ action: 'update', id: null })}
        >
          <PlusCircle className="h-5 w-5" />
          New Prompt
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 pb-24">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center pt-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">Saved Prompts</h1>
        <p className="text-muted-foreground text-lg mb-10 text-center max-w-2xl">
          Your personal library of AI prompts. Effortlessly organize, favorite, and edit your best ideas for instant recall and creative flow.
        </p>
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-full shadow bg-card/80 border border-border focus:ring-2 focus:ring-primary/30"
              placeholder="Search prompts..."
            />
          </div>
          <div className="flex flex-row items-center gap-3">
            <FilterPills />
            <EditPromptDialog
              promptAction={promptAction}
              updatePromptAction={updatePromptAction}
              handleEditPrompt={handleEditPrompt}
              handleSavePrompt={handleSavePrompt}
              title={title}
              content={content}
              setTitle={setTitle}
              setContent={setContent}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="w-full">
          {savedPrompts.length === 0 ? (
            isLoading ? (
              <div className="flex w-full items-center justify-center pt-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <EmptyState />
            )
          ) : secondaryFilteredPrompts.length === 0 ? (
            <div className="flex items-center justify-center gap-2 pt-20">
              No match found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {secondaryFilteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="group flex flex-col h-full rounded-2xl bg-card/80 backdrop-blur border border-border shadow-lg p-6 transition hover:shadow-xl hover:border-primary/40 relative"
                >
                  <div className="flex flex-row items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-foreground truncate max-w-[70%]">
                      {prompt.title}
                    </span>
                    <div className="flex flex-row items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
                      <Tooltip label={prompt.isFavorite ? 'Unfavorite' : 'Favorite'}>
                        <button
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                          onClick={() => handleAddToFavorites(prompt.id, !prompt.isFavorite)}
                          aria-label={prompt.isFavorite ? 'Unfavorite' : 'Favorite'}
                        >
                          <Star
                            fill={prompt.isFavorite ? 'hsl(var(--primary))' : 'none'}
                            className={`h-5 w-5 ${prompt.isFavorite ? 'text-primary' : ''}`}
                          />
                        </button>
                      </Tooltip>
                      <Tooltip label="Edit">
                        <button
                          onClick={() => {
                            setPromptAction({ action: 'update', id: prompt.id });
                            setTitle(prompt.title);
                            setContent(prompt.content);
                          }}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                          aria-label="Edit"
                        >
                          <Pencil className="h-5 w-5" />
                        </button>
                      </Tooltip>
                      <Tooltip label="Delete">
                        <button
                          onClick={() => setPromptAction({ action: 'delete', id: prompt.id })}
                          className="rounded p-1.5 text-muted-foreground hover:bg-accent/40 focus:bg-accent/40 focus:outline-none"
                          aria-label="Delete"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground flex-1 mb-2 overflow-hidden">
                    {prompt.content.trim().slice(0, 180) + (prompt.content.length > 180 ? '...' : '')}
                  </div>
                  <span className="text-xs text-muted-foreground/70 mt-auto text-right block">{prompt.updatedAt ? `Last edited: ${new Date(prompt.updatedAt).toLocaleString()}` : '—'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <DeletePromptDialog
          promptAction={promptAction}
          onOpenChange={resetPromptAction}
          handleDeletePrompt={handleDeletePrompt}
        />
      </div>
      <FabButton />
    </div>
  );
}
