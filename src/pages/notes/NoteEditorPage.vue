<template>
  <ion-page>
    <AppHeader :title="isNew ? 'New Note' : 'Edit Note'">
      <template #start>
        <ion-back-button default-href="/notes" />
      </template>
      <template #end>
        <ion-button :disabled="!editor" @click="() => editor?.chain().focus().clearNodes().unsetAllMarks().run()">
          <ion-icon slot="icon-only" :icon="mdiFormatClear" />
        </ion-button>
        <ion-button :disabled="!editor" @click="() => editor?.chain().focus().undo().run()">
          <ion-icon slot="icon-only" :icon="mdiUndo" />
        </ion-button>
        <ion-button :disabled="!editor" @click="() => editor?.chain().focus().redo().run()">
          <ion-icon slot="icon-only" :icon="mdiRedo" />
        </ion-button>
        <ion-button :disabled="isSaving" @click="saveNote">
          <ion-spinner v-if="isSaving" slot="icon-only" name="crescent" />
          <ion-icon v-else slot="icon-only" :icon="mdiSave" />
        </ion-button>
      </template>
    </AppHeader>

    <ion-content class="editor-content">
      <div v-if="isLoadingNote" class="editor-loading">
        <ion-spinner name="crescent" />
      </div>
      <EditorContent v-else-if="editor" :editor="editor" class="editor-area" />
    </ion-content>

    <ion-footer>
      <ion-toolbar class="editor-toolbar">
        <div class="toolbar-scroll">
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('taskList') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleTaskList().run()"
          >
            <ion-icon slot="icon-only" :icon="mdiCheckCircleOutline" />
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('orderedList') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleOrderedList().run()"
          >
            <ion-icon slot="icon-only" :icon="mdiFormatListBulleted" />
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('bulletList') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleBulletList().run()"
          >
            <ion-icon slot="icon-only" :icon="mdiFormatAlignLeft" />
          </ion-button>
          <div class="toolbar-divider" />
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('underline') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleUnderline().run()"
          >
            <strong style="text-decoration: underline">U</strong>
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('bold') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleBold().run()"
          >
            <strong>B</strong>
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive('italic') ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().toggleItalic().run()"
          >
            <em>I</em>
          </ion-button>
          <div class="toolbar-divider" />
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().setTextAlign('left').run()"
          >
            <ion-icon slot="icon-only" :icon="mdiFormatAlignRight" />
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().setTextAlign('center').run()"
          >
            <ion-icon slot="icon-only" :icon="mdiMoreVert" />
          </ion-button>
          <ion-button
            fill="clear"
            size="small"
            :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'medium'"
            @click="() => editor?.chain().focus().setTextAlign('right').run()"
          >
            <ion-icon slot="icon-only" :icon="mdiFormatAlignCenter" />
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage,
  IonToolbar,
  IonContent,
  IonFooter,
  IonBackButton,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/vue';
import AppHeader from '@/shared/components/AppHeader.vue';
import {
  mdiFormatClear,
  mdiUndo,
  mdiRedo,
  mdiSave,
  mdiCheckCircleOutline,
  mdiFormatListBulleted,
  mdiFormatAlignLeft,
  mdiFormatAlignRight,
  mdiFormatAlignCenter,
  mdiMoreVert,
} from '@/shared/icons/material';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';

import { useNoteQuery } from '@/features/notes/composables/useNoteQuery';
import { useCreateNoteMutation } from '@/features/notes/composables/useCreateNoteMutation';
import { useUpdateNoteMutation } from '@/features/notes/composables/useUpdateNoteMutation';
import { parseNoteContent, tipTapJsonToPlainText } from '@/features/notes/utils/deltaConverter';
import { ROUTE_NAMES } from '@/shared/constants/routes';

const route = useRoute();
const router = useRouter();
const isSaving = ref(false);

const noteId = computed(() => {
  const id = route.params.id as string;
  return id === 'new' ? null : Number(id);
});

const isNew = computed(() => noteId.value === null);

const { data: noteData, isLoading: isLoadingNote } = useNoteQuery(
  computed(() => noteId.value ?? 0),
  computed(() => noteId.value !== null),
);

const createMutation = useCreateNoteMutation();
const updateMutation = useUpdateNoteMutation();

const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({ types: ['paragraph', 'heading'] }),
  ],
  content: '',
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none focus:outline-none',
    },
  },
});

// Load note content when data arrives
watch(noteData, (note) => {
  if (note?.content && editor.value) {
    const parsed = parseNoteContent(note.content);
    if (parsed) {
      editor.value.commands.setContent(parsed);
    }
  }
}, { immediate: true });

function saveNote() {
  if (!editor.value) return;
  isSaving.value = true;

  const json = editor.value.getJSON();
  const content = JSON.stringify(json);

  if (isNew.value) {
    // Extract title from first line
    const plainText = tipTapJsonToPlainText(json);
    const firstLine = plainText.split('\n')[0]?.trim() || 'Untitled';
    const title = firstLine.substring(0, 100);

    createMutation.mutate(
      { title, content },
      {
        onSuccess: (response) => {
          isSaving.value = false;
          // Navigate to the created note
          router.replace({
            name: ROUTE_NAMES.NOTE_EDITOR,
            params: { id: response.data.id },
          });
        },
        onError: () => {
          isSaving.value = false;
        },
      },
    );
  } else {
    updateMutation.mutate(
      { id: noteId.value!, payload: { content } },
      {
        onSuccess: () => {
          isSaving.value = false;
        },
        onError: () => {
          isSaving.value = false;
        },
      },
    );
  }
}

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.editor-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
}

.editor-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.editor-area {
  min-height: 100%;
}

.editor-area :deep(.ProseMirror) {
  min-height: 300px;
  outline: none;
  font-size: 15px;
  line-height: 1.6;
}

.editor-area :deep(.ProseMirror p) {
  margin: 0 0 8px;
}

.editor-area :deep(.ProseMirror ul[data-type='taskList']) {
  list-style: none;
  padding-left: 0;
}

.editor-area :deep(.ProseMirror ul[data-type='taskList'] li) {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.editor-area :deep(.ProseMirror ul[data-type='taskList'] li label) {
  margin-top: 2px;
}

.editor-toolbar {
  --padding-start: 0;
  --padding-end: 0;
}

.toolbar-scroll {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 8px;
  gap: 2px;
}

.toolbar-divider {
  width: 1px;
  height: 24px;
  background: var(--color-outline);
  margin: 0 4px;
  align-self: center;
}
</style>
